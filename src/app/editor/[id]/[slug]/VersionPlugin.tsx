import { PencilLine } from "lucide-react";
import { VersionPluginContainer } from "./VersionPluginContainer";
import type { Plugin } from "@puckeditor/core";

export const VersionPlugin: Plugin = {
  name: "version-plugin",
  label: "Versions",
  icon: <PencilLine />,
  render: VersionPluginContainer,
};
