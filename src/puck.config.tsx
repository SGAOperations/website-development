import type { Config } from "@puckeditor/core";
import { HeaderContentConfig } from "./components/puck/HeaderContent";
import { NavigationConfig } from "./components/puck/Navigation";
import { FooterConfig } from "./components/puck/Footer";
import { TitleConfig } from "./components/puck/Title";
import { ContainerConfig } from "./components/puck/Container";
import { ParagraphConfig } from "./components/puck/Paragraph";
import { MasonryGridConfig } from "./components/puck/MasonryGrid";
import { BulletListConfig } from "./components/puck/BulletList";
import { LinkButtonConfig } from "./components/puck/Button";
import { MinimumColumnWidthGridConfig } from "./components/puck/MinimumColumnWidthGrid";
import { RootContainerConfig } from "./components/puck/RootContainer";
import { SplitPaneConfig  } from "./components/puck/SplitPane";
import { IconConfig } from "./components/puck/Icon"; 

export const config = {
  categories: {
    navigation: {
      title: "Navigation",
      components: ["Navigation", "LinkButton"],
    },
    content: {
      title: "Content",
      components: ["Title", "Paragraph", "BulletList", "Icon"],
    },
    grid: {
      title: "Grids",
      components: ["CommitteeGrid", "MasonryGrid", "MinimumColumnWidthGrid",],
    },
    layout: {
      title: "Layout",
      components: [
        "Container",
        "RootContainer",
        "Content",
        "Footer",
        "HeaderContent",
        "SplitPane",
      ],
    },
  },

  components: {
    HeaderContent: HeaderContentConfig,
    Navigation: NavigationConfig,
    Footer: FooterConfig,
    Title: TitleConfig,
    Container: ContainerConfig,
    Paragraph: ParagraphConfig,
    MasonryGrid: MasonryGridConfig,
    BulletList: BulletListConfig,
    LinkButton: LinkButtonConfig,
    MinimumColumnWidthGrid: MinimumColumnWidthGridConfig,
    RootContainer: RootContainerConfig,
    SplitPane: SplitPaneConfig,
    Icon: IconConfig
  },
} satisfies Config;

export default config;
