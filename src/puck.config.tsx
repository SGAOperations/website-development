import type { Config } from "@puckeditor/core";
import { Container } from "@/components/puck/blocks/container";
import { Columns } from "@/components/puck/blocks/columns";
import { Grid } from "@/components/puck/blocks/grid";
import { RichTextComponent } from "@/components/puck/blocks/rich-text";
import { Media } from "@/components/puck/blocks/media";
import { PuckButton } from "@/components/puck/blocks/button";
import { Section } from "@/components/puck/blocks/section";

export const config = {
  categories: {
    layout: { title: "Layout", components: ["Section", "Container", "Columns", "Grid"] },
    content: { title: "Content", components: ["Text", "Image"] },
    interactive: { title: "Interactive", components: ["Button"] },
  },
  components: {
    Section,
    Container,
    Columns,
    Grid,
    Text: RichTextComponent,
    Image: Media,
    Button: PuckButton,
  },
} satisfies Config;

export default config;
