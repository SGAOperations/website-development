import type { Config } from "@measured/puck";
import { PageHeaderConfig, PageHeaderProps } from "./components/puck/PageHeader";
import { CommitteeGridConfig, CommitteeGridProps } from "./components/puck/CommitteeGrid";
import { HeaderContentConfig, HeaderContentProps } from "./components/puck/HeaderContent";
import { NavigationConfig, NavigationProps } from "./components/puck/Navigation";
import { ContentConfig, ContentProps } from "./components/puck/Content";
import { FooterConfig, FooterProps } from "./components/puck/Footer";
import { TitleConfig, TitleProps } from "./components/puck/Title";
import { ContainerConfig, ContainerProps } from "./components/puck/Container";
import { ParagraphConfig, ParagraphProps } from "./components/puck/Paragraph";
import { MasonryGridConfig, MasonryGridProps } from "./components/puck/MasonryGrid";
import { BulletListConfig, BulletListProps } from "./components/puck/BulletList";
import { LinkButtonConfig, LinkButtonProps } from "./components/puck/Button";
import { MinimumColumnWidthGridConfig, MinimumColumnWidthGridProps } from "./components/puck/MinimumColumnWidthGrid";
import { RootContainerConfig, RootContainerProps } from "./components/puck/RootContainer";


type Props = {
  HeaderContent: HeaderContentProps;
  Navigation: NavigationProps;
  Content: ContentProps;
  Footer: FooterProps;
  CommitteeGrid: CommitteeGridProps;
  PageHeader: PageHeaderProps;
  Title: TitleProps;
  Container: ContainerProps;
  Paragraph: ParagraphProps;
  MasonryGrid: MasonryGridProps;
  BulletList: BulletListProps;
  LinkButton: LinkButtonProps;
  MinimumColumnWidthGrid: MinimumColumnWidthGridProps;
  RootContainer: RootContainerProps;
};

export const config: Config<Props> = {
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
};

export default config;
