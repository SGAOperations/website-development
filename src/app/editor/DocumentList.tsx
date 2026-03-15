"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createDocumentAction } from "../../lib/actions";
import { getDocumentName } from "../../lib/documents";

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
    <button
      type="button"
      onClick={handleCreateDocument}
      disabled={isCreating}
      className="flex h-48 w-32 cursor-pointer rounded-lg flex-col items-center justify-center border border-dashed border-gray-400 bg-white p-4 text-center text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="text-3xl leading-none">+</span>
      <span className="mt-2 text-sm font-medium">
        {isCreating ? "Creating..." : "New Document"}
      </span>
    </button>
  );
}

function DocumentCard({ id, name, lastModified }: { id: number; name: string | null; lastModified: Date | null }) {
  return (
    <Link href={`/editor/${id}`} className="flex flex-col bg-gray-100 w-32 h-48 rounded-lg">
      <div className="p-4 text-center">
        {getDocumentName({ id, name })}
      </div>
      <div className="mt-auto text-xs text-gray-600 bg-gray-200 rounded-b-lg px-2 py-1">
        {lastModified ? lastModified.toLocaleString() : "No versions"}
      </div>
    </Link>
  );
}

export function DocumentList({ documents }: {
  documents: { id: number; name: string | null; lastModified: Date | null }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Documents</h1>

      <div className="flex gap-2">
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
