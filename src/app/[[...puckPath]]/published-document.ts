import { cache } from "react";
import { getDocumentByPath } from "../../lib/documents/queries";

type PublishedRouteParams = Promise<{ puckPath?: string[] }>;

export async function getPublishedDocument(params: PublishedRouteParams) {
  return getPublishedDocumentByPath(getPublishedPath(await params));
}

function getPublishedPath({ puckPath = [] }: { puckPath?: string[] }) {
  return `/${puckPath.join("/")}`;
}

const getPublishedDocumentByPath = cache(getDocumentByPath);
