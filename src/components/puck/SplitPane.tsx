import { ComponentConfig, PuckContext, SlotComponent} from "@puckeditor/core"
import { backgroundColorSettingField, gapSettingsField, paddingSettingsField } from "../../lib/settings-fields";

export interface SplitPaneProps {
    paneOneContent?: SlotComponent,
    paneTwoContent?: SlotComponent,
    paneOneRatio?: number,
    paneTwoRatio?: number,
    gap: string,
    padding: string,
    backgroundColor: string;
}

export interface SplitPanePropsForRender extends SplitPaneProps {
    puck: PuckContext
}

export function SplitPane({
    paneOneContent: ContentOne,
    paneTwoContent: ContentTwo,
    paneOneRatio = 1,
    paneTwoRatio = 4,
    gap = "gap-4",
    padding = "p-8",
    backgroundColor = "#ffffff",
    puck
}: SplitPanePropsForRender) {

    return <div ref={puck.dragRef} className={`${gap} ${padding} flex flex-col md:flex-row items-center`} style={{backgroundColor}}>
            <div style={{flex: paneOneRatio}}>
                {ContentOne && <ContentOne />}
            </div>
            <div style={{flex: paneTwoRatio}}>
                {ContentTwo && <ContentTwo />}
            </div>
             </div>
}
export const SplitPaneConfig: ComponentConfig<SplitPaneProps> = {
    inline: true,
    fields: {
        paneOneContent: { type: "slot" },
        paneTwoContent: { type: "slot" },
        gap: gapSettingsField,
        padding: paddingSettingsField,
        backgroundColor: backgroundColorSettingField,
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
        gap: "gap-4",
        backgroundColor: "#ffffff",
        padding: "p-8",
        paneOneRatio: 1,
        paneTwoRatio: 4
    },
    render: (props) => <SplitPane {...props} />,
}