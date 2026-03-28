import { notFound } from "next/navigation";
import PreviewPage from "../PreviewPage";
import { parseDocumentId, generateDocumentMetadata } from "../params";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  return generateDocumentMetadata((await params).id, "Preview");
}

export default async function Page({ params }: PageProps) {
  const { id, slug } = await params;
  const documentId = parseDocumentId(id);
  if (!documentId) notFound();
  return <PreviewPage documentId={documentId} slug={slug} />;
}

export const dynamic = "force-dynamic";
