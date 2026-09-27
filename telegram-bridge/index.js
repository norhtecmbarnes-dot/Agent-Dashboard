import { Bot, InlineKeyboard } from "grammy";
import { loadConfig } from "./src/config.js";
import { chunk, summarizeSnapshot } from "./src/format.js";
import { OpenMuseClient } from "./src/openmuse.js";

const config = loadConfig();
const api = new OpenMuseClient({
  baseUrl: config.apiUrl,
  accessKey: config.accessKey,
  timeoutMs: config.replyTimeoutMs,
  pollIntervalMs: config.pollIntervalMs,
});

// Conversation state per chat: the thread to talk on and busy/queue flag.
const state = new Map();
function chatState(chatId) {
  if (!state.has(chatId)) state.set(chatId, { threadId: config.threadId, busy: false });
  return state.get(chatId);
}

const bot = new Bot(config.botToken);

bot.use(async (ctx, next) => {
  const chatId = ctx.chat?.id;
  const allowed = chatId !== undefined && config.chatIds.has(String(chatId));
  if (!allowed) {
    if (ctx.message) console.log(`[bridge] ignoring chat ${chatId}`);
    return;
  }
  await next();
});

async function send(chatId, text) {
  for (const part of chunk(text, config.chunkSize)) {
    await bot.api.sendMessage(chatId, part, { disable_web_page_preview: true });
  }
}

async function withReply(chatId, fn) {
  await bot.api.sendChatAction(chatId, "typing").catch(() => {});
  const keepAlive = setInterval(
    () => bot.api.sendChatAction(chatId, "typing").catch(() => {}),
    Math.min(config.pollIntervalMs * 2, 8000),
  );
  try {
    await fn();
  } finally {
    clearInterval(keepAlive);
  }
}

async function askAgent(ctx, prompt) {
  const chatId = ctx.chat.id;
  const session = chatState(chatId);
  if (session.busy) {
    await ctx.reply("Still working on the previous message — one moment.");
    return;
  }
  session.busy = true;
  const status = await ctx.reply("Thinking…");
  try {
    const result = await api.chat(prompt, { threadId: session.threadId });
    session.threadId = result.threadId;
    await bot.api.editMessageText(chatId, status.message_id, "Done.").catch(() => {});
    await send(chatId, result.text);
  } catch (error) {
    await bot.api
      .editMessageText(chatId, status.message_id, "The agent could not reply.")
      .catch(() => {});
    await ctx.reply(`Error: ${error.message}`);
    console.error("[bridge]", error);
  } finally {
    session.busy = false;
  }
}

bot.command("start", async (ctx) => {
  let mode = "unknown";
  try {
    mode = (await api.health()).mode;
  } catch {}
  await ctx.reply(
    [
      "Agent Dashboard bridge is live.",
      `OpenMuse: ${config.apiUrl} (${mode})`,
      "",
      "Send any message to talk to your agent.",
      "Commands: /help /status /new /tasks /approvals",
    ].join("\n"),
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    [
      "Commands",
      "/start   – welcome and connection status",
      "/help    – this list",
      "/status  – agent and API health",
      "/tasks   – active and finished work",
      "/new     – start a fresh conversation thread",
      "/approvals – review pending email/calendar actions",
      "",
      "Any other text is sent to your agent.",
    ].join("\n"),
  );
});

bot.command("status", async (ctx) => {
  try {
    const health = await api.health();
    const snapshot = await api.snapshot();
    await ctx.reply(
      [
        `API: ${health.ok ? "healthy" : "unhealthy"} (${health.mode})`,
        `Model configured: ${health.agentConfigured ? "yes" : "no"}`,
        `Browser configured: ${health.browserConfigured ? "yes" : "no"}`,
        `Worker: ${snapshot.worker?.running ? "running" : "idle"}`,
      ].join("\n"),
    );
  } catch (error) {
    await ctx.reply(`Could not reach OpenMuse: ${error.message}`);
  }
});

bot.command("tasks", async (ctx) => {
  try {
    await send(ctx.chat.id, summarizeSnapshot(await api.snapshot()));
  } catch (error) {
    await ctx.reply(`Could not load tasks: ${error.message}`);
  }
});

bot.command("new", async (ctx) => {
  const session = chatState(ctx.chat.id);
  session.threadId = await api.newThread();
  await ctx.reply("Started a new conversation. Your next message begins a fresh thread.");
});

bot.command("approvals", async (ctx) => {
  try {
    const pending = await api.pendingActions();
    if (!pending.length) {
      await ctx.reply("No actions are waiting for review.");
      return;
    }
    for (const action of pending.slice(0, 10)) {
      const keyboard = new InlineKeyboard()
        .text("Approve", `approve:${action.id}:${action.hash}`)
        .text("Deny", `deny:${action.id}:${action.hash}`);
      await ctx.reply(
        [`Review: ${action.title}`, action.account ? `Account: ${action.account}` : ""]
          .filter(Boolean)
          .join("\n"),
        { reply_markup: keyboard },
      );
    }
  } catch (error) {
    await ctx.reply(`Could not load approvals: ${error.message}`);
  }
});

bot.on("callback_query:data", async (ctx) => {
  const [decision, id, hash] = ctx.callbackQuery.data.split(":");
  if (!["approve", "deny"].includes(decision) || !id || !hash) {
    await ctx.answerCallbackQuery({ text: "Unknown action." });
    return;
  }
  try {
    const result = await api.decideAction(id, hash, decision);
    await ctx.answerCallbackQuery({ text: `${decision === "approve" ? "Approved" : "Denied"}.` });
    await ctx.editMessageReplyMarkup({ reply_markup: undefined }).catch(() => {});
    await ctx.reply(`Review ${decision === "approve" ? "approved" : "denied"}: ${result.title}`);
  } catch (error) {
    await ctx.answerCallbackQuery({ text: error.message.slice(0, 180), show_alert: true });
  }
});

bot.on("message:text", async (ctx) => {
  const prompt = ctx.message.text.trim();
  if (!prompt || prompt.startsWith("/")) return;
  await withReply(ctx.chat.id, () => askAgent(ctx, prompt));
});

bot.catch((error) => {
  console.error("[bridge] bot error", error.error ?? error);
});

async function main() {
  try {
    const health = await api.health();
    console.log(`[bridge] OpenMuse API reachable at ${config.apiUrl} (${health.mode})`);
  } catch (error) {
    console.error(`[bridge] OpenMuse API not reachable at ${config.apiUrl}: ${error.message}`);
    console.error("[bridge] Is `pnpm dev` running in OpenMuse?");
    process.exit(1);
  }
  try {
    await api.connect();
    console.log(
      `[bridge] session opened (${api.mode}); authorized chats: ${[...config.chatIds].join(", ")}`,
    );
  } catch (error) {
    console.error(`[bridge] could not open an OpenMuse session: ${error.message}`);
    process.exit(1);
  }
  console.log("[bridge] long-polling Telegram. Press Ctrl+C to stop.");
  await bot.start({
    allowed_updates: ["message", "callback_query"],
    onStart: (info) => console.log(`[bridge] connected as @${info.username}`),
  });
}

process.on("SIGINT", async () => {
  console.log("\n[bridge] stopping…");
  await bot.stop();
  process.exit(0);
});

main().catch((error) => {
  console.error("[bridge] fatal", error);
  process.exit(1);
});
