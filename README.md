# Tools

Shared dashboard at [tools.knipe.io](https://tools.knipe.io). Next.js, gated by a single password, hosted on Cloudflare Workers. No database.

Anyone with the password can get in. That is intentional.

## Local development

Copy `.env.example` to `.env.local` and set both values:

```bash
cp .env.example .env.local
```

- `SITE_PASSWORD` — what people type on `/login`
- `AUTH_SECRET` — a long random string used only to sign the cookie (`openssl rand -base64 32`)

Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should land on the password page, then the empty dashboard after a successful login. The session cookie lasts 30 days.

To preview the Workers runtime locally (closer to production):

```bash
cp .env.example .dev.vars
# add NEXTJS_ENV=development to .dev.vars
npm run preview
```

## Deploy to Cloudflare

You need to be logged into the Cloudflare account that owns `knipe.io`:

```bash
npx wrangler login
```

Set production secrets (once):

```bash
npx wrangler secret put SITE_PASSWORD
npx wrangler secret put AUTH_SECRET
```

Deploy:

```bash
npm run deploy
```

That builds with OpenNext, uploads the Worker, and attaches **tools.knipe.io** as a custom domain (proxied on Cloudflare). No Route 53, no ACM cert, no AWS.

## Cost

Weekly family use stays inside the Cloudflare Workers free tier (100,000 requests/day). Idle cost is $0. No Lambda cold start.
