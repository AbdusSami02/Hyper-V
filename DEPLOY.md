# Deploying hyperv-web

Two pieces, two platforms:

- **`hyperv-server` → Railway** — a plain Node process talking to MongoDB.
  Since state now lives in MongoDB (not a local file), the backend itself
  is stateless — no persistent volume needed on Railway anymore.
- **`hyperv-web-js` → Vercel** — a static Vite build, which is exactly what
  Vercel is built for.
- **Database → MongoDB Atlas** — a free-tier cloud MongoDB cluster.

Both hosting platforms offer free subdomains (`*.up.railway.app`,
`*.vercel.app`) — no custom domain needed to get this live.

## 0. Push the project to GitHub

Both platforms deploy from a Git repo.

```bash
cd hyperv-web
git init
git add .
git commit -m "Initial commit"
```

Create an empty repo on GitHub, then:

```bash
git remote add origin https://github.com/<you>/hyperv-web.git
git branch -M main
git push -u origin main
```

Both `hyperv-server` and `hyperv-web-js` live in this one repo — you'll
point each platform at the right subfolder in the steps below.

## 1. Create a MongoDB Atlas cluster

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
   and create a free account.
2. Create a free **M0** cluster (no credit card needed for this tier).
3. **Database Access** → add a database user with a username/password
   (not your Atlas login — a separate DB user).
4. **Network Access** → add `0.0.0.0/0` (allow access from anywhere) — the
   simplest option since Railway's outbound IPs aren't fixed on most plans.
5. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hyperv?retryWrites=true&w=majority
   ```
   Fill in your real username/password, and make sure a database name
   (`hyperv` above) is present before the `?`. **Copy this full string.**

## 2. Deploy the backend to Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy
   from GitHub repo** → pick your `hyperv-web` repo.
2. Open the new service's **Settings** tab:
   - **Root Directory**: `hyperv-server`
   - **Start Command**: leave as default (`npm start`, from package.json)
3. Add environment variables (Settings → Variables):
   - `MONGODB_URI` — the connection string from step 1
   - `ADMIN_PASSWORD` — a real password, not the placeholder from `.env.example`
   - `CORS_ORIGIN` — leave as `http://localhost:5173` for now, you'll come
     back and fix this in step 4
4. Deploy. Once it's live, go to **Settings → Networking → Generate
   Domain** to get a public URL, e.g.
   `https://hyperv-server-production-xxxx.up.railway.app`. **Copy this URL**
   — you need it in the next step.

Railway sets its own `PORT` environment variable automatically; the server
already reads `process.env.PORT`, so nothing to configure there.

## 3. Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New... → Project** →
   import the same GitHub repo.
2. In the import settings:
   - **Root Directory**: `hyperv-web-js`
   - Framework preset should auto-detect as **Vite**
3. Add an environment variable:
   - `VITE_API_URL` = the Railway URL you copied in step 2 (e.g.
     `https://hyperv-server-production-xxxx.up.railway.app`, no trailing
     slash)
4. Deploy. You'll get a URL like `https://hyperv-web.vercel.app` —
   **copy this too**.

`VITE_API_URL` is baked into the JS bundle at build time, not read at
runtime. If you ever change the backend URL later, you have to redeploy
the frontend (not just restart it) for the new value to take effect.

## 4. Connect the two

Back in Railway, edit the `CORS_ORIGIN` variable to your real Vercel URL
from step 3 (e.g. `https://hyperv-web.vercel.app`, no trailing slash — CORS
requires an exact match). Railway restarts the service automatically — no
rebuild needed, since this is read at startup.

## 5. Verify it's actually working

- Open the Vercel URL, add a flavor to the cart, and check out.
- Copy the confirmation number and check `/track-order` shows it.
- Visit `/admin`, log in with `ADMIN_PASSWORD`, confirm the order and the
  stock decrement both show up.
- In Atlas, click **Browse Collections** on your cluster — you should see
  `products`, `orders`, and (after using the contact form)
  `contactmessages` collections with real documents in them.

## Prefer not to use GitHub?

Both platforms have CLIs that deploy straight from your machine:

```bash
# Backend
cd hyperv-server
npm install -g @railway/cli
railway login
railway init
railway up

# Frontend
cd hyperv-web-js
npm install -g vercel
vercel
```

You'll still need to set the same environment variables through each
platform's dashboard — the CLI just skips the GitHub connection step.

## Troubleshooting

- **"Failed to connect to MongoDB" in Railway logs**: almost always
  `MONGODB_URI` is missing, has an unescaped special character in the
  password (encode it — e.g. `@` becomes `%40`), or Atlas's Network Access
  list doesn't include `0.0.0.0/0`.
- **CORS errors in the browser console**: almost always means
  `CORS_ORIGIN` on Railway doesn't exactly match the Vercel URL (check for
  a trailing slash mismatch, or `http` vs `https`).
- **Checkout returns a 404**: `VITE_API_URL` wasn't set before the last
  Vercel build, or was added without redeploying afterward — Vite bakes it
  in at build time, so a fresh deploy is required after any change.
