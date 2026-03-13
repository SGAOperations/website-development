import type { Data } from "@puckeditor/core";

export type Version = {
  id: number;
  documentId: number;
  createdAt: string;
};

export async function publishVersion({
  documentId,
  versionId,
}: {
  documentId: number;
  versionId: number;
}): Promise<void> {
  const response = await fetch("/puck/api/publish", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId,
      versionId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to publish");
  }
}

export async function fetchVersions({
  documentId,
}: {
  documentId: number;
}): Promise<Version[]> {
  const response = await fetch(`/puck/api/versions?documentId=${documentId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch versions");
  }

  const result = await response.json();
  return result.versions || [];
}

export async function saveVersion({
  documentId,
  content,
}: {
  documentId: number;
  content: Data;
}): Promise<{ version: Version }> {
  const response = await fetch("/puck/api/versions", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId,
      content,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save");
  }

  return response.json();
}
