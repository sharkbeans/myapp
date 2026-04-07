# MyApp CRUD Template

`myapp` is a lightweight Next.js CRUD template meant to be cloned and adapted into your own app. It includes two example resources, shared table/search/sort/pagination building blocks, and copy-paste-friendly resource scaffolding under [`src/app`](/home/jytan/Documents/Git/myapp/src/app).

## What's Included

- Next.js App Router with TypeScript
- Tailwind CSS 4
- Biome for linting and formatting
- Example CRUD resources at `/items` and `/products`
- Search, sorting, pagination, and per-page controls
- Server actions for create, update, and delete flows
- In-memory stores you can swap with Prisma, Drizzle, Supabase, or your own backend
- Neon-ready database mode via `DATABASE_URL`, with automatic table creation and seed data for the example resources

## Quick Start

```bash
corepack npm install
corepack npm run dev
```

Open `http://localhost:3000`.

## Template Structure

The reusable CRUD pattern lives here:

```text
src/app/items/
src/app/products/
src/app/_components/
src/app/_lib/
```

To scaffold a new resource, copy either `src/app/items` or `src/app/products`,
rename the folder, then update the type, validation, store, form fields, links,
and labels for your own model.

## Neon-Ready Mode

If `DATABASE_URL` is set, the `/items` and `/products` examples use Neon instead of the in-memory fallback. On first request, the template automatically:

- creates the `items` table if missing
- creates the `products` table if missing
- seeds both tables with the example starter records when empty

That means a cloned repo only needs valid Neon environment values to start persisting data.

## Env Setup

For local development, create `.env.local` and fill in your real values:

```dotenv
APP_ENV=development
NEXT_PUBLIC_APP_NAME=My Local CRUD App
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=replace-with-a-long-random-secret
CRON_SECRET=replace-with-another-long-random-secret
DATABASE_URL=postgresql://NEON_USER:NEON_PASSWORD@NEON_POOLED_HOST/NEON_DATABASE?sslmode=require
DIRECT_DATABASE_URL=postgresql://NEON_USER:NEON_PASSWORD@NEON_DIRECT_HOST/NEON_DATABASE?sslmode=require
```

For Vercel, add the same keys in Project Settings -> Environment Variables,
using your production URL for `NEXT_PUBLIC_APP_URL`.

Neon mapping:
- pooled connection string -> `DATABASE_URL`
- direct connection string -> `DIRECT_DATABASE_URL`
- database host/name/user/password -> optional split `DATABASE_*` vars if needed

## Scripts

```bash
corepack npm run dev
corepack npm run lint
corepack npm run format
corepack npm run build
```

## Security Note

As of April 7, 2026, this template does not include `axios` as a direct or transitive dependency, and `npm audit` reports `0` vulnerabilities after the dependency refresh.
