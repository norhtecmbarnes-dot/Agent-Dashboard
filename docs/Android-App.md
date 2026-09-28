# Android App — chat with your agent from your phone

OpenMuse includes a mobile client (`apps/mobile`, Expo / React Native). Agent Dashboard uses it as-is — you just point it at your own API.

## Option 1 — Expo Go (zero setup, recommended first)

1. Install **Expo Go** from the Play Store on your phone
2. On the PC:

```bash
cd OpenMuse
pnpm --dir apps/mobile start
```

3. Scan the QR code with Expo Go
4. In the app, set the API URL to `http://<your-PC-LAN-IP>:8787`

Find your PC's LAN IP:

```powershell
ipconfig    # Windows — look for IPv4 Address on your Wi-Fi/Ethernet adapter
```

Phone and PC must be on the same network.

## Option 2 — Build an APK

Requires an Expo account (free):

```bash
cd OpenMuse/apps/mobile
npx eas-cli build -p android --profile preview
```

EAS builds in the cloud and gives you an install link — open it on the phone and install the APK. Then set the API URL to your PC's address as above.

## Option 3 — Android Studio (full local build)

Requires Android Studio + SDK:

```bash
cd OpenMuse
pnpm --dir apps/mobile android
```

## Pointing at your API

The app needs to reach the OpenMuse API (port 8787):

- **Same network:** `http://<PC-LAN-IP>:8787`
- **Outside your LAN:** use a tunnel (`ngrok http 8787`, Tailscale, Cloudflare Tunnel) and prefer HTTPS. **Do not expose the plain-HTTP API to the public internet.**

## What works from the phone

- Chat with the agent (gpt-oss-120b)
- Approvals arrive in the app just like in the web UI
- Telegram is the lighter-weight alternative — see `docs/Telegram.md` if you just want quick control

## Troubleshooting

| Symptom | Fix |
|---|---|
| App can't connect | Phone and PC on same network? Firewall allowing 8787? Right IP? |
| QR code doesn't load | Use the Expo Go app's scanner (not the camera app) on Android |
| Requests time out | PC asleep / API not running — check `http://<ip>:8787/api/health` in the phone's browser |

## Verify

- [ ] App loads and shows a chat screen
- [ ] Message sent from the phone gets a streamed reply
- [ ] `http://<PC-LAN-IP>:8787/api/health` reachable from the phone's browser

## Credits

The mobile client (`apps/mobile`) is [OpenMuse](https://github.com/CopilotKit/OpenMuse)'s Expo/React Native app (MIT), used as-is. This guide covers pointing it at your own API.