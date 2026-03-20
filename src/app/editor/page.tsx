import { prisma } from "../../lib/prisma";
import { getMediaUrl } from "../../lib/supabase";
import { getDocumentName } from "../../lib/documents";
import { DocumentList } from "./DocumentList";
import { MediaLibrary } from "./MediaLibrary";
import { RouteTable } from "./RouteTable";

export default async function EditorIndexPage() {
  const [routes, media, documents] = await Promise.all([
    prisma.route.findMany({
      include: { document: true },
      orderBy: { path: "asc" },
    }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.document.findMany({
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const mediaFiles = media.map((m) => ({
    ...m,
    url: getMediaUrl(m.storagePath),
  }));

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
