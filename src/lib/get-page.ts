import { Data } from "@measured/puck";
import { prisma } from "./prisma";

/**
 * Get page content by path (returns final draft content)
 */
export const getPage = async (path: string): Promise<Data | null> => {
  const page = await prisma.page.findUnique({
    where: { path },
    include: { finalDraft: true },
  });

  if (!page || !page.finalDraft) {
    return null;
  }

  return (page.finalDraft.content as Data) ?? null;
};

/**
 * Get all pages with their final draft content, keyed by path
 */
export const getAllPages = async (): Promise<Record<string, Data> | null> => {
  const pages = await prisma.page.findMany({
    include: { finalDraft: true },
  });

  if (pages.length === 0) {
    return null;
  }

  return pages.reduce((acc, page) => {
    if (page.finalDraft) {
      acc[page.path] = page.finalDraft.content as Data;
    }
    return acc;
  }, {} as Record<string, Data>);
};

/**
 * Get page by ID
 */
export const getPageById = async (id: number) => {
  return await prisma.page.findUnique({
    where: { id },
    include: {
      finalDraft: true,
      drafts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

/**
 * Get all drafts for a page
 */
export const getDrafts = async (pageId: number) => {
  return await prisma.draft.findMany({
    where: { pageId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a specific draft by ID
 */
export const getDraftById = async (draftId: number) => {
  return await prisma.draft.findUnique({
    where: { id: draftId },
    include: { page: true },
  });
};
