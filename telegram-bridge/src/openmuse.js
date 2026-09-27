import { randomUUID } from "node:crypto";

const REPLY_ROLES = new Set(["assistant", "tool"]);

function textOf(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part.text === "string") return part.text;
        return "";
      })
      .join("");
  }
  return "";
}

/**
 * A thin client for the OpenMuse HTTP API.
 *
 * Everything the bridge needs lives behind a session token obtained from
 * POST /api/session. Chat is delivered through the CopilotKit runtime:
 * a run is dispatched to /api/copilotkit/agent/:id/run and the reply is read
 * back from the persisted CopilotKit Intelligence thread.
 */
export class OpenMuseClient {
  constructor({
    baseUrl,
    accessKey = "",
    timeoutMs = 180_000,
    pollIntervalMs = 2_000,
    fetchImpl = globalThis.fetch,
  }) {
    this.baseUrl = String(baseUrl || "").replace(/\/$/, "");
    this.accessKey = accessKey;
    this.timeoutMs = timeoutMs;
    this.pollIntervalMs = pollIntervalMs;
    this.fetch = fetchImpl;
    this.token = null;
    this.mode = null;
  }

  async #json(path, { method = "GET", body, auth = true } = {}) {
    const headers = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth && this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await this.fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const raw = await response.text();
    let payload = null;
    if (raw) {
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = { error: raw.slice(0, 300) };
      }
    }
    if (!response.ok) {
      const message =
        (payload && typeof payload.error === "string" && payload.error) ||
        `OpenMuse request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  /** Establish a session. Safe to call repeatedly. */
  async connect() {
    const session = await this.#json("/api/session", {
      method: "POST",
      body: { accessKey: this.accessKey || undefined },
      auth: false,
    });
    this.token = session.token;
    this.mode = session.mode;
    return session;
  }

  async #ensureSession() {
    if (!this.token) await this.connect();
  }

  async health() {
    const response = await this.fetch(`${this.baseUrl}/api/health`);
    if (!response.ok) throw new Error(`OpenMuse health check failed (${response.status})`);
    return response.json();
  }

  /** The stable main conversation thread for this owner. */
  async mainThread() {
    await this.#ensureSession();
    const main = await this.#json("/api/main-thread");
    return main.threadId;
  }

  /** Task/goal/monitor/notification snapshot. */
  async snapshot() {
    await this.#ensureSession();
    return this.#json("/api/agent");
  }

  async taskDetail(id) {
    await this.#ensureSession();
    return this.#json(`/api/agent/tasks/${encodeURIComponent(id)}`);
  }

  /** Pending action reviews (email sends, calendar changes). */
  async pendingActions() {
    await this.#ensureSession();
    const workspace = await this.#json("/api/workspace");
    return (workspace.actions || []).filter((a) => a.status === "awaiting_review");
  }

  async decideAction(id, hash, decision) {
    await this.#ensureSession();
    return this.#json(`/api/actions/${encodeURIComponent(id)}/decide`, {
      method: "POST",
      body: { hash, decision },
    });
  }

  async controlTask(id, action) {
    await this.#ensureSession();
    return this.#json(`/api/agent/tasks/${encodeURIComponent(id)}/control`, {
      method: "POST",
      body: { action },
    });
  }

  async threadMessages(threadId) {
    await this.#ensureSession();
    const data = await this.#json(`/api/copilotkit/threads/${encodeURIComponent(threadId)}/messages`);
    return Array.isArray(data.messages) ? data.messages : [];
  }

  /**
   * Send one user message and wait for the agent's reply.
   *
   * Dispatches a run to the CopilotKit runtime, then polls the persisted
   * Intelligence thread until a new assistant/tool message appears. Returns
   * `{ text, threadId, runId, toolCalls }`.
   */
  async chat(prompt, { threadId, onToolCall } = {}) {
    await this.#ensureSession();
    const targetThread = threadId || (await this.mainThread());
    // A brand-new thread does not exist in Intelligence until its first run,
    // so an empty baseline is expected and correct in that case.
    let before = [];
    try {
      before = await this.threadMessages(targetThread);
    } catch {
      before = [];
    }
    const knownIds = new Set(before.map((m) => m.id));

    const runId = randomUUID();
    const input = {
      threadId: targetThread,
      runId,
      state: null,
      messages: [{ id: randomUUID(), role: "user", content: prompt }],
      tools: [],
      context: [],
      forwardedProps: {},
    };
    const dispatched = await this.#json("/api/copilotkit/agent/default/run", {
      method: "POST",
      body: input,
    });
    const canonicalThread = dispatched?.threadId || targetThread;

    const seenToolCalls = new Set();
    const deadline = Date.now() + this.timeoutMs;
    let lastError = null;

    while (Date.now() < deadline) {
      await sleep(this.pollIntervalMs);
      let messages;
      try {
        messages = await this.threadMessages(canonicalThread);
      } catch (error) {
        lastError = error;
        continue;
      }
      const fresh = messages.filter((m) => !knownIds.has(m.id) && m.role !== "user");
      const toolCalls = [];
      for (const message of fresh) {
        if (message.role !== "assistant") continue;
        for (const call of message.toolCalls || []) {
          if (seenToolCalls.has(call.id)) continue;
          seenToolCalls.add(call.id);
          toolCalls.push(call);
          if (onToolCall) await onToolCall(call);
        }
      }
      const reply = fresh
        .filter((m) => REPLY_ROLES.has(m.role))
        .map((m) => textOf(m.content))
        .filter((t) => t.trim())
        .join("\n\n")
        .trim();
      if (reply) return { text: reply, threadId: canonicalThread, runId, toolCalls };
    }

    const suffix = lastError ? ` Last error: ${lastError.message}` : "";
    throw new Error(`The agent did not reply within ${Math.round(this.timeoutMs / 1000)}s.${suffix}`);
  }

  /** Start a brand-new Rich Threads conversation. */
  async newThread() {
    await this.#ensureSession();
    return randomUUID();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
