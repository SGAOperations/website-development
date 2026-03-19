import { ComponentConfig, RichText } from "@puckeditor/core";
import { textColorSettingField } from "../../lib/settings-fields";

export interface ParagraphProps {
    text: RichText,
    textColor: string;
}

export function Paragraph({
    text,
    textColor = "text-black"
}: ParagraphProps) {
    return (
    typeof text === "string"
     ? (
        <p className={textColor}>
            {text}
        </p>
     )
     : (
        <div className={textColor}>
            {text}
        </div>
     )
    )
}

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