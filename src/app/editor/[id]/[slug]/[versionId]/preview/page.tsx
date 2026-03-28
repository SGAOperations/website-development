import { notFound } from "next/navigation";
import PreviewPage from "../../PreviewPage";
import { parseDocumentId, parseVersionId, generateDocumentMetadata } from "../../params";

interface PageProps {
  params: Promise<{ id: string; slug: string; versionId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  return generateDocumentMetadata((await params).id, "Preview");
}

export default async function Page({ params }: PageProps) {
  const { id, slug, versionId: versionIdParam } = await params;
  const documentId = parseDocumentId(id);
  const versionId = parseVersionId(versionIdParam);
  if (!documentId || !versionId) notFound();
  return <PreviewPage documentId={documentId} slug={slug} versionId={versionId} />;
}

export const dynamic = "force-dynamic";
