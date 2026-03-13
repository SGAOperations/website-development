import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { NewDocumentCard } from "./NewDocumentCard";

export default async function EditorIndexPage() {
  const routes = await prisma.route.findMany({
    include: {
      document: {
        include: { publishedVersion: true },
      },
      
    },
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

  const documentName = (document: { name: string | null; id: number }) => {
    if (document.name) return document.name;
    return `Untitled Document #${document.id}`;
  }

  return (
    <div className="p-6 flex flex-col gap-6">

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Routes</h1>
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="text-left">Path</th>
              <th className="text-left">Document</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className="border-t">
                <td><span className="font-mono">{route.path}</span></td>
                <td>
                  <Link href={`/editor/${route.documentId}`} className="text-blue-500 hover:underline">
                    {documentName(route.document)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Documents</h1>

        <div className="flex gap-2">
          <NewDocumentCard />

          {documents.map((document) => (
            <div key={document.id} className="flex flex-col bg-gray-100 w-32 h-32 p-4 justify-center text-center">
              <span>{documentName(document)}</span>
              <span className="mt-auto text-xs text-gray-600">
                {document.versions[0]?.createdAt
                  ? `${document.versions[0].createdAt.toLocaleString()}`
                  : "No versions"}
              </span>
            </div>
          ))}
        </div>
      </div>



    </div>
  );
}

export const dynamic = "force-dynamic";
