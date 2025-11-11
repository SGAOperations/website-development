import { ComponentConfig } from "@measured/puck";

export interface ParagraphProps {
    text: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({
    text
}) => {
    // TODO: robust rich text handling
    const paragraphs = text.split('\n').map((line, index) => (
        <p key={index} className="mb-2 last:mb-0 break-words">
            {line}
        </p>
    ))

    return <>{paragraphs}</>
}

export const ParagraphConfig: ComponentConfig<ParagraphProps> = {
    fields: {
        text: { type: "textarea" },
    },
    defaultProps: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    render: (props) => <Paragraph {...props} />,
}