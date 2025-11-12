import { ComponentConfig } from "@measured/puck";
import { paddingSettingsField, heightSettingsField, widthSettingsField } from "../../lib/settings-fields";

const buttonStylesMap = {
    primary: "bg-sga-red hover:bg-sga-red-alt text-white rounded-lg p-4 flex items-center justify-center text-center",
    secondary: "bg-black text-white rounded-lg p-4 flex items-center justify-center text-center"
};

interface BaseButtonProps {
    label: string;
    style: "primary" | "secondary";
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

export const Button: React.FC<ButtonProps> = ({
    label,
    style,
    padding = "p-4",
    height = "h-full",
    width = "w-full",
    onClick
}) => (
    <button
        onClick={onClick}
        className={`${buttonStylesMap[style]} ${padding} ${height} ${width}`}
    >
        {label}
    </button>
)


export const LinkButton: React.FC<LinkButtonProps> = ({
    label,
    style,
    padding = "p-4",
    height = "h-full",
    width = "w-full",
    href
}) => (
    <a
        href={href}
        className={`${buttonStylesMap[style]} ${padding} ${height} ${width}`}
    >
        {label}
    </a>
)

export const LinkButtonConfig: ComponentConfig<LinkButtonProps> = {
    fields: {
        label: { type: "text" },
        style: {
            type: "select",
            options: [
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
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