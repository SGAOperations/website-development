import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorPage from "./EditorPage";
import { getDocumentName } from "../../../../lib/documents/queries";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const name = await getDocumentName(parseInt(id, 10));
  return {
    title: name ? `Edit: ${name}` : "Document not found",
  };
}

export default async function Page({ params }: PageProps) {
  const { id, slug } = await params;
  const documentId = parseInt(id, 10);

  if (isNaN(documentId)) {
    notFound();
  }

  return <EditorPage documentId={documentId} slug={slug} />;
}

export const dynamic = "force-dynamic";
