import { ComponentConfig, SlotComponent } from "@puckeditor/core"
import { gapSettingsField, outlineSettingsField, paddingSettingsField } from "../../lib/settings-fields";

export interface ContainerProps {
    content?: SlotComponent;
    padding: string;
    gap: string;
    outline: string;
}

export function Container({
    content: Content,
    padding = "",
    gap = "",
    outline = "",
}: ContainerProps) {
    return (
  <div className={`w-full ${padding} ${outline}`}>
    {Content && <Content minEmptyHeight="256px" className={`flex flex-col w-full ${gap}`} />}
  </div>
    )
}

export const ContainerConfig: ComponentConfig<ContainerProps> = {
      fields: {
        content: { type: "slot" },
        padding: paddingSettingsField,
        gap: gapSettingsField,
        outline: outlineSettingsField
      },
      defaultProps: {
        padding: "p-10",
        gap: "gap-6",
        outline: "",
      },
      render: (props) => <Container {...props} />,
}