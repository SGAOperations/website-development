import type { Config } from "@puckeditor/core";
import { Group } from "@/components/puck/blocks/group";
import { Columns } from "@/components/puck/blocks/columns";
import { Grid } from "@/components/puck/blocks/grid";
import { RichTextComponent } from "@/components/puck/blocks/rich-text";
import { Media } from "@/components/puck/blocks/media";
import { PuckButton } from "@/components/puck/blocks/button";
import { Anchor } from "@/components/puck/blocks/anchor";

export const config = {
  categories: {
    layout: { title: "Layout", components: ["Anchor", "Group", "Columns", "Grid"] },
    content: { title: "Content", components: ["Text", "Image"] },
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
  },
} satisfies Config;

export default config;
