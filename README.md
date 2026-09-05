# Tools

Shared family dashboard at [ranch.knipe.io](https://ranch.knipe.io). Next.js, one shared password, hosted on Cloudflare Workers. COI PDFs live in R2.

Anyone with the password can get in. That is intentional.

## First-time setup

```bash
git clone git@github.com:niborg/ranch-tools.git
cd ranch-tools
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
| `npm test` | Vitest — auth, COI, crew hours, review helpers |
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
2. Failed tries are rate limited per client IP: 5 failures in 15 minutes, plus a Cloudflare burst cap of 10 login posts per minute in production.
3. On success the server sets an httpOnly cookie signed with `AUTH_SECRET`.
4. The dashboard layout checks that cookie. `/login` is public. After login, `?next=` can send someone back to the page they wanted (only in-app paths).

Code: [`lib/auth.ts`](lib/auth.ts), [`lib/login-rate-limit.ts`](lib/login-rate-limit.ts), [`app/actions/auth.ts`](app/actions/auth.ts). Tests live next to those files.

## Deploy to Cloudflare

The live app is the Worker named `ranch`, hostname **ranch.knipe.io**. Config is [`wrangler.jsonc`](wrangler.jsonc). DNS for `knipe.io` stays on Cloudflare; deploy creates the `ranch` custom domain record. Apex mail on `knipe.io` is not touched (MX/SPF/DKIM stay on the root). Crew-hour mail uses Email Sending on the `ranch` subdomain only.

## Crew hours

Wednesday at 12pm Pacific, the Worker emails `susie.knipe@gmail.com` from `admin@ranch.knipe.io` with a link to [`/attendance`](https://ranch.knipe.io/attendance). After she logs in and submits, the same sender emails `suzeadmin@gmail.com` the days Santos and Blanca worked.

Cloudflare cron is UTC and does not follow DST, so the Worker fires at **19:00 and 20:00 UTC** on Wednesdays and only sends when it is actually noon in `America/Los_Angeles`.

Email will not send until Email Sending is onboarded for **ranch.knipe.io** (not Email Routing — Routing would move apex MX). In the Cloudflare dashboard: **Compute → Email Service → Email Sending → Onboard Domain → ranch.knipe.io**. That adds bounce/SPF/DKIM records under `cf-bounce.ranch.knipe.io` and DMARC under `_dmarc.ranch.knipe.io`.

Add `susie.knipe@gmail.com` and `suzeadmin@gmail.com` as destination addresses and click the confirmation links. Sending to those verified addresses stays on the Workers Free plan.

`npm run dev` can show the form, but the report email needs the Worker `EMAIL` binding (`npm run preview` or production).

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

If deploy complains that `ranch.knipe.io` already has a DNS record, delete that `ranch` record in Cloudflare DNS (only that name) and deploy again. If you previously used `tools.knipe.io`, delete that `tools` record too so it does not keep pointing at the old hostname.

## Layout

```
app/login/              public password page
app/(app)/              gated dashboard (add tools here)
app/(app)/attendance/   crew hours form
app/(app)/coi/          COI upload and review
app/actions/            server actions (login, logout, COI, attendance)
lib/auth.ts             cookie + password helpers
lib/login-rate-limit.ts login retry cap per IP
lib/attendance.ts       week labels, form validation, email copy
lib/coi/                upload validation, R2 records, Anthropic review
skills/coi-review/      SKILL.md used as the review prompt
proxy.ts                copies the request path so login can send people back
worker.ts               OpenNext fetch handler + Wednesday cron
wrangler.jsonc          Worker name, domain, cron, email, R2
open-next.config.ts     OpenNext Cloudflare adapter
```

New tools go under `app/(app)/` so they stay behind the password.

Review instructions live in [`skills/coi-review/SKILL.md`](skills/coi-review/SKILL.md). Redeploy after changing it.

## Cost

Workers, R2, and mail to the two verified Gmail addresses stay in the free tier at family volume. Anthropic is billed per review. Idle is $0.
