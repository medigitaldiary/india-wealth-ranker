# Deploying India Wealth Ranker

The app is a standard Next.js 16 project. Hosting is a two-part job: get the
repo onto GitHub, then import it into Vercel with the right environment
variables. The Neon database is already provisioned and migrated.

## 1. Push to GitHub

The project is committed locally on `main` but has no remote yet.

```bash
# create an empty repo at https://github.com/new (no README/.gitignore)
git remote add origin git@github.com:<you>/india-wealth-ranker.git
git push -u origin main
```

`.env.local` is gitignored, so no secrets are pushed.

## 2. Import into Vercel

1. https://vercel.com/new → import the repo. Framework auto-detects as Next.js.
2. Add **Environment Variables** (Production + Preview):

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | your Neon **pooled** connection string |
   | `NEXT_PUBLIC_APP_URL` | your live URL, e.g. `https://wealthrank.in` (or the `*.vercel.app` URL to start) |

3. Deploy.

`NEXT_PUBLIC_APP_URL` is build-time inlined, so if you change it later you must
redeploy for OG tags, the sitemap, and share links to pick it up.

## 3. Database

Tables already exist on the current Neon project. For a **fresh** database, run
the checked-in migrations against it:

```bash
DATABASE_URL="<neon-url>" npm run db:migrate
```

The app degrades gracefully if `DATABASE_URL` is missing: the funnel still works
and computes ranks, it just doesn't persist leads or leaderboard entries.

## 4. Custom domain (optional)

Add it under Vercel → Project → Settings → Domains, then set
`NEXT_PUBLIC_APP_URL` to that domain and redeploy.

## Before launch — checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` to the real domain (SEO + share links depend on it)
- [ ] Confirm `BONDSCANNER_URL` in `lib/config.ts` points where you want
- [ ] Refresh the wealthiest-Indians estimates in `data/wealthiestIndians.json`
- [ ] Review the illustrative figures in `data/wealthBenchmarks.json`
- [ ] Rotate the Neon password if it was ever shared in plaintext
