import "server-only";

import { Render, type Data } from "@puckeditor/core";
import { config } from "@/puck.config";
import { hasMainLandmark, MAIN_CONTENT_ID } from "@/lib/puck/a11y";

export function PuckRender({ data }: { data: Data }) {
  const page = <Render config={config} data={data} />;

  return (
    <div className="site-content">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-3 focus:text-background focus:underline"
      >
        Skip to main content
      </a>
      {/* If the editor placed a <main> Group, it carries the id itself; otherwise the whole page is main. */}
      {hasMainLandmark(data) ? page : <main id={MAIN_CONTENT_ID}>{page}</main>}
    </div>
  );
}
