# llama.cpp Responses shim

A tiny, dependency-free proxy that lets the agent talk to **llama.cpp** over the
OpenAI **Responses API**.

## Why it exists

The default backend is llama.cpp, served at `http://127.0.0.1:8080/v1`. But
llama-server's `/v1/responses` route and the OpenAI Responses request that
OpenMuse/TanStack sends disagree on one detail: the message **content-part
type**.

| Sender | Content part type |
|---|---|
| OpenMuse (TanStack AI) | `text` / `output_text` |
| llama.cpp expects | `input_text` |

Send the wrong one and llama-server replies **`400 Bad Request`**. This shim
rewrites the content-part types on the way through, so the same request that the
hosted OpenAI API accepts also works against your local llama-server.

```
OpenMuse :8788 ──► shim :8391 ──► llama-server :8080
        (type:"text")   (type:"input_text")
```

Ollama does **not** need this shim — its `/v1/responses` accepts OpenMuse's
request shape as-is. Only the llama.cpp path uses it.

## Run it

No install required (uses only the Node standard library):

```bash
node shim.mjs
# llamacpp responses shim listening on http://127.0.0.1:8391 -> 127.0.0.1:8080
```

Or point OpenMuse's `.env` at it and start llama-server first:

```env
OPENAI_BASE_URL=http://127.0.0.1:8391/v1
```

`E:\ai\start-stack.ps1` starts llama-server, this shim, then OpenMuse in the
right order.

## Configuration

| Env var | Default | Meaning |
|---|---|---|
| `SHIM_PORT` | `8391` | Port the shim listens on |
| `LLAMACPP_HOST` | `127.0.0.1` | Upstream llama-server host |
| `LLAMACPP_PORT` | `8080` | Upstream llama-server port |

## Verify

```bash
# llama-server itself (after `llama-server -hf ... --jinja`):
curl http://127.0.0.1:8080/v1/responses -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:120b","input":[{"role":"user","content":[{"type":"input_text","text":"ping"}]}]}'

# through the shim, using the type OpenMuse actually sends:
curl http://127.0.0.1:8391/v1/responses -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:120b","input":[{"role":"user","content":[{"type":"text","text":"ping"}]}]}'
```

Both should return a `200` with a JSON response object. The first will return
`400` if you switch `input_text` to `text` — that is the bug this shim fixes.
