import assert from "node:assert/strict";
import { test } from "node:test";
import { chunk, summarizeSnapshot, taskLine } from "../src/format.js";
import { OpenMuseClient } from "../src/openmuse.js";

/** A tiny mock of global fetch that records calls and returns queued responses. */
function mockFetch(handler) {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options, body: options.body ? JSON.parse(options.body) : undefined });
    const result = await handler(url, options);
    if (result instanceof Error) throw result;
    return {
      ok: result.status >= 200 && result.status < 300,
      status: result.status,
      text: async () => (result.body === undefined ? "" : JSON.stringify(result.body)),
    };
  };
  fetchImpl.calls = calls;
  return fetchImpl;
}

test("chunk keeps short text intact and splits long text under the limit", () => {
  assert.deepEqual(chunk("hi"), ["hi"]);
  assert.deepEqual(chunk("   "), []);
  const long = "word ".repeat(2000).trim();
  const parts = chunk(long, 500);
  assert.ok(parts.length > 1);
  for (const part of parts) assert.ok(part.length <= 500, `part too long: ${part.length}`);
});

test("chunk prefers paragraph boundaries", () => {
  const text = `${"a".repeat(300)}\n\n${"b".repeat(300)}`;
  const parts = chunk(text, 400);
  assert.equal(parts.length, 2);
  assert.equal(parts[0], "a".repeat(300));
  assert.equal(parts[1], "b".repeat(300));
});

test("taskLine maps internal statuses to human labels", () => {
  assert.equal(taskLine({ title: "Pay rent", status: "waiting_approval" }), "• Pay rent — waiting for approval");
  assert.equal(taskLine({ title: "Ship it", status: "succeeded" }), "• Ship it — done");
});

test("summarizeSnapshot counts each category", () => {
  const summary = summarizeSnapshot({
    tasks: [
      { title: "A", status: "running" },
      { title: "B", status: "waiting_input" },
      { title: "C", status: "succeeded" },
    ],
    goals: [{ status: "active" }, { status: "completed" }],
    ideas: [{ status: "new" }, { status: "dismissed" }],
    notifications: [{ read: false }, { read: true }],
    worker: { running: true },
  });
  assert.match(summary, /worker running/);
  assert.match(summary, /Active tasks: 2/);
  assert.match(summary, /Finished tasks: 1/);
  assert.match(summary, /Goals: 1/);
  assert.match(summary, /New ideas: 1/);
  assert.match(summary, /Unread notifications: 1/);
  assert.match(summary, /• A — running/);
});

test("client opens a session and reuses the token", async () => {
  const fetchImpl = mockFetch((url) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "tok-1", mode: "sample" } };
    if (url.endsWith("/api/agent")) return { status: 200, body: { tasks: [] } };
    return { status: 404, body: { error: "nope" } };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl });
  await api.snapshot();
  await api.snapshot();
  const sessionCalls = fetchImpl.calls.filter((c) => c.url.endsWith("/api/session"));
  assert.equal(sessionCalls.length, 1, "session should be opened once");
  const agentCall = fetchImpl.calls.find((c) => c.url.endsWith("/api/agent"));
  assert.equal(agentCall.options.headers.Authorization, "Bearer tok-1");
});

test("client surfaces API error messages", async () => {
  const fetchImpl = mockFetch(() => ({ status: 401, body: { error: "Access key is incorrect" } }));
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl });
  await assert.rejects(() => api.connect(), /Access key is incorrect/);
});

test("pendingActions returns only awaiting_review actions", async () => {
  const fetchImpl = mockFetch((url) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.endsWith("/api/workspace"))
      return {
        status: 200,
        body: {
          actions: [
            { id: "1", status: "awaiting_review" },
            { id: "2", status: "succeeded" },
            { id: "3", status: "awaiting_review" },
          ],
        },
      };
    return { status: 404, body: {} };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl });
  const pending = await api.pendingActions();
  assert.deepEqual(
    pending.map((a) => a.id),
    ["1", "3"],
  );
});

test("chat dispatches a run and follows events to RUN_FINISHED", async () => {
  let dispatched = false;
  let polls = 0;
  const fetchImpl = mockFetch((url, options) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.endsWith("/api/main-thread")) return { status: 200, body: { threadId: "thread-1" } };
    if (url.includes("/agent/default/run")) {
      const body = JSON.parse(options.body);
      assert.equal(body.threadId, "thread-1");
      assert.equal(body.messages[0].content, "hello");
      assert.equal(body.messages[0].role, "user");
      dispatched = true;
      return { status: 200, body: { threadId: "thread-1", runId: body.runId, joinToken: "j" } };
    }
    if (url.includes("/threads/thread-1/events")) {
      if (!dispatched) return { status: 200, body: { events: [] } };
      polls += 1;
      const full = [
        { type: "RUN_STARTED" },
        { type: "TEXT_MESSAGE_CONTENT", delta: "hi " },
        { type: "TEXT_MESSAGE_CONTENT", delta: "there" },
        { type: "RUN_FINISHED" },
      ];
      return { status: 200, body: { events: polls === 1 ? full.slice(0, 3) : full } };
    }
    return { status: 404, body: {} };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl, pollIntervalMs: 1, timeoutMs: 5000 });
  const result = await api.chat("hello");
  assert.equal(result.text, "hi there");
  assert.equal(result.threadId, "thread-1");
});

