"use client";

import { createUsePuck } from "@puckeditor/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./client";
import { saveVersionAction } from "../../../lib/actions";

const usePuck = createUsePuck();

export function SaveButton() {
  const data = usePuck((s) => s.appState.data);
  const dispatch = usePuck((s) => s.dispatch);
  const router = useRouter();
  const { documentId } = useDocumentContext();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveVersionAction({ documentId, content: data });

    if (result.success === false) {
      alert(`Error: ${result.error}`);
      setIsSaving(false);
      return;
    }

    dispatch({ type: "setData", data });
    router.push(`/editor/${documentId}?versionId=${result.data.version.id}`);
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}
