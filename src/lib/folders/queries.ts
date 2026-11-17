import { prisma } from "../prisma";

export type FolderSummary = {
  id: number;
  name: string;
  parentId: number | null;
};

export async function getAllFolders(): Promise<FolderSummary[]> {
  return await prisma.folder.findMany({
    select: {
      id: true,
      name: true,
      parentId: true,
    },
    orderBy: { name: "asc" },
  });
}
