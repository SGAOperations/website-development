import type { Config } from "@measured/puck";
import { PageHeaderConfig } from "./components/puck/PageHeader";
import { CommitteeGridConfig } from "./components/puck/CommitteeGrid";
import { HeaderContentConfig } from "./components/puck/HeaderContent";
import { NavigationConfig } from "./components/puck/Navigation";
import { ContentConfig } from "./components/puck/Content";
import { FooterConfig } from "./components/puck/Footer";
import { TitleConfig } from "./components/puck/Title";
import { ContainerConfig } from "./components/puck/Container";
import { ParagraphConfig } from "./components/puck/Paragraph";
import { MasonryGridConfig } from "./components/puck/MasonryGrid";
import { BulletListConfig } from "./components/puck/BulletList";
import { LinkButtonConfig } from "./components/puck/Button";
import { MinimumColumnWidthGridConfig } from "./components/puck/MinimumColumnWidthGrid";
import { RootContainerConfig } from "./components/puck/RootContainer";

export const config = {
  components: {
    HeaderContent: HeaderContentConfig,
    Navigation: NavigationConfig,
    Content: ContentConfig,
    Footer: FooterConfig,
    CommitteeGrid: CommitteeGridConfig,
    PageHeader: PageHeaderConfig,
    Title: TitleConfig,
    Container: ContainerConfig,
    Paragraph: ParagraphConfig,
    MasonryGrid: MasonryGridConfig,
    BulletList: BulletListConfig,
    LinkButton: LinkButtonConfig,
    MinimumColumnWidthGrid: MinimumColumnWidthGridConfig,
    RootContainer: RootContainerConfig,
  },
} satisfies Config;

export default config;
