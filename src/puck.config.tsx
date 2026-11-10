import type { Config } from "@puckeditor/core";
import { Group } from "@/components/puck/blocks/group";
import { Columns } from "@/components/puck/blocks/columns";
import { Grid } from "@/components/puck/blocks/grid";
import { RichTextComponent } from "@/components/puck/blocks/rich-text";
import { Media } from "@/components/puck/blocks/media";
import { PuckButton } from "@/components/puck/blocks/button";
import { Marquee } from "@/components/puck/blocks/marquee";
import { Anchor } from "@/components/puck/blocks/anchor";
import { NavBar } from "@/components/puck/blocks/nav-bar";
import { Footer } from "@/components/puck/blocks/footer";

export const config = {
  categories: {
    layout: { title: "Layout", components: ["NavBar", "Anchor", "Group", "Columns", "Grid", "Marquee", "Footer"] },
    content: { title: "Content", components: ["Text", "Image"] },
    interactive: { title: "Interactive", components: ["Button"] },
  },
  components: {
    NavBar,
    Anchor,
    Group,
    Columns,
    Grid,
    Marquee,
    Footer,
    Text: RichTextComponent,
    Image: Media,
    Button: PuckButton,
  },
} satisfies Config;

export default config;
