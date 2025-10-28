import { SlotComponent } from "@measured/puck";

export interface MinimumColumnWidthGridProps {
    content: SlotComponent;
    minimumColumnWidthPixels?: number;
    gap?: string;
}

export const MinimumColumnWidthGrid: React.FC<MinimumColumnWidthGridProps> = ({
    content: Content,
    minimumColumnWidthPixels = 250,
    gap = "gap-4"
}) => {
    return (
        <Content className={`grid ${gap}`} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minimumColumnWidthPixels}px, 1fr))`, gridAutoRows: '1fr' }} />
    )
}