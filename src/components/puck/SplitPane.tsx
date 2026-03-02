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
    direction = "col",
    paneOneRatio = 1,
    paneTwoRatio = 4,
    gap = "gap-4",
    puck
}) => {
    // TODO: robust handling of gap to margin conversion
    // make the prop and setting numerical

    const tailwindHacks = "grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12 " +
        "grid-rows-1 grid-rows-2 grid-rows-3 grid-rows-4 grid-rows-5 grid-rows-6 grid-rows-7 grid-rows-8 grid-rows-9 grid-rows-10 grid-rows-11 grid-rows-12 " +
        "col-start-1 col-start-2 col-start-3 col-start-4 col-start-5 col-start-6 col-start-7 col-start-8 col-start-9 col-start-10 col-start-11 col-start-12 " +
        "col-end-1 col-end-2 col-end-3 col-end-4 col-end-5 col-end-6 col-end-7 col-end-8 col-end-9 col-end-10 col-end-11 col-end-12 " +
        "row-start-1 row-start_2 row-start_3 row-start_4 row-start_5 row-start_6 row-start_7 row-start_8 row-start_9 row-start_10 row-start_11 row-start_12 " +
        "row-end-1 row-end-2 row-end-3 row-end-4 row-end-5 row-end-6 row-end-7 row-end-8 row-end-9 row-end-10 row-end-11 row-end-12"
    const totalSize = paneOneRatio + paneTwoRatio
    return <div ref={puck.dragRef} className={`grid grid-${direction}s-${totalSize} ${gap}`}>
            <ContentOne className={`${direction}-start-1 ${direction}-end-${paneOneRatio + 1}`}/>
            <ContentTwo className={`${direction}-start-${paneOneRatio + 1} ${direction}-end-${totalSize + 1}`} />
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
        direction: "col",
        paneOneRatio: 1,
        paneTwoRatio: 4
    },
    render: (props) => <SplitPane {...props} />,
}