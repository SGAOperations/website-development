import { SlotComponent } from "@measured/puck"

export interface PosterboardContainerProps {
    content: SlotComponent;
    gap?: string;
    childrenBottomMargin?: string;
}

export const PosterboardContainer: React.FC<PosterboardContainerProps> = ({
    content: Content,
    gap = "gap-4",
    childrenBottomMargin = "mb-4",
}) => {
    // TODO: robust handling of gap to margin conversion
    // make the prop and setting numerical
    
    // NOTE: [&>*]:style applies style to direct children
    return <Content className={`columns-1 md:columns-2 lg:columns-3 ${gap} [&>*]:break-inside-avoid [&>*]:${childrenBottomMargin}`} />
}