import { Client } from "./client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDocumentByPath } from "../../lib/documents/queries";

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

  return <Client data={data} />;
}

// Enable ISR: pages are statically generated and revalidated on-demand via revalidatePath()
export const dynamic = "force-static";
export const revalidate = false;
