import { ComponentConfig, SlotComponent } from "@puckeditor/core"
import { gapSettingsField, outlineSettingsField, paddingSettingsField } from "../../lib/settings-fields";

export interface ContainerProps {
    content?: SlotComponent;
    padding: string;
    gap: string;
    outline: string;
}

export const Container: React.FC<ContainerProps> = ({
    content: Content,
    padding = "",
    gap = "",
    outline = "",
}) => (
  Content && <Content className={`flex flex-col w-full ${padding} ${gap} ${outline}`} />
)

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