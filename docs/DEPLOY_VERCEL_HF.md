# Deploy — Vercel (frontend) + Hugging Face Spaces (backend)

End-to-end walkthrough you can finish in **~25 minutes** including
Vercel build time. The result: a public URL like
`https://itmgoi.vercel.app` calling a public API at
`https://<your-hf-username>-itmgoi-api.hf.space/api/*`.

> **Read first** — on the **free** HF Spaces tier the SQLite DB + uploads
> are wiped when the Space sleeps. The Dockerfile re-seeds on every cold
> boot so the demo always works, but **admin edits don't persist long-term**.
> For real persistence either turn on HF Persistent Storage (paid) or
> point `DATABASE_URL` at a managed Postgres (Neon free tier is fine).
> See the "Persistence upgrade" section at the bottom.

---

## Step 1 — Backend on Hugging Face Spaces

### 1.1  Create the Space

1. Go to <https://huggingface.co/new-space>
2. **Owner**: your username (or org).
3. **Space name**: `itmgoi-api` (anything is fine; this becomes part of
   the URL: `https://<owner>-<name>.hf.space`).
4. **License**: MIT (or proprietary — your choice).
5. **Select the Space SDK**: **Docker** → choose **Blank**.
6. **Visibility**: Public (the API needs to be reachable from the browser).
7. **Hardware**: CPU basic (free) is plenty.

Click **Create Space**. HF gives you an empty git repo URL like
`https://huggingface.co/spaces/<owner>/itmgoi-api`.

### 1.2  Push the backend code

The HF Docker SDK expects the `Dockerfile` and `README.md` at the
**root** of the Space repo. The cleanest way is a dedicated branch:

```bash
# from the project root
git clone https://huggingface.co/spaces/<owner>/itmgoi-api hf-space
cp -r backend/. hf-space/                              # backend → root of HF repo
cp deploy/huggingface/Dockerfile hf-space/Dockerfile   # overwrites the default
cp deploy/huggingface/README.md  hf-space/README.md    # YAML header is required
cd hf-space

# Use a token for HTTPS push (get one at huggingface.co/settings/tokens)
git lfs install
git add .
git commit -m "Initial deploy: ITM Gwalior FastAPI backend"
git push                                               # asks for HF username + access token
```

The Space immediately starts building. Watch the build log in the HF UI
("App" tab → "Logs"). First build takes ~3 min (downloads packages, installs
Node for the dept importer).

### 1.3  Set the secrets

Open the Space → **Settings** → **Variables and secrets**. Add:

| Type | Key | Value |
|---|---|---|
| Secret | `JWT_SECRET` | output of `python -c "import secrets;print(secrets.token_urlsafe(48))"` |
| Secret | `DEFAULT_ADMIN_PASSWORD` | strong one-time password; you'll rotate after first login |
| Variable | `FRONTEND_ORIGINS` | `https://itmgoi.vercel.app` (use whatever Vercel assigns; multiple comma-separated) |

Optional (only if you want admission-lead emails delivered):

| Type | Key | Value |
|---|---|---|
| Secret | `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` `SMTP_FROM` | your SMTP creds |

After saving secrets, click **Settings → Factory rebuild** so the new env
is picked up.

### 1.4  Smoke-test

```bash
curl https://<owner>-itmgoi-api.hf.space/api/health/ready
# {"status":"ok","db":"ok"}

curl https://<owner>-itmgoi-api.hf.space/api/public/home | head -c 200
```

If you get a 503 or "Space is starting…", wait 30 seconds — the
container is warming up.

---

## Step 2 — Frontend on Vercel

### 2.1  Update `vercel.json` to point at YOUR Space

`frontend/vercel.json` ships with the placeholder
`YOUR-HF-USERNAME-itmgoi-api.hf.space`. Replace both occurrences with your
actual Space URL. Quick sed (run from repo root):

```bash
sed -i.bak 's|YOUR-HF-USERNAME-itmgoi-api|<owner>-itmgoi-api|g' frontend/vercel.json
```

(use your real HF owner slug; lowercase only).

> The rewrites in `vercel.json` make every `/api/*` request from the
> browser hit your Vercel domain, which **transparently proxies** to HF.
> Because the browser only ever sees same-origin requests, you get
> **zero CORS issues** even if FRONTEND_ORIGINS on HF is wrong.

### 2.2  Push to GitHub (if not already)

```bash
git add frontend/vercel.json deploy/huggingface docs/DEPLOY_VERCEL_HF.md
git commit -m "deploy: Vercel + Hugging Face Spaces"
git push origin main
```

### 2.3  Import into Vercel

1. <https://vercel.com/new> → **Import Git Repository** → pick your repo.
2. **Root Directory** → click "Edit" → set to `frontend`. *(Vercel will
   then pick up `frontend/vercel.json` and `frontend/package.json`.)*
3. **Framework Preset** → Vite (auto-detected).
4. **Build & Output**:
   - Build command: `npm run build`     (or leave blank — Vite default)
   - Output dir:    `dist`
5. **Environment Variables** — leave empty (or add
   `VITE_API_URL=` with empty value to be explicit). The vercel.json
   rewrites handle the API routing.
6. Click **Deploy**.

First deploy takes ~90 seconds. Vercel hands you a URL like
`https://itmgoi-xxxx.vercel.app`.

### 2.4  Wire the production domain back into HF

