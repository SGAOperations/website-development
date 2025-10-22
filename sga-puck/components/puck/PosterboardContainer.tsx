import { SlotComponent } from "@measured/puck"

export interface PosterboardContainerProps {
    content: SlotComponent;
    gap?: string;
}

export const PosterboardContainer: React.FC<PosterboardContainerProps> = ({
    content: Content,
    gap,
}) => (
    <Content className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gap}`} />
)