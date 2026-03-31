import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PuckRender } from "@/components/puck/puck-render.server";
import { getDocumentByPath } from "../../lib/documents/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}): Promise<Metadata> {
  return {
    title: (await getPublishedDocument(params))?.root.props?.title,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}) {
  const data = await getPublishedDocument(params);

  if (!data) {
    return notFound();
  }

  return <PuckRender data={data} />;
}

export const dynamic = "force-static";

async function getPublishedDocument(params: Promise<{ puckPath?: string[] }>) {
  return getPublishedDocumentByPath(getPublishedPath(await params));
}

function getPublishedPath({ puckPath = [] }: { puckPath?: string[] }) {
  return `/${puckPath.join("/")}`;
}

// Deduplicate the path lookup within a single render/request so metadata and page
// generation can share the same document fetch without another DB round-trip.
const getPublishedDocumentByPath = cache(getDocumentByPath);
