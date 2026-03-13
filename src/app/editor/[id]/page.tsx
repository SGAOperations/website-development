import "@puckeditor/core/puck.css";
import { Client } from "./client";
import { Metadata } from "next";
import { getDocumentById, getVersionById } from "../../../lib/get-document";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const document = await getDocumentById(parseInt(id, 10));

  return {
    title: document ? `Edit: ${document.name}` : "Document not found",
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const documentId = parseInt(id, 10);
  const searchParamsResolved = await searchParams;
  const versionIdParam = searchParamsResolved.versionId;

  let data: any = null;
  let versionId: number | undefined;
  let publishedVersionId: number | undefined;

  const document = await getDocumentById(documentId);

  if (!document) {
    return <div className="p-6">Document not found</div>;
  }

  publishedVersionId = document.publishedVersionId || undefined;

  // If versionId is provided, load that specific version
  let versionIdValue: string | undefined;
  if (Array.isArray(versionIdParam)) {
    versionIdValue = versionIdParam[0];
  } else if (typeof versionIdParam === "string") {
    versionIdValue = versionIdParam;
  }

  if (versionIdValue) {
    const versionIdNum = parseInt(versionIdValue, 10);
    if (!isNaN(versionIdNum)) {
      const version = await getVersionById(versionIdNum);
      if (version && version.documentId === documentId) {
        data = version.content;
        versionId = version.id;
      }
    }
  }

  // If no specific version loaded, load the latest version (most recent, not necessarily published)
  if (!data && document.versions.length > 0) {
    const latestVersion = document.versions[0]; // Already ordered by createdAt desc
    data = latestVersion.content;
    versionId = latestVersion.id;
  }

  // If no versions exist at all, provide default content
  if (!data) {
    data = {
      content: [
        { type: "Header", props: { nav: [] } },
      ],
      root: {},
    } as any;
  }

  // Extract versions and map to the simplified Version type
  const versions = document.versions.map((v) => ({
    id: v.id,
    documentId: v.documentId,
    createdAt: v.createdAt,
  }));

  return (
    <Client
      key={`${documentId}-${versionId || 'no-version'}`}
      documentId={documentId}
      data={data || {}}
      versionId={versionId}
      publishedVersionId={publishedVersionId}
      versions={versions}
    />
  );
}

export const dynamic = "force-dynamic";
