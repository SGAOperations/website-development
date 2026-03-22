import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorPage from "../EditorPage";
import { getDocumentName } from "../../../../../lib/documents/queries";

interface PageProps {
  params: Promise<{ id: string; slug: string; versionId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const name = await getDocumentName(parseInt(id, 10));
  return {
    title: name ? `Edit: ${name}` : "Document not found",
  };
}

export default async function Page({ params }: PageProps) {
  const { id, slug, versionId: versionIdParam } = await params;
  const documentId = parseInt(id, 10);
  const versionId = parseInt(versionIdParam, 10);

  if (isNaN(documentId) || isNaN(versionId)) {
    notFound();
  }

  return <EditorPage documentId={documentId} slug={slug} versionId={versionId} />;
}

export const dynamic = "force-dynamic";
