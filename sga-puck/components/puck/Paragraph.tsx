import { ComponentConfig, RichText } from "@puckeditor/core";

export interface ParagraphProps {
    text: RichText;
}

export const Paragraph: React.FC<ParagraphProps> = ({
    text
}) => (
    text
)

export const ParagraphConfig: ComponentConfig<ParagraphProps> = {
    fields: {
        text: { type: "richtext" },
    },
    defaultProps: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    render: (props) => <Paragraph {...props} />,
}