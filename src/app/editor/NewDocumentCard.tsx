"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createDocumentAction } from "../../lib/actions";

export function NewDocumentCard() {
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
        content: { content: [], root: {} },
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
      className="flex h-32 w-32 flex-col items-center justify-center border border-dashed border-gray-400 bg-white p-4 text-center text-gray-700 transition-colors hover:border-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="text-3xl leading-none">+</span>
      <span className="mt-2 text-sm font-medium">
        {isCreating ? "Creating..." : "New Document"}
      </span>
    </button>
  );
}