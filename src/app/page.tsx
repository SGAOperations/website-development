import { notFound } from "next/navigation";
import { getDocumentByPath } from "../lib/documents/queries";
import { Render } from "@puckeditor/core";
import { config } from "@/puck.config";

export default async function Page() {
  const path = "/";
  const data = await getDocumentByPath(path);

  if (!data) {
    return notFound();
  }

  return <Render config={config} data={data} />;
}

export const dynamic = "force-static";
