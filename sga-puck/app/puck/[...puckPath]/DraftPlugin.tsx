import { PencilLine } from "lucide-react";
import { DraftPluginContainer } from "./DraftPluginContainer";
import type { Plugin } from "@puckeditor/core";

export const DraftPlugin: Plugin = {
  name: "draft-plugin",
  label: "Drafts",
  icon: <PencilLine />,
  render: DraftPluginContainer,
};