import { ComponentConfig, PuckContext, SlotComponent} from "@puckeditor/core"
import { backgroundColorSettingField, gapSettingsField } from "../../lib/settings-fields";

export interface SplitPaneProps {
    paneOneContent: SlotComponent,
    paneTwoContent: SlotComponent,
    direction?: string,
    paneOneRatio?: number,
    paneTwoRatio?: number,
    gap?: string
    backgroundColor?: string;
}

export interface SplitPanePropsForRender extends SplitPaneProps {
    puck: PuckContext
}

export const SplitPane: React.FC<SplitPanePropsForRender> = ({
    paneOneContent: ContentOne,
    paneTwoContent: ContentTwo,
    direction = "md:flex-row",
    paneOneRatio = 1,
    paneTwoRatio = 4,
    gap = "gap-4",
    backgroundColor = "#ffffff",
    puck
}) => {

    return <div ref={puck.dragRef} className={`${gap} flex flex-col ${direction}`} style={{backgroundColor}}>
            <div style={{flex: paneOneRatio}}>
                <ContentOne />
            </div>
            <div style={{flex: paneTwoRatio}}>
                <ContentTwo />
            </div>
             </div>
}
export const SplitPaneConfig: ComponentConfig<SplitPaneProps> = {
    inline: true,
    fields: {
        paneOneContent: { type: "slot" },
        paneTwoContent: { type: "slot" },
        gap: gapSettingsField,
        backgroundColor: backgroundColorSettingField,
        direction: {
            type: "radio",
            options: [ 
                { label: "horizontal", value: "md:flex-row" },
                { label: "vertical", value: "md:flex-col" }
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
        backgroundColor: "#ffffff",
        direction: "md:flex-row",
        paneOneRatio: 1,
        paneTwoRatio: 4
    },
    render: (props) => <SplitPane {...props} />,
}