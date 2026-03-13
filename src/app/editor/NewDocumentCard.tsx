"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewDocumentCard() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateDocument() {
    const name = window.prompt("Document name");

    if (name === null) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/puck/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          content: { content: [], root: {} },
          publish: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const payload = await response.json();
      router.push(`/editor/${payload.document.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Failed to create document");
    } finally {
      setIsCreating(false);
    }
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