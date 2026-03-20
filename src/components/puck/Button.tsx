import { ComponentConfig } from "@puckeditor/core";
import { paddingSettingsField, heightSettingsField, widthSettingsField } from "../../lib/settings-fields";

const buttonStylesMap = {
    primary: "bg-sga-red hover:bg-sga-red-alt text-white rounded-lg p-4 flex items-center justify-center text-center",
    secondary: "bg-black text-white rounded-lg p-4 flex items-center justify-center text-center",
    tertiary: "bg-white text-sga-red rounded-lg p-4 flex items-center justify-center text-center"
};

interface BaseButtonProps {
    label: string;
    style: "primary" | "secondary" | "tertiary";
    padding: string;
    height: string;
    width: string;
}

export interface ButtonProps extends BaseButtonProps {
    onClick: () => void;
}

export interface LinkButtonProps extends BaseButtonProps {
    href: string;
}

export function Button({
    label,
    style,
    padding = "p-4",
    height = "h-full",
    width = "w-full",
    onClick
}: ButtonProps) {
    return (
    <button
        onClick={onClick}
        className={`${buttonStylesMap[style]} ${padding} ${height} ${width}`}
    >
        {label}
    </button>
    )
}


export function LinkButton({
    label,
    style,
    padding = "p-4",
    height = "h-full",
    width = "w-full",
    href
}: LinkButtonProps) {
    return (
        <a
            href={href}
            className={`${buttonStylesMap[style]} ${padding} ${height} ${width}`}
        >
            {label}
        </a>
    )
}

export const LinkButtonConfig: ComponentConfig<LinkButtonProps> = {
    fields: {
        label: { type: "text" },
        style: {
            type: "select",
            options: [
                { label: "Red", value: "primary" },
                { label: "Black", value: "secondary" },
                { label: "White", value: "tertiary"}
            ]
        },
        href: { type: "text" },
        padding: paddingSettingsField,
        height: heightSettingsField,
        width: widthSettingsField,
    },
    defaultProps: {
        label: "Button",
        style: "primary",
        href: "#",
        padding: "p-4",
        height: "h-full",
        width: "w-full",
    },
    render: (props) => <LinkButton {...props} />,
}