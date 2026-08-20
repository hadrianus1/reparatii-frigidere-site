---
name: run
description: Launch and verify this fridge-repair site (CRA frontend + Express API) locally, and screenshot it to confirm a change actually renders.
---

# Running this site

## Frontend only — default, sufficient for content/copy/layout/CSS changes

```
npm run dev
```

- Compiles `src/App.jsx` with Create React App and serves it on **port 3003** (from `.env`'s `PORT`; CRA picks up `.env` automatically).
- `package.json`'s `proxy` field points at `http://localhost:3003` — i.e. itself, since no backend is running alongside it. `/api/*` calls (`/api/health`, `/api/posts`, fired from `App.jsx`'s boot `useEffect`) fail silently — every fetch there ends in `.catch(() => {})` — so the page still renders completely, just with an empty blog list ("Momentan nu există articole publicate."). That's expected, not a bug, for anything that isn't blog/comments/admin work.
- First compile takes ~20-30s. Wait for `Compiled successfully!` in the output before checking the page — don't just poll the port, webpack keeps the port open before the bundle is ready.
- **Stopping it via the harness's background-task-stop does not free port 3003 on Windows** — `npm run dev` spawns `react-scripts`/`node.exe` as a detached child that survives the wrapper being torn down. Confirmed by relaunching `npm run dev` right after stopping the task and getting `Something is already running on port 3003.`. Find the real PID and kill it directly:
  ```bash
  netstat -ano | grep ":3003" | grep LISTENING   # last column is the PID
  taskkill //PID <pid> //F
  ```

## Full stack — needed for blog / comments / admin / reactions work

```
npm run build
```

then, with `NODE_ENV=production` set (`$env:NODE_ENV="production"; node server.js` in PowerShell, `NODE_ENV=production node server.js` in Git Bash), run `node server.js`. Only with `NODE_ENV=production` does `server.js` serve the built frontend at all (see `Static serving is production-only` in `CLAUDE.md`) — otherwise it's API-only. This serves the real frontend build and the `/api/*` routes together on port 3003.

Without a real `DATABASE_URL` in `.env`, the API runs on an in-memory store — data resets on every restart, which is normal for local testing.

## Screenshotting to verify a change

Neither `chromium-cli` nor a `playwright` devDependency is present in this repo. What works in this environment: `npx` fetches and caches `playwright` (a Chromium binary is already available, no `playwright install` step needed).

Whole-page screenshot:

```
npx --yes playwright screenshot --wait-for-timeout=4000 --full-page http://localhost:3003 /path/to/out.png
```

For one section instead of the whole page (crop is far more legible than shrinking a full-page shot), `require('playwright')` fails from a plain `node script.js` even after the command above — npx caches the package outside normal module resolution. Locate the npx cache and point `NODE_PATH` at it:

```bash
for d in "$LOCALAPPDATA/npm-cache/_npx"/*/; do
  ls "$d/node_modules" 2>/dev/null | grep -qi '^playwright$' && echo "$d/node_modules"
done
```

then run a small script with `NODE_PATH=<that path> node script.js` that does `page.$('#some-id')` (or, for sections without an id, `page.$('text=Section Heading')` + `.evaluateHandle(el => el.closest('section'))`) and `.screenshot({ path })` on the element handle. `#acasa` (hero) and `#despre` (About Me) have ids; most other sections (`Cum funcționează`, `Mărci deservite`, …) don't, by design — see `CLAUDE.md`.

**Gotcha:** calling `page.reload()` a second time in the same script can trip a `431 Request Header Fields Too Large` from webpack-dev-server's hot-reload/websocket headers piling up on repeated hits — harmless, unrelated to app code. Use a fresh `page.goto()` per check instead of reloading if you need more than one look in a run.
