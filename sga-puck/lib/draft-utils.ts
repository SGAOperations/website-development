import { Data } from "@measured/puck";
import { prisma } from "./prisma";
import { slugify } from "./path-utils";

/**
 * Create a new draft for an existing page
 */
export async function createDraft(
  pageId: number,
  content: Data
): Promise<{ id: number; pageId: number; content: Data; createdAt: Date }> {
  const draft = await prisma.draft.create({
    data: {
      pageId,
      content: content as any,
    },
  });

  return {
    id: draft.id,
    pageId: draft.pageId,
    content: draft.content as Data,
    createdAt: draft.createdAt,
  };
}

/**
 * Update an existing draft
 */
export async function updateDraft(
  draftId: number,
  content: Data
): Promise<{ id: number; pageId: number; content: Data; createdAt: Date }> {
  const draft = await prisma.draft.update({
    where: { id: draftId },
    data: {
      content: content as any,
    },
  });

  return {
    id: draft.id,
    pageId: draft.pageId,
    content: draft.content as Data,
    createdAt: draft.createdAt,
  };
}

/**
 * Publish a draft (set it as the final draft for a page)
 */
export async function publishDraft(
  pageId: number,
  draftId: number
): Promise<void> {
  // Verify the draft belongs to the page
  const draft = await prisma.draft.findFirst({
    where: {
      id: draftId,
      pageId: pageId,
    },
  });

  if (!draft) {
    throw new Error("Draft not found or does not belong to the specified page");
  }

  await prisma.page.update({
    where: { id: pageId },
    data: { finalDraftId: draftId },
  });
}

/**
 * Create a new page with an initial draft
 * @param name - The page name
 * @param content - The Puck data
 * @param publish - Whether to publish the draft immediately
 */
export async function createPageWithDraft(
  name: string,
  content: Data,
  publish: boolean = false
) {
  const path = slugify(name);

  // Check if page with this path already exists
  const existingPage = await prisma.page.findUnique({
    where: { path },
  });

  if (existingPage) {
    throw new Error(`Page with path "${path}" already exists`);
  }

  // Create page and draft in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const page = await tx.page.create({
      data: {
        name,
        path,
      },
    });

    const draft = await tx.draft.create({
      data: {
        pageId: page.id,
        content: content as any,
      },
    });

    // If publish is true, set as final draft
    if (publish) {
      await tx.page.update({
        where: { id: page.id },
        data: { finalDraftId: draft.id },
      });
    }

    return {
      page: {
        ...page,
        finalDraftId: publish ? draft.id : null,
      },
      draft,
    };
  });

  return result.page;
}

