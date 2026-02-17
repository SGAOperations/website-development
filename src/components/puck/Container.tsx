import { ComponentConfig, SlotComponent } from "@measured/puck"
import { gapSettingsField, outlineSettingsField, paddingSettingsField } from "../../lib/settings-fields";

export interface ContainerProps {
    content: SlotComponent;
    padding?: string;
    gap?: string;
    outline?: string;
}

export const Container: React.FC<ContainerProps> = ({
    content: Content,
    padding = "",
    gap = "",
    outline = "",
}) => (
    <Content className={`flex flex-col w-full ${padding} ${gap} ${outline}`} />
)

export const ContainerConfig: ComponentConfig<ContainerProps> = {
      fields: {
        content: { type: "slot" },
        padding: paddingSettingsField,
        gap: gapSettingsField,
        outline: outlineSettingsField
      },
      defaultProps: {
        content: null,
        padding: "p-10",
        gap: "gap-6",
      },
      render: (props) => <Container {...props} />,
}