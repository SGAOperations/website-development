# Supabase to Neon Migration Assessment

| | |
| --- | --- |
| Author | Shlok Patel |
| Date | October 2, 2026 |
| Status | Draft for review |

## 1. Purpose

This document assesses the effort required to move the application's backing services from Supabase to Neon. It describes the current dependencies on Supabase, sets out two migration options with estimates, proposes an execution plan, and lists the main risks.

## 2. Current State

The application uses Supabase for two services.

1. **PostgreSQL database.** All data access goes through Prisma using the `@prisma/adapter-pg` driver (`src/lib/prisma.ts`, `prisma.config.ts`). The schema consists of four tables (`Document`, `Version`, `Media`, `Route`) defined across three Prisma migrations. It does not rely on row-level security, Postgres extensions, triggers, or any other Supabase-specific database feature.
2. **Object storage.** Uploaded media is stored in a public Supabase Storage bucket named `media` and accessed through `@supabase/supabase-js` (`src/lib/supabase.ts`, `src/lib/media/actions.ts`).

Supabase Auth is enabled in `supabase/config.toml` only because Storage depends on it. The application does not currently use it.

Neon provides managed PostgreSQL but does not offer object storage. A full move off Supabase therefore requires a separate storage provider, such as Vercel Blob, Amazon S3, or Cloudflare R2.

## 3. Options and Estimated Effort

| Option | Scope | Estimate |
| --- | --- | --- |
| A | Move the database to Neon; keep Supabase Storage for media | 0.5 to 1 day |
| B | Move the database to Neon and media to a separate storage provider | 2 to 4 days |

Both estimates exclude documentation updates, changes to the local development setup, and testing, which together add 0.5 to 1 day.

## 4. Proposed Plan

1. Confirm which option to pursue. If Option B, select the storage provider.
2. Create a Neon project on PostgreSQL 17 and connect it to Vercel through the Neon integration. This also gives each preview deployment its own database branch.
3. Update environment variables. Set `DATABASE_URL` to Neon's pooled connection string and `DIRECT_URL` to the direct connection string. The `vercel-build` script runs `prisma migrate deploy` against `DIRECT_URL`.
4. Migrate the data with `pg_dump` and `pg_restore`, limited to the `public` schema. Then confirm that:
   - the `_prisma_migrations` table transferred and `prisma migrate status` reports no pending migrations;
   - all identity sequences are aligned with the current maximum IDs.
5. For Option B only:
   - Replace `src/lib/supabase.ts` with a provider-neutral storage module.
   - Copy all objects from the existing bucket to the new provider.
   - Update stored media references as described in Risk R1.
6. Replace the `supabase start` workflow for local development with a standalone PostgreSQL container or a Neon development branch. Option B also needs a local or shared development bucket. Update `docs/SUPABASE_SETUP.md` and `.env.example` to match.
7. Cut over during a short content freeze:
   - Perform a final data sync and switch the production environment variables.
   - Verify page publishing and media upload, rename, and deletion.
   - Keep the Supabase project available in read-only form for two weeks as a rollback path.

## 5. Risks

| ID | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| R1 | Saved page content (`Version.content`) stores the full public URL of each image. If media moves to a new provider, existing pages, including published ones, will keep referencing Supabase. | High (Option B) | Before migrating, change the Media block to store only `mediaId` and resolve the URL at render time. Otherwise, run a one-time data migration to rewrite stored URLs. |
| R2 | Neon has no local emulator equivalent to `supabase start`, so the local setup changes for every developer. | Medium | Document a standard local setup and validate it with the team before cutover. |
| R3 | On the free tier, Neon suspends idle databases. The first request after a period of inactivity can take up to about one second longer. | Medium | Disable auto-suspend on a paid plan, or accept the latency for this workload. |
| R4 | Neon's pooled connections use PgBouncer in transaction mode, which does not support Prisma migrations. | Low | Keep migrations on `DIRECT_URL`. The current configuration already separates the two connections. |
| R5 | The Neon free tier is limited to 0.5 GB of storage. Each page save writes a full JSON copy to `Version`, so storage use grows over time. | Low | Monitor usage and consider a retention policy for old versions. |
| R6 | Upload limits are inconsistent. The bucket accepts files up to 50 MiB, server actions are capped at 10 MB, and Vercel functions limit request bodies to about 4.5 MB. | Medium (Option B) | Align the limits. If larger files are needed, upload directly from the client to the storage provider. |
| R7 | Planned authentication work may assume Supabase Auth. | Low | Choose the authentication provider before the migration to avoid a second move. |

## 6. Recommendation

Option A is recommended if the goal is to use Neon's branching or to reduce database cost. It is low risk and can be completed in about one day. Option B should be pursued only if fully retiring Supabase is a requirement. In that case, the Media block change described in R1 should be delivered first as a separate change, since it removes the largest risk in that option.

## 7. Open Questions

1. What is the primary motivation for the migration: cost, preview database branching, or consolidating vendors?
2. Is retiring Supabase entirely a requirement?
3. Which authentication provider does the team intend to adopt?
