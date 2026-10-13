import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";
import type { Prisma } from "../src/generated/prisma/client";
import { requireEnv } from "../src/lib/env";

const adapter = new PrismaPg({ connectionString: requireEnv("DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

function unslugify(pathStr: string) {
  return pathStr
    .replace(/^\//, "")
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

    await prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          name: name,
        },
      });

      const version = await tx.version.create({
        data: {
          documentId: document.id,
          content: data as Prisma.InputJsonValue,
        },
      });

      await tx.route.create({
        data: {
          path: pathKey,
          documentId: document.id,
        },
      });

      await tx.document.update({
        where: { id: document.id },
        data: {
          publishedVersionId: version.id,
        },
      });
    });
  }

  console.info(`Seeded ${entries.length} document(s) from database.json.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
