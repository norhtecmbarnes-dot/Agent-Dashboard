/** Split long text on paragraph/word boundaries so it fits Telegram's limit. */
export function chunk(text, size = 3500) {
  const source = String(text ?? "").trim();
  if (!source) return [];
  if (source.length <= size) return [source];
  const parts = [];
  let rest = source;
  while (rest.length > size) {
    let cut = rest.lastIndexOf("\n\n", size);
    if (cut < size * 0.5) cut = rest.lastIndexOf("\n", size);
    if (cut < size * 0.5) cut = rest.lastIndexOf(" ", size);
    if (cut <= 0) cut = size;
    parts.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
  }
  if (rest) parts.push(rest);
  return parts;
}

const STATUS_LABELS = {
  queued: "queued",
  running: "running",
  waiting_approval: "waiting for approval",
  waiting_input: "waiting for your input",
  scheduled: "scheduled",
  paused: "paused",
  succeeded: "done",
  failed: "failed",
  cancelled: "cancelled",
};

export function taskLine(task) {
  const status = STATUS_LABELS[task.status] || task.status;
  return `• ${task.title} — ${status}`;
}

export function summarizeSnapshot(snapshot) {
  const tasks = snapshot.tasks || [];
  const active = tasks.filter((t) =>
    ["queued", "running", "waiting_approval", "waiting_input", "scheduled", "paused"].includes(
      t.status,
    ),
  );
  const done = tasks.filter((t) => ["succeeded", "failed", "cancelled"].includes(t.status));
  const pending = (snapshot.ideas || []).filter((i) => i.status === "new");
  const goals = (snapshot.goals || []).filter((g) => g.status === "active");
  const unread = (snapshot.notifications || []).filter((n) => !n.read);

  const lines = ["Agent Dashboard", ""];
  lines.push(`Mode: ${snapshot.worker?.running ? "worker running" : "worker idle"}`);
  lines.push(`Active tasks: ${active.length}`);
  lines.push(`Finished tasks: ${done.length}`);
  lines.push(`Goals: ${goals.length}`);
  lines.push(`New ideas: ${pending.length}`);
  lines.push(`Unread notifications: ${unread.length}`);
  if (active.length) {
    lines.push("", "Active work");
    for (const task of active.slice(0, 8)) lines.push(taskLine(task));
  }
  return lines.join("\n");
}
