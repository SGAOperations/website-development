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
    direction = "horizontal",
    paneOneRatio = 1,
    paneTwoRatio = 4,
    gap = "gap-4",
    puck
}) => {

    if (direction === "vertical") {
        return <div ref={puck.dragRef} className={`grid grid-cols-1 ${gap}`}>
            <ContentOne />
            <ContentTwo  />
            </div>
    }

    // DO NOT DELETE. The below comments are required for the design to work properly.
    // Tailwind doesn't support dynamic class names, so we need to predefine all possible classes split pane. 
    // "md:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-4 md:grid-cols-5 md:grid-cols-6 md:grid-cols-7 md:grid-cols-8 md:grid-cols-9 md:grid-cols-10 md:grid-cols-11 md:grid-cols-12 " +
    // "md:col-start-1 md:col-start-2 md:col-start-3 md:col-start-4 md:col-start-5 md:col-start-6 md:col-start-7 md:col-start-8 md:col-start-9 md:col-start-10 md:col-start-11 md:col-start-12 " +
    // "md:col-end-1 md:col-end-2 md:col-end-3 md:col-end-4 md:col-end-5 md:col-end-6 md:col-end-7 md:col-end-8 md:col-end-9 md:col-end-10 md:col-end-11 md:col-end-12 " 
    
    const totalSize = paneOneRatio + paneTwoRatio
    return <div ref={puck.dragRef} className={`grid ${gap} grid-cols-1 md:grid-cols-${totalSize}`}>
            <ContentOne className={`md:col-start-1 md:col-end-${paneOneRatio + 1}`}/>
            <ContentTwo className={`md:col-start-${paneOneRatio + 1} md:col-end-${totalSize + 1}`} />
            </div>
}
export const SplitPaneConfig: ComponentConfig<SplitPaneProps> = {
    inline: true,
    fields: {
        paneOneContent: { type: "slot" },
        paneTwoContent: { type: "slot" },
        gap: gapSettingsField,
        direction: {
            type: "radio",
            options: [ 
                { label: "horizontal", value: "horizontal" },
                { label: "vertical", value: "vertical" }
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
        direction: "horizontal",
        paneOneRatio: 1,
        paneTwoRatio: 4
    },
    render: (props) => <SplitPane {...props} />,
}