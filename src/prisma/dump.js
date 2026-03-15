/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    include: {
      finalDraft: true,
    },
  });

  const output = {};

  for (const page of pages) {
    if (!page.finalDraft) {
      console.warn(`Skipping "${page.name}" (${page.path}) — no published draft.`);
      continue;
    }

    output[page.path] = page.finalDraft.content;
  }

  const count = Object.keys(output).length;

  if (count === 0) {
    console.warn("No published pages found.");
    return;
  }

  const json = JSON.stringify(output, null, 4) + "\n";
  const outputPath = process.argv[2];

  if (outputPath) {
    fs.writeFileSync(path.resolve(outputPath), json, "utf-8");
    console.info(`Dumped ${count} page(s) to ${outputPath}`);
  } else {
    process.stdout.write(json);
  }
}

main()
  .catch((error) => {
    console.error("Failed to dump database", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
