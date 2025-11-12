import { ComponentConfig, SlotComponent } from "@measured/puck"
import { gapSettingsField } from "../../lib/settings-fields";

export interface MasonryGridProps {
    content: SlotComponent;
    gap?: string;
    childrenBottomMargin?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
    content: Content,
    gap = "gap-4",
    childrenBottomMargin = "[&>*]:mb-4",
}) => {
    // TODO: robust handling of gap to margin conversion
    // make the prop and setting numerical

    // NOTE: [&>*]:style applies style to direct children
    return <Content className={`columns-1 md:columns-2 lg:columns-3 ${gap} [&>*]:break-inside-avoid ${childrenBottomMargin}`} />
}

export const MasonryGridConfig: ComponentConfig<MasonryGridProps> = {
    fields: {
        content: { type: "slot" },
        gap: gapSettingsField,
        childrenBottomMargin: {
            type: "select",
            options: [ // TODO: make numerical or style based (i.e. small, medium, large)
                { label: "None", value: "[&>*]:mb-0" },
                { label: "Small (mb-2)", value: "[&>*]:mb-2" },
                { label: "Medium (mb-4)", value: "[&>*]:mb-4" },
            ]
        }
    },
    defaultProps: {
        content: null,
        gap: "gap-4",
        childrenBottomMargin: "mb-4",
    },
    render: (props) => <MasonryGrid {...props} />,
}