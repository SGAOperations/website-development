import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createDraft, updateDraft, publishDraft, createPageWithDraft } from "../../../lib/draft-utils";
import { slugify } from "../../../lib/path-utils";
import { Data } from "@puckeditor/core";
import { getDraftById, getPageById } from "../../../lib/get-page";

type Action = "save-draft" | "publish"

type Payload = 
  | {
    action: Action;
    pageId: number;
    draftId?: number;
    data: Data;
  }
  | {
    action: Action;
    pageName: string;
    data: Data;
  }

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function resolvePage(pageId: number) {
  const page = await getPageById(pageId)
  if (!page) throw new ApiError("Page not found", 404);
  return page;
}

async function createNewPage(payload: Extract<Payload, { pageName: string }>) {
  const path = slugify(payload.pageName);
  const page = await createPageWithDraft(
    payload.pageName,
    payload.data,
    payload.action === "publish"
  )

  if (payload.action === "publish") {
    revalidatePath(path)
  }

  return {
    pageId: page.id,
    draftId: page.finalDraftId,
    path,
  }
}

async function upsertDraft(pageId: number, draftId: number | undefined, data: Data) {
  if (draftId) {
    const existing = await getDraftById(draftId)
    if (!existing) throw new ApiError("Draft not found", 404)
    
    const draft = await updateDraft(draftId, data);
    return { draftId: draft.id, updated: true }
  }

  const draft = await createDraft(pageId, data)
  return { draftId: draft.id, updated: false }
}

export async function POST(request: Request) {
  try {
    const payload: Payload = await request.json()

    if ("pageName" in payload) {
      const reuslt = await createNewPage(payload);
      return NextResponse.json({
        status: "ok",
        ...reuslt,
      })
    }

    const page = await resolvePage(payload.pageId);
    const { draftId, updated } = await upsertDraft(page.id, payload.draftId, payload.data)

    if (payload.action === "publish") {
      await publishDraft(page.id, draftId);
      revalidatePath(page.path);
    }

    return NextResponse.json({
      status: "ok",
      pageId: page.id,
      draftId,
      path: page.path,
      updated,
    })
  } catch (error: any) {
    console.error("Failed to persist page", error);
    
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    return NextResponse.json({ error: "Failed to persist page" }, { status: 500 });
  }
}