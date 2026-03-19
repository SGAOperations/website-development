# Migrating to Supabase-managed Postgres

Migrating to Supabase-managed Postgres is not necessary, but it can simplify your development workflow.

## A: Fresh start (recommended)

Use this if your local data is expendable. This will still seed from `database.json` at the project root.

```bash
npx supabase start
```

Set `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres?schema=public"
```

```bash
npx prisma migrate dev
```

Stop your old Postgres instance.

## B: Migrate existing data

```bash
npx supabase start
```

Set `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres?schema=public"
```

Dump data from your current DB:

```bash
pg_dump -h localhost -p 5432 -U sga_puck_app -d sga_db --schema=public --data-only > dump.sql
```

Restore data to Supabase-managed Postgres, setting `session_replication_role` to `replica` to avoid triggering any constraints or triggers during the restore:
```bash
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres <<'EOF'
SET session_replication_role = 'replica';
\i dump.sql
EOF
```

Verify data and stop old Postgres:

```bash
npx prisma studio
```