Once Vercel gives you the final URL (e.g. `itmgoi.vercel.app` after you
add a custom domain), go back to the HF Space → Variables and secrets →
update `FRONTEND_ORIGINS` to include it, then **Factory rebuild** again.
(Strictly only needed if you ever call HF directly without the Vercel
proxy — but worth doing for safety.)

---

## Step 3 — Smoke-test the full stack

```bash
# Public payloads via Vercel proxy → HF backend
curl -s https://itmgoi.vercel.app/api/health/ready
curl -s https://itmgoi.vercel.app/api/public/home   | head -c 200
curl -s https://itmgoi.vercel.app/api/public/department/CSE | head -c 200

# Admin login
TOK=$(curl -s -X POST -d "username=admin&password=<DEFAULT_ADMIN_PASSWORD>" \
  https://itmgoi.vercel.app/api/auth/login | jq -r .access_token)
curl -s -H "Authorization: Bearer $TOK" https://itmgoi.vercel.app/api/auth/me
```

Open the site in a browser:

- <https://itmgoi.vercel.app/>            — public home
- <https://itmgoi.vercel.app/login>       — three-tab login
- <https://itmgoi.vercel.app/admin>       — admin panel (after super-admin login)
- <https://itmgoi.vercel.app/sitemap.xml> — proxied dynamic sitemap
- <https://itmgoi.vercel.app/robots.txt>  — proxied robots

---

## Persistence upgrade (when the demo grows)

The free HF Spaces tier resets ephemeral storage on cold-boot. Two options:

### Option A — Managed Postgres (recommended for content persistence)

1. Sign up at <https://neon.tech> (free tier: 0.5 GB).
2. Create a project → grab the connection string.
3. In the HF Space secrets, add:
   ```
   DATABASE_URL=postgresql+psycopg://<user>:<pass>@<host>/<db>?sslmode=require
   ```
4. Factory rebuild. The container migrates against the new DB on first
   boot and never wipes again.

### Option B — HF Persistent Storage (keeps SQLite + uploads)

1. Space → Settings → **Persistent Storage** → upgrade to a 20 GB volume
   ($5/month at time of writing).
2. The Dockerfile already writes to `/home/user/data/{db,uploads}`,
   which becomes the mount point automatically — nothing else to change.

### Option C — Cloudflare R2 for media uploads

In any case, switching media off ephemeral disk is one rebuild away:

```
STORAGE_BACKEND=s3
S3_ENDPOINT_URL=https://<account>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=itm-media
S3_ACCESS_KEY=<r2 key>
S3_SECRET_KEY=<r2 secret>
S3_PUBLIC_BASE_URL=https://cdn.itmgoi.in
```

---

## Updating the deployment

| Change | What re-deploys |
|---|---|
| `git push origin main` (backend code) | Push to the HF Space remote separately (or set up GitHub Actions to mirror `backend/` → HF). |
| `git push origin main` (frontend code) | Vercel auto-deploys from main on every push. |
| Updated env / secrets on HF | Space → Settings → **Factory rebuild** |
| Updated env on Vercel | Project → Settings → Environment Variables → **Redeploy** the latest deployment |

For a one-command sync to HF from your laptop after backend changes:

```bash
cd hf-space
rsync -av --exclude='.git' ../backend/ ./
cp ../deploy/huggingface/Dockerfile ./Dockerfile
cp ../deploy/huggingface/README.md  ./README.md
git add . && git commit -m "deploy: backend update $(date +%F)" && git push
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| **Vercel build fails** — "vite: command not found" | Verify the Vercel Root Directory is set to `frontend`. The `vercel.json` lives at `frontend/vercel.json`. |
| Browser shows CORS errors when hitting `/api/...` | You're not using the Vercel proxy. Either set `VITE_API_URL=""` (recommended) so the SPA calls same-origin `/api/*`, or add the Vercel URL to `FRONTEND_ORIGINS` on HF and rebuild. |
| HF Space shows 503 / "Space is sleeping" | First request after sleep takes ~30 s to wake the container. Hit `/api/health/ready` to warm it up. |
| Admin edits disappear after a few hours | Free HF tier ephemeral storage — switch to managed Postgres (see "Persistence upgrade"). |
| Login returns 401 with `admin / admin123` | You set `DEFAULT_ADMIN_PASSWORD` to something else — use that value. The default is only used if no super-admin exists yet. |
| `/sitemap.xml` 404 on Vercel | Check the rewrite in `vercel.json` points at your actual HF Space URL. |
| Files uploaded via /admin/media disappear on next boot | Same ephemeral-storage problem; switch to R2 (option C). |

---

## Sign-off checklist

- [ ] HF Space build succeeds (green status)
- [ ] `https://<owner>-itmgoi-api.hf.space/api/health/ready` returns `ok`
- [ ] `JWT_SECRET` + `DEFAULT_ADMIN_PASSWORD` set as secrets on HF
- [ ] `FRONTEND_ORIGINS` includes the Vercel URL
- [ ] Vercel deploy succeeds; `vercel.json` rewrites point at the right HF URL
- [ ] Browser loads home page, hero pulled from the API
- [ ] Login as super-admin works; admin tile grid renders
- [ ] Admin edit (e.g. add a CS lab) reflects on `/cs` after reload
- [ ] Public form submission (admissions inquiry) appears in admin inbox
