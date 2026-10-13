import { getDocumentSummaries } from "../../lib/documents/queries";
import { getDocumentName } from "../../lib/documents/utils";
import { getAllFolders } from "../../lib/folders/queries";
import { getMediaFiles } from "../../lib/media/queries";
import { getRoutesWithDocuments } from "../../lib/routes/queries";
import { DocumentList, ArchivedDocumentList } from "./DocumentList";
import { MediaLibrary } from "./MediaLibrary";
import { RouteTable } from "./RouteTable";

export default async function EditorIndexPage() {
  const [routes, mediaFiles, documents, folders] = await Promise.all([
    getRoutesWithDocuments(),
    getMediaFiles(),
    getDocumentSummaries(),
    getAllFolders(),
  ]);

  const toDocumentItem = (doc: (typeof documents)[number]) => ({
    id: doc.id,
    name: doc.name,
    lastModified: doc.versions[0]?.createdAt ?? null,
    folderId: doc.folderId,
  });

  const activeDocuments = documents.filter((doc) => doc.archivedAt === null).map(toDocumentItem);
  const archivedDocuments = documents.filter((doc) => doc.archivedAt !== null).map(toDocumentItem);

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

      <DocumentList documents={activeDocuments} folders={folders} />

      <ArchivedDocumentList documents={archivedDocuments} />

      <MediaLibrary files={mediaFiles} />
    </div>
  );
}

export const dynamic = "force-dynamic";
