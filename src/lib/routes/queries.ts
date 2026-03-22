import { prisma } from "../prisma";

export async function getRoutesWithDocuments() {
  return await prisma.route.findMany({
    include: { document: true },
    orderBy: { path: "asc" },
  });
}
