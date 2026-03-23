# Supabase Setup

We use a local Postgres instance **or** Supabase as the local database (managed via Prisma) and Supabase for storage (media uploads). In production, we deploy to Supabase Postgres.

## Prerequisites

- Docker running locally
  - Docker desktop is easiest to setup and run: https://www.docker.com/products/docker-desktop/
    - Features a nice GUI, works on all platforms
    - For WSL users: install on Windows and enable WSL integration in Docker desktop settings
  - Alternatively, you can install any Docker engine: https://docs.docker.com/engine/install/

## Local Development

### 1. Start Supabase

```bash
npx supabase start
```

If Docker is running, Supabase will begin creating a local instance of the necessary services. On success, it should output something like:

```bash
╭─────────────────────────────────────────────────╮
│ 🌐 APIs                                         │
├─────────────┬───────────────────────────────────┤
│ Project URL │ http://127.0.0.1:54321            │
│ REST        │ http://127.0.0.1:54321/rest/v1    │
│ GraphQL     │ http://127.0.0.1:54321/graphql/v1 │
╰─────────────┴───────────────────────────────────╯

╭───────────────────────────────────────────────────────────────╮
│ ⛁ Database                                                    │
├─────┬─────────────────────────────────────────────────────────┤
│ URL │ postgresql://postgres:postgres@127.0.0.1:54322/postgres │
╰─────┴─────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────╮
│ 🔑 Authentication Keys                                       │
├─────────────┬────────────────────────────────────────────────┤
│ Publishable │ sb_publishable_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX │
│ Secret      │ sb_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX     │
╰─────────────┴────────────────────────────────────────────────╯
```

These credentials are also accessible again via `npx supabase status` if you need to reference them later.

### 2. Configure environment variables

In your `.env` copy the "Project URL" to `SUPABASE_URL`, and the "Secret" to `SUPABASE_SERVICE_ROLE_KEY`.

For `DATABASE_URL`, you may use a locally managed instance, or use the Database "URL". Append `?schema=public` to ensure Prisma uses the public schema.

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres?schema=public"
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_SERVICE_ROLE_KEY="sb_secret_XXXXXXXXX"
```

### 3. Run Prisma migrations

```bash
npx prisma migrate dev
```

This will apply the Prisma schema to your local database. You can also use `npx prisma studio` to view and manage your database records in a nice UI.

## Resetting the database

If you want to reset your database (e.g. to clear all data), you can run:

```bash
npx prisma migrate reset
```

## Stopping Supabase

```bash
npx supabase stop
```

## Configuration

The config lives in `supabase/config.toml`.

- DB: Enabled — used by both application and storage
- Storage: Enabled with a public `media` bucket
- Auth/API: Enabled because storage depends on them
- Everything else: Disabled
