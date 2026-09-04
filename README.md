# Tools

Shared family dashboard at [tools.knipe.io](https://tools.knipe.io). Next.js, one shared password, hosted on Cloudflare Workers. COI PDFs live in R2.

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
- `ANTHROPIC_API_KEY` — reviews uploaded certificates of insurance

```bash
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in, then you should see the tool cards. The session cookie lasts 30 days. COI uploads need the R2 binding from [`wrangler.jsonc`](wrangler.jsonc) (`npm run preview` or a logged-in `npm run dev`).

`.env.local` and `.dev.vars` stay off git. Use the `*.example` files as templates.

## Day to day

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js local server (uses `.env.local`) |
| `npm test` | Vitest — auth, COI validation, review helpers |
| `npm run build` | Production Next.js build (used by deploy) |
| `npm run preview` | Build + run the Worker locally (needs `.dev.vars`) |
| `npm run deploy` | Build with OpenNext and upload to Cloudflare |

`npm run deploy` is an **npm script**. Do not use `npx run deploy`.

Workers-runtime preview:

```bash
cp .dev.vars.example .dev.vars
# fill in SITE_PASSWORD, AUTH_SECRET, and ANTHROPIC_API_KEY
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
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler r2 bucket create family-tools-coi
```

Secrets are stored on the Worker, not in the repo. Until the login secrets are set, login says the site isn’t configured. Changing a secret is the same `secret put` again; no redeploy required.

Create the `family-tools-coi` R2 bucket once. The Worker binding is `COI_BUCKET` in [`wrangler.jsonc`](wrangler.jsonc).

Later deploys are just `npm run deploy`.

If deploy complains that `tools.knipe.io` already has a DNS record, delete that `tools` record in Cloudflare DNS (only that name) and deploy again.

## Layout

```
app/login/          public password page
app/(app)/          gated dashboard (add tools here)
app/(app)/coi/      COI upload and review
app/actions/        server actions (login, logout, COI)
lib/auth.ts         cookie + password helpers
lib/coi/            upload validation, R2 records, Anthropic review
skills/coi-review/  SKILL.md used as the review prompt
wrangler.jsonc      Worker name, domain, R2 binding
open-next.config.ts OpenNext Cloudflare adapter
```

New tools go under `app/(app)/` so they stay behind the password.

Replace [`skills/coi-review/SKILL.md`](skills/coi-review/SKILL.md) with the real review instructions when they are ready. Redeploy after changing it.

## Cost

Workers and R2 stay in the free tier at family volume. Anthropic is billed per review. Idle is $0.
