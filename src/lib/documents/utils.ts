export function getDocumentName(document: { id: number; name: string | null }) {
  if (document.name) return document.name;
  return `Untitled Document #${document.id}`;
}
