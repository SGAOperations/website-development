import type { ReactNode } from "react";
import { Announcer } from "@/components/ui/announcer";
import { DisplaySettingsProvider } from "@/components/display-settings/DisplaySettingsProvider";
import { displaySettingsScript } from "@/lib/display-settings";

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Apply saved theme, contrast, motion and text size before first paint. */}
      <script dangerouslySetInnerHTML={{ __html: displaySettingsScript }} />
      <DisplaySettingsProvider>{children}</DisplaySettingsProvider>
      <Announcer />
    </>
  );
}
