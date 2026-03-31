import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PuckRender } from "@/components/puck/render";
import { getPublishedDocument } from "./published-document";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}): Promise<Metadata> {
  return {
    title: (await getPublishedDocument(params))?.root.props?.title,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}) {
  const data = await getPublishedDocument(params);

  if (!data) {
    return notFound();
  }

  return <PuckRender data={data} />;
}

export const dynamic = "force-static";
