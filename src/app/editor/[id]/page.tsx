import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getDocumentName } from "../../../lib/documents/queries";
import { getEditorUrl } from "../../../lib/editor-url";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const documentId = parseInt(id, 10);

  if (isNaN(documentId)) {
    notFound();
  }

  const name = await getDocumentName(documentId);

  if (name === undefined) {
    notFound();
  }

  redirect(getEditorUrl(documentId, name));
}

export const dynamic = "force-dynamic";
