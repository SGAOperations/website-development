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
      className="flex h-48 w-32 shrink-0 cursor-pointer rounded-lg flex-col items-center justify-center border border-dashed border-gray-400 bg-white p-4 text-center text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="text-3xl leading-none">+</span>
      <span className="mt-2 text-sm font-medium">
        {isCreating ? "Creating..." : "New Document"}
      </span>
    </button>
  );
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const seconds = Math.floor((now - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  const months = Math.floor(days / 30);
  if (days < 365) return `${months} ${months === 1 ? "mo" : "mos"} ago`;
  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "yr" : "yrs"} ago`;
}

function DocumentCard({ id, name, lastModified }: { id: number; name: string | null; lastModified: Date | null }) {
  return (
    <Link href={`/editor/${id}`} className="flex flex-col bg-gray-100 w-32 h-48 shrink-0 rounded-lg p-2">
      <div className="flex flex-1 w-full items-center justify-center text-center font-medium line-clamp-3 break-words">
        {getDocumentName({ id, name })}
      </div>
      <div className="text-xs text-gray-600 px-2 py-1 text-center">
        {lastModified ? formatRelativeTime(lastModified) : "No versions"}
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
