// Temporary capture utility: drives headless Chrome over CDP to screenshot pages.
// Usage: node screenshots/capture.mjs
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const OUT = 'C:/ai/Proposal Genie/PersonalAI-Dashboard/screenshots';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const key = (code, vk, keyName, type = 'rawKeyDown') => ({
  type,
  windowsVirtualKeyCode: vk,
  nativeVirtualKeyCode: vk,
  code,
  key: keyName,
});

const shots = [
  {
    name: 'neon-invaders-start.png',
    url: 'http://localhost:62339/space-invaders',
    wait: 4000,
    keys: [],
  },
  {
    // Start the game, then drive real gameplay: move + autofire for ~4s
    name: 'neon-invaders-gameplay.png',
    url: 'http://localhost:62339/space-invaders',
    wait: 3500,
    keys: [
      { k: key('Enter', 13, 'Enter'), gap: 800 },
      { k: key('Space', 32, ' '), gap: 120 },
      { k: key('ArrowRight', 39, 'ArrowRight'), gap: 350 },
      { k: key('ArrowRight', 39, 'ArrowRight'), gap: 120 },
      { k: key('Space', 32, ' '), gap: 120 },
      { k: key('ArrowLeft', 37, 'ArrowLeft'), gap: 350 },
      { k: key('ArrowLeft', 37, 'ArrowLeft'), gap: 120 },
      { k: key('Space', 32, ' '), gap: 120 },
      { k: key('Space', 32, ' '), gap: 120 },
      { k: key('Space', 32, ' '), gap: 600 },
      { k: key('Space', 32, ' '), gap: 120 },
    ],
    probe: `JSON.stringify({
      visibility: document.visibilityState,
      startBtn: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('START GAME')),
      pauseDisabled: Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('PAUSE'))?.disabled,
      score: document.body.innerText.match(/SCORE\s+([0-9]+)/)?.[1] ?? null,
    })`,
  },
  {
    name: 'oneshot-coder-model.png',
    url: 'file:///C:/ai/Proposal%20Genie/PersonalAI-Dashboard/book/demo/oneshot-coder-model.html',
    wait: 4000,
    keys: [],
  },
  {
    name: 'oneshot-small-model.png',
    url: 'file:///C:/ai/Proposal%20Genie/PersonalAI-Dashboard/book/demo/oneshot-small-model.html',
    wait: 4000,
    keys: [],
  },
];

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1280,900',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=C:/ai/Proposal Genie/PersonalAI-Dashboard/screenshots/.chrome-profile',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

const waitForPort = async () => {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome did not start');
};

let msgId = 0;
const pending = new Map();
let ws;

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

const nav = async (url, waitMs, keys, probe) => {
  await send('Page.navigate', { url });
  await sleep(waitMs);
  for (const step of keys) {
    await send('Input.dispatchKeyEvent', step.k);
    await send('Input.dispatchKeyEvent', { ...step.k, type: 'keyUp' });
    await sleep(step.gap ?? 120);
  }
  await sleep(2500);
  if (probe) {
    const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
    console.log(`probe[${url}]:`, r.result?.value ?? JSON.stringify(r));
  }
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  return Buffer.from(data, 'base64');
};

try {
  await waitForPort();
  const targets = await (await fetch(`http://localhost:${PORT}/json/list`)).json();
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error('No page target');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      }
    };
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  mkdirSync(OUT, { recursive: true });

  for (const shot of shots) {
    const png = await nav(shot.url, shot.wait, shot.keys, shot.probe);
    writeFileSync(`${OUT}/${shot.name}`, png);
    console.log(`saved ${shot.name} (${png.length} bytes)`);
  }
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
}
