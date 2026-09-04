# Tools

Shared family dashboard at [tools.knipe.io](https://tools.knipe.io). Next.js, one shared password, no database, hosted on Cloudflare Workers.

Anyone with the password can get in. That is intentional.

## First-time setup

```bash
git clone git@github.com:niborg/family-tools.git
cd family-tools
npm install
cp .env.example .env.local
```

Edit `.env.local`:

- `SITE_PASSWORD` — what people type on `/login`
- `AUTH_SECRET` — cookie signing key only. Generate with `openssl rand -base64 32`

```bash
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in, then you should see the empty dashboard. The session cookie lasts 30 days.

`.env.local` and `.dev.vars` stay off git. Use the `*.example` files as templates.

## Day to day

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js local server (uses `.env.local`) |
| `npm test` | Vitest — password check, signed cookie, login/logout |
| `npm run build` | Production Next.js build (used by deploy) |
| `npm run preview` | Build + run the Worker locally (needs `.dev.vars`) |
| `npm run deploy` | Build with OpenNext and upload to Cloudflare |

`npm run deploy` is an **npm script**. Do not use `npx run deploy`.

Workers-runtime preview:

```bash
cp .dev.vars.example .dev.vars
# fill in SITE_PASSWORD and AUTH_SECRET
npm run preview
```

## How auth works

No users table. Two secrets:

1. Login compares the form password to `SITE_PASSWORD` (timing-safe).
2. On success the server sets an httpOnly cookie signed with `AUTH_SECRET`.
3. The dashboard layout checks that cookie. `/login` is public.

Code: [`lib/auth.ts`](lib/auth.ts), [`app/actions/auth.ts`](app/actions/auth.ts). Tests live next to those files.

## Deploy to Cloudflare

The live app is the Worker named `tools`, hostname **tools.knipe.io**. Config is [`wrangler.jsonc`](wrangler.jsonc). DNS for `knipe.io` stays on Cloudflare; deploy creates the `tools` custom domain record. Mail on `knipe.io` is not touched (MX/SPF/DKIM stay on the apex).

```bash
npx wrangler login          # once, account that owns knipe.io
npm run deploy
npx wrangler secret put SITE_PASSWORD
npx wrangler secret put AUTH_SECRET
```

Secrets are stored on the Worker, not in the repo. Until both are set, login says the site isn’t configured. Changing a secret is the same `secret put` again; no redeploy required.

Later deploys are just `npm run deploy`.

If deploy complains that `tools.knipe.io` already has a DNS record, delete that `tools` record in Cloudflare DNS (only that name) and deploy again.

## Layout

```
app/login/          public password page
app/(app)/          gated dashboard (add tools here)
app/actions/        server actions (login/logout)
lib/auth.ts         cookie + password helpers
wrangler.jsonc      Worker name, domain, Node compat
open-next.config.ts OpenNext Cloudflare adapter
```

New tools go under `app/(app)/` so they stay behind the password.

## Cost

Weekly use stays in the Workers free tier. Idle is $0.
