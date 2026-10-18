import type { Config } from "@puckeditor/core";
import { Group } from "@/components/puck/blocks/group";
import { Columns } from "@/components/puck/blocks/columns";
import { Grid } from "@/components/puck/blocks/grid";
import { RichTextComponent } from "@/components/puck/blocks/rich-text";
import { Media } from "@/components/puck/blocks/media";
import { PuckButton } from "@/components/puck/blocks/button";
import { Section } from "@/components/puck/blocks/section";
import { Icon } from "./components/puck/blocks/icon";

export const config = {
  categories: {
    layout: { title: "Layout", components: ["Section", "Container", "Columns", "Grid"] },
    content: { title: "Content", components: ["Text", "Image", "Icon"] },
    interactive: { title: "Interactive", components: ["Button"] },
  },
  components: {
    Anchor,
    Group,
    Columns,
    Grid,
    Text: RichTextComponent,
    Image: Media,
    Button: PuckButton,
    Icon,
  },
} satisfies Config;

export default config;
