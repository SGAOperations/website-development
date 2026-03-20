"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FileText } from "lucide-react";
import { createDocumentAction } from "../../lib/actions";
import { getDocumentName } from "../../lib/documents";
import { ResourceCard, NewResourceCard, formatRelativeTime } from "./ResourceCard";

function NewDocumentCard() {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();

  async function handleCreateDocument() {
    const name = window.prompt("Document name");

    if (name === null) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    startTransition(async () => {
      const result = await createDocumentAction({
        name: trimmedName,
      });

      if (result.success === false) {
        alert(result.error);
        return;
      }

      router.push(`/editor/${result.data.documentId}`);
    });
  }

  return (
    <NewResourceCard
      label="New Document"
      loadingLabel="Creating..."
      disabled={isCreating}
      onClick={handleCreateDocument}
    />
  );
}

function DocumentCard({ id, name, lastModified }: { id: number; name: string | null; lastModified: Date | null }) {
  const displayName = getDocumentName({ id, name });

  return (
    <Link href={`/editor/${id}`} className="block">
      <ResourceCard
        preview={<FileText className="h-10 w-10 text-gray-400" />}
        name={displayName}
        date={lastModified ? formatRelativeTime(lastModified) : "No versions"}
      />
    </Link>
  );
}

export function DocumentList({ documents }: {
  documents: { id: number; name: string | null; lastModified: Date | null }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Documents</h1>

      <div className="flex flex-wrap gap-2">
        <NewDocumentCard />

        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            name={doc.name}
            lastModified={doc.lastModified}
          />
        ))}
      </div>
    </div>
  );
}
