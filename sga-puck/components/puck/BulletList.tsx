import { ComponentConfig, Field } from "@measured/puck";
import { JSX } from "react";

export type BulletType = "disc" | "decimal" | "none"

export interface BulletListProps {
    items: { text: string }[];
    bullet: BulletType;
}

const BULLET_TO_STYLES: Record<BulletType, string> = {
    disc: "list-disc list-outside",
    decimal: "list-decimal list-outside",
    none: "list-none"
}


export const BulletList: React.FC<BulletListProps> = ({
    items,
    bullet = "disc"
}) => {
    const ListTag = (
        bullet === "decimal" 
        ? "ol" 
        : "ul"
    ) as keyof JSX.IntrinsicElements;

    return (
        <ListTag className={BULLET_TO_STYLES[bullet]}>
            {items.map(({ text }, index) => (
                <li key={index} className="mb-2 last:mb-0">
                    {text}
                </li>
            ))}
        </ListTag>
    )
}


const bulletTypeField: Field<BulletType> = {
    type: "select",
    options: [
        { label: "Disc", value: "disc" },
        { label: "Decimal", value: "decimal" },
        { label: "None", value: "none" },
    ]
} as const;


export const BulletListConfig: ComponentConfig<BulletListProps> = {
    fields: {
        bullet: bulletTypeField,
        items: {
            type: "array",
            arrayFields: {
                text: { type: "text" },
            },
        },
    },
    defaultProps: {
        bullet: "disc",
        items: [
            { text: "First item" },
            { text: "Second item" },
            { text: "Third item" },
        ],
    },
    render: (props) => <BulletList {...props} />,
}