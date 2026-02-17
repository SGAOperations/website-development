import { ComponentConfig, SlotComponent } from "@measured/puck";
import { gapSettingsField } from "../../lib/settings-fields";

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

export const MinimumColumnWidthGridConfig: ComponentConfig<MinimumColumnWidthGridProps> = {
    fields: {
        content: { type: "slot" },
        minimumColumnWidthPixels: {
            type: "number",
            label: "Minimum Column Width (in pixels)",
        },
        gap: gapSettingsField,
    },
    defaultProps: {
        content: null,
        minimumColumnWidthPixels: 250,
        gap: "gap-4",
    },
    render: (props) => <MinimumColumnWidthGrid {...props} />,
}