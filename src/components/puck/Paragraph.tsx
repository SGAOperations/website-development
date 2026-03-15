import { ComponentConfig, RichText } from "@puckeditor/core";
import { textColorSettingField } from "../../lib/settings-fields";

export interface ParagraphProps {
    text: RichText,
    textColor?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({
    text,
    textColor = "text-black"
}) => (
    <p className={textColor}>
        {text}
    </p>
)

export const ParagraphConfig: ComponentConfig<ParagraphProps> = {
    fields: {
        text: { type: "richtext" },
        textColor: textColorSettingField
    },
    defaultProps: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        textColor: "text-black"
    },
    render: (props) => <Paragraph {...props} />,
}