import { JSX } from "react";

export type BulletType = "disc" | "decimal" | "none" 

export interface BulletListProps {
    items: { text: string }[];
    bullet: BulletType;
}

export const BulletList: React.FC<BulletListProps> = ({
    items,
    bullet = "disc"
}) => {
    const ListComponent = bullet === "decimal" ? "ol" : "ul" as keyof JSX.IntrinsicElements;
    
    const listStyleMap = {
        disc: "list-disc list-inside",
        decimal: "list-decimal list-inside",
        none: "list-none"
    }
    const listStyles = listStyleMap[bullet]

    return (
        <ListComponent className={listStyles}>
            {items.map(({ text }, index) => (
                <li key={index} className="mb-2 last:mb-0">
                    {text}
                </li>
            ))}
        </ListComponent>
    )   
}