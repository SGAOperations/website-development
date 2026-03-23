import type { Config } from "@puckeditor/core";
import { Container } from "@/components/puck/container";
import { Columns } from "@/components/puck/columns";
import { Grid } from "@/components/puck/grid";
import { RichTextComponent } from "@/components/puck/rich-text";
import { Media } from "@/components/puck/media";
import { PuckButton } from "@/components/puck/button";

export const config = {
  categories: {
    layout: { title: "Layout", components: ["Container", "Columns", "Grid"] },
    content: { title: "Content", components: ["Text", "Image"] },
    interactive: { title: "Interactive", components: ["Button"] },
  },
  components: {
    Container,
    Columns,
    Grid,
    Text: RichTextComponent,
    Image: Media,
    Button: PuckButton,
  },
} satisfies Config;

export default config;