test("chat does not treat a tool result as the final reply", async () => {
  let dispatched = false;
  const fetchImpl = mockFetch((url) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.includes("/agent/default/run")) {
      dispatched = true;
      return { status: 200, body: { threadId: "t1" } };
    }
    if (url.includes("/threads/t1/events")) {
      if (!dispatched) return { status: 200, body: { events: [] } };
      // A tool call and its result arrive first; the actual reply comes later.
      return {
        status: 200,
        body: {
          events: [
            { type: "RUN_STARTED" },
            { type: "TOOL_CALL_START", toolCallId: "c1", toolCallName: "browse_web" },
            { type: "TOOL_CALL_RESULT", toolCallId: "c1", content: "raw page json" },
            { type: "TEXT_MESSAGE_CONTENT", delta: "CopilotKit builds agent UIs." },
            { type: "RUN_FINISHED" },
          ],
        },
      };
    }
    return { status: 404, body: {} };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl, pollIntervalMs: 1, timeoutMs: 5000 });
  const result = await api.chat("summarize copilotkit.ai", { threadId: "t1" });
  assert.equal(result.text, "CopilotKit builds agent UIs.");
  assert.deepEqual(
    result.toolCalls.map((c) => c.name),
    ["browse_web"],
  );
});

test("chat on a brand-new thread tolerates a missing baseline", async () => {
  let dispatched = false;
  const fetchImpl = mockFetch((url) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.includes("/agent/default/run")) {
      dispatched = true;
      return { status: 200, body: { threadId: "fresh-1" } };
    }
    if (url.includes("/threads/fresh-1/events")) {
      // Before the run the thread does not exist yet; the client must tolerate that.
      if (!dispatched) return { status: 500, body: { error: "Thread not found" } };
      return {
        status: 200,
        body: {
          events: [
            { type: "TEXT_MESSAGE_CONTENT", delta: "ok" },
            { type: "RUN_FINISHED" },
          ],
        },
      };
    }
    return { status: 404, body: {} };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl, pollIntervalMs: 1, timeoutMs: 5000 });
  const result = await api.chat("hello", { threadId: "fresh-1" });
  assert.equal(result.text, "ok");
});

test("chat forwards tool calls once", async () => {
  let dispatched = false;
  const fetchImpl = mockFetch((url) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.includes("/agent/default/run")) {
      dispatched = true;
      return { status: 200, body: { threadId: "t1" } };
    }
    if (url.includes("/threads/t1/events")) {
      if (!dispatched) return { status: 200, body: { events: [] } };
      return {
        status: 200,
        body: {
          events: [
            { type: "TOOL_CALL_START", toolCallId: "call-1", toolCallName: "delegate_task" },
            { type: "TOOL_CALL_START", toolCallId: "call-1", toolCallName: "delegate_task" },
            { type: "TEXT_MESSAGE_CONTENT", delta: "working" },
            { type: "RUN_FINISHED" },
          ],
        },
      };
    }
    return { status: 404, body: {} };
  });
  const seen = [];
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl, pollIntervalMs: 1, timeoutMs: 5000 });
  await api.chat("go", { threadId: "t1", onToolCall: (call) => seen.push(call.id) });
  assert.deepEqual(seen, ["call-1"]);
});

test("chat surfaces a RUN_ERROR", async () => {
  let dispatched = false;
  const fetchImpl = mockFetch((url) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.includes("/agent/default/run")) {
      dispatched = true;
      return { status: 200, body: { threadId: "t1" } };
    }
    if (url.includes("/threads/t1/events")) {
      if (!dispatched) return { status: 200, body: { events: [] } };
      return {
        status: 200,
        body: { events: [{ type: "RUN_ERROR", message: "model unavailable" }] },
      };
    }
    return { status: 404, body: {} };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl, pollIntervalMs: 1, timeoutMs: 5000 });
  await assert.rejects(() => api.chat("hi", { threadId: "t1" }), /model unavailable/);
});

test("chat times out with a clear error", async () => {
  const fetchImpl = mockFetch((url) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.includes("/agent/default/run")) return { status: 200, body: { threadId: "t1" } };
    if (url.includes("/threads/t1/events"))
      return { status: 200, body: { events: [{ type: "RUN_STARTED" }] } };
    return { status: 404, body: {} };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl, pollIntervalMs: 1, timeoutMs: 30 });
  await assert.rejects(() => api.chat("hello", { threadId: "t1" }), /did not reply within/);
});

test("decideAction posts the hash and decision", async () => {
  const fetchImpl = mockFetch((url, options) => {
    if (url.endsWith("/api/session")) return { status: 200, body: { token: "t", mode: "sample" } };
    if (url.includes("/api/actions/act-1/decide")) {
      const body = JSON.parse(options.body);
      assert.deepEqual(body, { hash: "abc", decision: "approve" });
      return { status: 200, body: { id: "act-1", title: "Send “Hi”" } };
    }
    return { status: 404, body: {} };
  });
  const api = new OpenMuseClient({ baseUrl: "http://x", fetchImpl });
  const result = await api.decideAction("act-1", "abc", "approve");
  assert.equal(result.id, "act-1");
});
