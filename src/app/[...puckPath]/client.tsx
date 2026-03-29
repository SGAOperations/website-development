"use client";

import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import config from "../../puck.config";
import { MediaProvider, type MediaWithUrl } from "@/components/puck/media-context";

export function Client({ data, media }: { data: Data; media: MediaWithUrl[] }) {
  return (
    <MediaProvider media={media}>
      <Render config={config} data={data} />
    </MediaProvider>
  );
}
