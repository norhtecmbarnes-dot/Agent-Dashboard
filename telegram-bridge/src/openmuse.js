import { randomUUID } from "node:crypto";

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

  /** Ordered AG-UI event log for a thread (RUN_STARTED, TEXT_MESSAGE_CONTENT, RUN_FINISHED...). */
  async threadEvents(threadId) {
    await this.#ensureSession();
    const data = await this.#json(`/api/copilotkit/threads/${encodeURIComponent(threadId)}/events`);
    return Array.isArray(data.events) ? data.events : [];
  }

  /**
   * Send one user message and wait for the agent's reply.
   *
   * Dispatches a run to the CopilotKit runtime, then follows the thread's AG-UI
   * event log until the run finishes, assembling the assistant text from
   * TEXT_MESSAGE_CONTENT deltas. A tool result alone is not a reply, so the
   * stream is followed to RUN_FINISHED rather than stopping at the first
   * non-user output. Returns `{ text, threadId, runId, toolCalls }`.
   */
  async chat(prompt, { threadId, onToolCall } = {}) {
    await this.#ensureSession();
    const targetThread = threadId || (await this.mainThread());
    // A brand-new thread has no event log until its first run, so a missing
    // baseline is expected and correct. The cursor advances on every poll so
    // events are never processed twice.
    let cursor = 0;
    try {
      cursor = (await this.threadEvents(targetThread)).length;
    } catch {
      cursor = 0;
    }

    const dispatchRunId = randomUUID();
    const input = {
      threadId: targetThread,
      runId: dispatchRunId,
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

    const toolCalls = [];
    const seenToolCalls = new Set();
    let text = "";
    let runId = dispatched?.runId || dispatchRunId;
    let settled = false;
    let runError = null;
    const deadline = Date.now() + this.timeoutMs;
    let lastError = null;

    while (Date.now() < deadline) {
      await sleep(this.pollIntervalMs);
      let events;
      try {
        events = await this.threadEvents(canonicalThread);
      } catch (error) {
        lastError = error;
        continue;
      }
      const fresh = events.length >= cursor ? events.slice(cursor) : events;
      cursor = events.length;
      for (const event of fresh) {
        if (event.run_id || event.runId) runId = event.run_id || event.runId;
        if (event.type === "TEXT_MESSAGE_CONTENT" && typeof event.delta === "string") {
          text += event.delta;
        } else if (event.type === "TOOL_CALL_START") {
          const id = event.toolCallId;
          if (id && !seenToolCalls.has(id)) {
            seenToolCalls.add(id);
            const call = { id, name: String(event.toolCallName || "tool") };
            toolCalls.push(call);
            if (onToolCall) await onToolCall(call);
          }
        } else if (event.type === "RUN_ERROR") {
          runError = typeof event.message === "string" ? event.message : "The agent reported an error";
        } else if (event.type === "RUN_FINISHED") {
          settled = true;
        }
      }
      if (settled || runError) break;
    }

    if (runError) throw new Error(runError);
    if (!settled) {
      const suffix = lastError ? ` Last error: ${lastError.message}` : "";
      throw new Error(
        `The agent did not reply within ${Math.round(this.timeoutMs / 1000)}s.${suffix}`,
      );
    }
    return { text: text.trim(), threadId: canonicalThread, runId, toolCalls };
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
