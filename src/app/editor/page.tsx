import { prisma } from "../../lib/prisma";
import { supabase, MEDIA_BUCKET } from "../../lib/supabase";
import { getDocumentName } from "../../lib/documents";
import { DocumentList } from "./DocumentList";
import { MediaLibrary } from "./MediaLibrary";
import { RouteTable } from "./RouteTable";
import type { MediaFile } from "../../lib/types";

export default async function EditorIndexPage() {
  const routes = await prisma.route.findMany({
    include: { document: true },
    orderBy: { path: "asc" },
  });

  const { data: storageFiles } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(undefined, { sortBy: { column: "created_at", order: "desc" } });

  const mediaFiles: MediaFile[] = (storageFiles ?? []).map((f) => ({
    name: f.name,
    size: f.metadata?.size ?? 0,
    contentType: f.metadata?.mimetype,
    createdAt: f.created_at ?? "",
    url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
  }));

  const documents = await prisma.document.findMany({
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 flex flex-col gap-6">

      <RouteTable
        routes={routes.map((route) => ({
          id: route.id,
          path: route.path,
          documentId: route.documentId,
          documentName: getDocumentName(route.document),
        }))}
        documents={documents.map((doc) => ({
          id: doc.id,
          name: getDocumentName(doc),
        }))}
      />

      <DocumentList
        documents={documents.map((doc) => ({
          id: doc.id,
          name: doc.name,
          lastModified: doc.versions[0]?.createdAt ?? null,
        }))}
      />

      <MediaLibrary files={mediaFiles} />
    </div>
  );
}

export const dynamic = "force-dynamic";
