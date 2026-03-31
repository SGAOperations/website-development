import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDocumentByPath } from "../../lib/documents/queries";
import { Render } from "@puckeditor/core";
import { config } from "@/puck.config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}): Promise<Metadata> {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;

  return {
    title: (await getDocumentByPath(path))?.root.props?.title,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;
  const data = await getDocumentByPath(path);

  if (!data) {
    return notFound();
  }

  return <Render config={config} data={data} />;
}

export const dynamic = "force-static";
