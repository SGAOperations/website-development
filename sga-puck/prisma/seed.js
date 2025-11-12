/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Helper to derive name from path
function unslugify(pathStr) {
  return pathStr
    .replace(/^\//, "") // Remove leading slash
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function main() {
    const databasePath = path.join(process.cwd(), "database.json");

    if (!fs.existsSync(databasePath)) {
        console.warn("database.json not found. Nothing to seed.");
        return;
    }

    const raw = fs.readFileSync(databasePath, "utf-8");
    const pages = JSON.parse(raw);

    const entries = Object.entries(pages);

    if (entries.length === 0) {
        console.warn("database.json is empty. Nothing to seed.");
        return;
    }

    for (const [pathKey, data] of entries) {
        const name = unslugify(pathKey);
        
        // Use transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            // Upsert page
            const page = await tx.page.upsert({
                where: { path: pathKey },
                create: {
                    path: pathKey,
                    name: name,
                },
                update: {
                    name: name,
                },
            });

            // Create draft with the data
            const draft = await tx.draft.create({
                data: {
                    pageId: page.id,
                    content: data,
                },
            });

            // Set as final draft if not already set
            if (!page.finalDraftId) {
                await tx.page.update({
                    where: { id: page.id },
                    data: { finalDraftId: draft.id },
                });
            }
        });
    }

    console.info(`Seeded ${entries.length} page(s) from database.json.`);
}

main()
    .catch((error) => {
        console.error("Failed to seed database", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

