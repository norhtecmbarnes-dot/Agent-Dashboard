// llama.cpp OpenAI Responses shim:
// rewrites content-part type "text" -> "input_text" (and "output_text" -> "text")
// in /v1/responses requests/streams so TanStack AI works against llama-server.
import http from "node:http";

const UPSTREAM_HOST = process.env.LLAMACPP_HOST ?? "127.0.0.1";
const UPSTREAM_PORT = Number(process.env.LLAMACPP_PORT ?? 8080);
const PORT = Number(process.env.SHIM_PORT ?? 8391);

function deepMapContent(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === "object") {
        if (item.type === "text") return { ...item, type: "input_text" };
        if (item.type === "output_text") return { ...item, type: "input_text" };
        if (item.type === "text/plain") return { ...item, type: "input_text" };
        if (item.type === "summary_text") return { ...item, type: "input_text" };
        if (item.type === "refusal") return { ...item, type: "input_text" };
      }
      return item;
    });
  }
  return value;
}

function rewrite(value) {
  if (Array.isArray(value)) return value.map(rewrite);
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      if (key === "content" && Array.isArray(item)) out.content = deepMapContent(item);
      else if (key === "output" && Array.isArray(item)) out.output = deepMapContent(item);
      else if (key === "input" && Array.isArray(item)) out.input = rewrite(item);
      else out[key] = rewrite(item);
    }
    return out;
  }
  return value;
}

const server = http.createServer((request, response) => {
  let raw = "";
  request.on("data", (chunk) => (raw += chunk));
  request.on("end", () => {
    const headers = { ...request.headers };
    delete headers.host;
    headers.host = `${UPSTREAM_HOST}:${UPSTREAM_PORT}`;

    let body = raw;
    if (raw && request.url.includes("/responses")) {
      try {
        const parsed = JSON.parse(raw);
        const patched = rewrite(parsed);
        body = JSON.stringify(patched);
      } catch {
        // passthrough non-JSON
      }
    }

    const upstream = http.request(
      {
        host: UPSTREAM_HOST,
        port: UPSTREAM_PORT,
        path: request.url,
        method: request.method,
        headers: { ...headers, "content-length": Buffer.byteLength(body) },
      },
      (up) => {
        response.writeHead(up.statusCode, up.headers);
        up.pipe(response);
      },
    );
    upstream.on("error", (error) => {
      response.writeHead(502, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: { message: `llama.cpp upstream error: ${error.message}` } }));
    });
    upstream.end(body);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`llama.cpp responses shim listening on http://127.0.0.1:${PORT} -> ${UPSTREAM_HOST}:${UPSTREAM_PORT}`);
});