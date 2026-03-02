import { ComponentConfig, PuckContext, SlotComponent} from "@puckeditor/core"
import { gapSettingsField } from "../../lib/settings-fields";

export interface SplitPaneProps {
    paneOneContent: SlotComponent,
    paneTwoContent: SlotComponent,
    direction?: string,
    paneOneRatio?: number,
    paneTwoRatio?: number,
    gap?: string;
}

export interface SplitPanePropsForRender extends SplitPaneProps {
    puck: PuckContext
}

export const SplitPane: React.FC<SplitPanePropsForRender> = ({
    paneOneContent: ContentOne,
    paneTwoContent: ContentTwo,
    direction = "flex-row",
    paneOneRatio = 1,
    paneTwoRatio = 2,
    gap = "gap-4",
    puck
}) => {
    // TODO: robust handling of gap to margin conversion
    // make the prop and setting numerical

    const totalSize = paneOneRatio + paneTwoRatio
    return <div ref={puck.dragRef} className={`grid grid-cols-1 md:grid-${direction}s-${totalSize} ${gap}`}>
            <ContentOne className={`md:${direction}-start-1 md:col-end-${paneOneRatio + 1}`}/>
            <ContentTwo className={`md:${direction}-start-${paneOneRatio + 1} md:col-end-${totalSize + 1}`} />
            </div>
}
export const SplitPaneConfig: ComponentConfig<SplitPaneProps> = {
    inline: true,
    fields: {
        paneOneContent: { type: "slot" },
        paneTwoContent: { type: "slot" },
        gap: gapSettingsField,
        direction: {
            type: "select",
            options: [ 
                // horizontal splits need to span across x columns, vertical across x rows
                { label: "horizontal", value: "col" },
                { label: "vertical", value: "row" }
            ]
        },
        paneOneRatio: {
            type: "number",
            label: "Pane One Ratio Component (e.g. to have a 1:4 ratio, enter 1 in this field)",
        },
        paneTwoRatio: {
            type: "number",
            label: "Pane Two Ratio Component (e.g. to have a 1:4 ratio, enter 4 in this field)",
        },
    },
    defaultProps: {
        paneOneContent: null,
        paneTwoContent: null,
        gap: "gap-4",
        direction: "flex-row",
        paneOneRatio: 1,
        paneTwoRatio: 4
    },
    render: (props) => <SplitPane {...props} />,
}