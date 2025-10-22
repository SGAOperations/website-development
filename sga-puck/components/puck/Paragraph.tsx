export interface ParagraphProps {
    text: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({
    text
}) => {
    return (
        <p>
            {text}
        </p>
    )
}