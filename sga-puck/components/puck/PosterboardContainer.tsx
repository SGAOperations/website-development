import { SlotComponent } from "@measured/puck"

export interface PosterboardContainerProps {
    content: SlotComponent;
    gap?: string;
}

export const PosterboardContainer: React.FC<PosterboardContainerProps> = ({
    content: Content,
    gap = "",
}) => {
    // TODO: robust handling of gap to margin conversion
    // make the prop and setting numerical
    const bottomMargin = gap.includes("gap-") ? gap.replace("gap-", "mb-") : ""
    // NOTE: [&>*]:style applies style to direct children
    return <Content className={`columns-1 md:columns-2 lg:columns-3 ${gap} [&>*]:break-inside-avoid [&>*]:${bottomMargin}`} />
}