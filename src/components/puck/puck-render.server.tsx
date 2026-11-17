import "server-only";

import { Render, type Data } from "@puckeditor/core";
import { config } from "@/puck.config";
import { refreshMediaUrls } from "../../lib/media/refresh-urls";

/**
 * Renders saved Puck page data on the server.
 *
 * Saved images hold `{ mediaId, url }` and the url goes stale when a file is
 * renamed, so the data goes through `refreshMediaUrls` first.
 */
export async function PuckRender({ data }: { data: Data }) {
  const freshData = await refreshMediaUrls(data);
  return <Render config={config} data={freshData} />;
}
