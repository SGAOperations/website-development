import { Client } from "./[...puckPath]/client";
import { notFound } from "next/navigation";
import { getDocumentByPath } from "../lib/documents/queries";


export default async function Page() {
  const path = "/";
  const data = await getDocumentByPath(path);

  if (!data) {
    return notFound();
  }

  return <Client data={data} />;
}

export const dynamic = "force-static";
