import { ComponentConfig, Field } from "@measured/puck";
import { paddingSettingsField, heightSettingsField, widthSettingsField } from "../../lib/settings-fields";
import { cn } from "../../lib/util";


// TODO: Rename this "variant", ensure consistency across components
type ButtonStyle = "primary" | "secondary";

interface BaseButtonProps {
    label: string;
    style: ButtonStyle;
    padding: string;
    height: string;
    width: string;
}

export interface LinkButtonProps extends BaseButtonProps {
    href: string;
}

const VARIANT_TO_STYLES: Record<ButtonStyle, string> = {
    primary: "bg-sga-red hover:bg-sga-red-alt text-white rounded-lg p-4 flex items-center justify-center text-center",
    secondary: "bg-black text-white rounded-lg p-4 flex items-center justify-center text-center"
};

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
        className={cn(
            VARIANT_TO_STYLES[style],
            padding,
            height,
            width
        )}
    >
        {label}
    </a>
)

// export interface ButtonProps extends BaseButtonProps {
//     onClick: () => void;
// }

// export const Button: React.FC<ButtonProps> = ({
//     label,
//     style,
//     padding = "p-4",
//     height = "h-full",
//     width = "w-full",
//     onClick
// }) => (
//     <button
//         onClick={onClick}
//         className={`${buttonStylesMap[style]} ${padding} ${height} ${width}`}
//     >
//         {label}
//     </button>
// )


const buttonStyleSettingsField: Field<ButtonStyle> = {
    type: "select",
    options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
    ]
} as const;


export const LinkButtonConfig: ComponentConfig<LinkButtonProps> = {
    fields: {
        label: { type: "text" },
        style: buttonStyleSettingsField,
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