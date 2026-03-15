import "@puckeditor/core/puck.css";
import type { Data } from "@puckeditor/core";
import { Client } from "./client";
import { Metadata } from "next";
import { getDocumentById, getVersionById } from "../../../lib/get-document";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const document = await getDocumentById(parseInt(id, 10));

  return {
    title: document ? `Edit: ${document.name}` : "Document not found",
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const documentId = parseInt(id, 10);

  const document = await getDocumentById(documentId);

  if (!document) {
    return <div className="p-6">Document not found</div>;
  }

  const { versionId: versionIdParam } = await searchParams;
  const versionIdValue = Array.isArray(versionIdParam) ? versionIdParam[0] : versionIdParam;
  const versionIdNum = versionIdValue ? parseInt(versionIdValue, 10) : NaN;

  const resolved = await resolveVersion(documentId, versionIdNum, document.versions);

  const versions = document.versions.map((v) => ({
    id: v.id,
    documentId: v.documentId,
    createdAt: v.createdAt,
  }));

  return (
    <Client
      key={`${documentId}-${resolved.versionId || "no-version"}`}
      documentId={documentId}
      data={resolved.data}
      versionId={resolved.versionId}
      publishedVersionId={document.publishedVersionId || undefined}
      versions={versions}
    />
  );
}

async function resolveVersion(
  documentId: number,
  versionIdNum: number,
  versions: { id: number; documentId: number; content: unknown }[],
): Promise<{ data: Data; versionId?: number }> {
  if (!isNaN(versionIdNum)) {
    const version = await getVersionById(versionIdNum);
    if (version && version.documentId === documentId) {
      return { data: version.content as Data, versionId: version.id };
    }
  }

  if (versions.length > 0) {
    return { data: versions[0].content as Data, versionId: versions[0].id };
  }

  return { data: { content: [], root: {} } as Data };
}

export const dynamic = "force-dynamic";
