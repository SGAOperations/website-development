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