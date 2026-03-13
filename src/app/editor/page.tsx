import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function EditorIndexPage() {
  const routes = await prisma.route.findMany({
    include: {
      document: {
        include: { publishedVersion: true },
      },
      
    },
    orderBy: { path: "asc" },
  });

  return (
    <div className="p-6">
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
                  {route.document.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const dynamic = "force-dynamic";
