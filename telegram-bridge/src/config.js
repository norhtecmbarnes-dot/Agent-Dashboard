import "dotenv/config";

function required(name) {
  const value = (process.env[name] || "").trim();
  if (!value) {
    console.error(`\n[bridge] Missing required setting: ${name}`);
    console.error("[bridge] Copy .env.example to .env and fill it in.\n");
    process.exit(1);
  }
  return value;
}

function number(name, fallback) {
  const raw = (process.env[name] || "").trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadConfig() {
  const chatIds = required("TELEGRAM_CHAT_ID")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return {
    botToken: required("TELEGRAM_BOT_TOKEN"),
    chatIds: new Set(chatIds),
    apiUrl: (process.env.OPENMUSE_API_URL || "http://127.0.0.1:8787").trim(),
    accessKey: (process.env.OPENMUSE_ACCESS_KEY || "").trim(),
    threadId: (process.env.BRIDGE_THREAD_ID || "").trim() || null,
    replyTimeoutMs: number("REPLY_TIMEOUT_MS", 180_000),
    pollIntervalMs: number("POLL_INTERVAL_MS", 2_000),
    chunkSize: number("TELEGRAM_CHUNK_SIZE", 3500),
  };
}
