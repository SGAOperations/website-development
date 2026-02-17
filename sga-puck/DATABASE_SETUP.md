# Prisma/Postgres Setup

Follow these steps to run the Puck editor against PostgreSQL with the draft system.

## Database Schema

The database uses a draft system with two main tables:

- **Page**: Stores page metadata (id, name, path, finalDraftId)
- **Draft**: Stores draft content (id, pageId, content, createdAt)

Each page can have multiple drafts, with one marked as the final (published) draft via `finalDraftId`.

## 1. Create a Database and User

Install postgresql: https://www.postgresql.org/download/

(Ensure postgres is running. On linux: `sudo systemctl start postgresql`, for Mac homebrew users: `brew services start postgresql@15`)

```sh
psql postgres
CREATE DATABASE sga_db;
CREATE USER sga_puck_app WITH PASSWORD 'change-me';
GRANT CONNECT ON DATABASE sga_db TO sga_puck_app;
GRANT USAGE, CREATE ON SCHEMA public TO sga_puck_app;
-- optional but avoids future permission errors
ALTER SCHEMA public OWNER TO sga_puck_app;
\q
```

If you use a different database name, update `prisma/schema.prisma` to match.

## 2. Configure Environment Variables

Create a `.env` file in the `sga-puck` directory and set a `DATABASE_URL` that points to your database, e.g.

```
DATABASE_URL="postgresql://sga_puck_app:change-me@localhost:5432/sga_db?schema=public"
```

## 3. Install Dependencies

```sh
cd sga-puck
npm install
npx prisma generate
```

## 4. Reset Database (Optional - for testing)

If you want to reset the database to test the migration from scratch:

**Option A: Using Prisma Reset (Recommended)**
```sh
npx prisma migrate reset
```
This will:
- Drop the database
- Recreate it
- Apply all migrations
- Run the seed script (if configured)

**Option B: Manual Database Reset**
```sh
# Connect to PostgreSQL
psql postgres

# Drop and recreate the database
DROP DATABASE IF EXISTS sga_db;
CREATE DATABASE sga_db;
GRANT CONNECT ON DATABASE sga_db TO sga_puck_app;
GRANT USAGE, CREATE ON SCHEMA public TO sga_puck_app;
ALTER SCHEMA public OWNER TO sga_puck_app;
\q

# Reset Prisma migration history (optional, if you want to start fresh)
# Delete the _prisma_migrations table if it exists, or just run migrate dev
```

## 5. Apply Migrations

```sh
npx prisma migrate dev
```

This will:
- Create the `Page` and `Draft` tables
- Migrate any existing page data from the old schema to the new draft system
- Set up foreign key relationships

If you see `ERROR: permission denied for schema public`, rerun the grants in step 1 with a superuser. (see below).

```sh
ALTER USER sga_puck_app WITH SUPERUSER;
GRANT CONNECT ON DATABASE sga_db TO sga_puck_app;
GRANT USAGE, CREATE ON SCHEMA public TO sga_puck_app;
```

**Note**: If you have existing pages in the database with the old schema (Page table with `data` column), the migration will automatically:
- Create a `Draft` record for each existing page's data
- Derive the page `name` from the `path`
- Set the `finalDraftId` to the migrated draft

## 6. Seed Existing Pages from JSON

If you have a `database.json` file with existing pages:

```sh
npx prisma db seed
```

This copies any JSON pages from `database.json` into the database:
- Creates a `Page` record for each entry
- Creates a `Draft` with the page content
- Sets that draft as the `finalDraftId` (published version)

You can delete or archive `database.json` afterward.

## 7. Start the App

```sh
npm run dev
```

## How the Draft System Works

- **Creating Pages**: When you create a new page, it creates a Page record and an initial Draft
- **Saving Drafts**: You can save multiple drafts per page. Each save creates a new draft unless you're editing an existing draft
- **Publishing**: Publishing sets a draft as the `finalDraftId`, making it the live version
- **Viewing Drafts**: Access drafts via the "View Drafts" button in the editor, or by adding `?draftId=123` to the edit URL
- **Updating Drafts**: When editing an existing draft, clicking "Save Draft" updates that draft instead of creating a new one

Pages will now read and write via Prisma/Postgres with full draft support.

