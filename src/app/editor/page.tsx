import { prisma } from "../../lib/prisma";
import { getDocumentName } from "../../lib/documents";
import { DocumentList } from "./DocumentList";
import { RouteTable } from "./RouteTable";

export default async function EditorIndexPage() {
  const routes = await prisma.route.findMany({
    include: { document: true },
    orderBy: { path: "asc" },
  });

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
    </div>
  );
}

export const dynamic = "force-dynamic";
