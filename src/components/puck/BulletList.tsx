import { ComponentConfig } from "@puckeditor/core";
import { JSX } from "react";
import { textColorSettingField } from "../../lib/settings-fields";

export type BulletType = "disc" | "decimal" | "none"

export interface BulletListProps {
    items: { text: string }[];
    bullet: BulletType;
    textColor: string;
}

export const BulletList: React.FC<BulletListProps> = ({
    items,
    bullet = "disc",
    textColor = "text-black"
}) => {
    const ListComponent = bullet === "decimal" ? "ol" : "ul" as keyof JSX.IntrinsicElements;

    const listStyleMap = {
        disc: "list-disc list-outside",
        decimal: "list-decimal list-outside",
        none: "list-none"
    }
    const listStyles = listStyleMap[bullet]

    return (
        <ListComponent className={`${listStyles} ${textColor}`}>
            {items.map(({ text }, index) => (
                <li key={index} className="mb-2 last:mb-0">
                    {text}
                </li>
            ))}
        </ListComponent>
    )
}

export const BulletListConfig: ComponentConfig<BulletListProps> = {
    fields: {
        bullet: {
            type: "select",
            options: [
                { label: "Disc", value: "disc" },
                { label: "Decimal", value: "decimal" },
                { label: "None", value: "none" },
            ]
        },
        items: {
            type: "array",
            arrayFields: {
                text: { type: "text" },
            },
        },
        textColor: textColorSettingField
    },
    defaultProps: {
        bullet: "disc",
        items: [
            { text: "First item" },
            { text: "Second item" },
            { text: "Third item" },
        ],
        textColor: "text-black"
    },
    render: (props) => <BulletList {...props} />,
}