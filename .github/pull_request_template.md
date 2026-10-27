## Purpose

Allows routes to have parent-child relationships which makes it easier to organize the pages into a site hiearchy. So, instead of manually making every route idependently users can add child routes to exsisting route and then create a structure that can then be used later for components like navbars.to existing routes, creating a structure that can later be used to generate navigation menus, breadcrumbs, and sitemaps.
<!-- What does this let someone do that they could not do before, or what
problem does it solve? Write this for someone who does not read code. -->

## What changed
1. Updated Prisma Route model to include a parentId field with a self-relation with parent and children which allows the routes to have nested relationships.
2. Updated CreateRouteInput and createRouteAction() in src/lib/routes/actions.ts, along with handleCreate() in src/app/editor/RouteTable.tsx, to pass and save parentId when creating a child route.
3. Created and applied a Prisma migration to update the database schema, then regenerated the Prisma client to recognize the new fields.
<!-- The technical version. What you added, moved, or rewrote, and why it is
built that way. Use inline code for files, endpoints, and config keys. -->

## How you tested it
1. Ran npx prisma validate to check that the Prisma schema was valid.
2. Ran npx prisma generate to regenerate the Prisma client, followed by npx prisma migrate dev --name add_route_hierarchy to apply the database migration and make sure the migration was up to date
3. Ran npx tsc --noEmit to check for TypeScript errors, then opened the Routes page locally and tested creating parent and child routes to make sure CRUD operations works 
<!-- Say what you ran or clicked. -->

## Did you change code you did not write?
No
<!-- If no, say no. If yes: whose code, what you changed, and why it had to
change for this to work. Tag them as a reviewer. -->
