import { Field, ComponentConfig } from "@puckeditor/core";
import React from "react";
import { IconName, DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';
import { backgroundColorSettingField, paddingSettingsField } from '../../lib/settings-fields';

export type IconProps = {
    size: number,
    padding: string;
    color: string;
    icon?: IconName;
};

export const Icon: React.FC<IconProps> = ({
    size = 55,
    padding = "p-4",
    color = "#dc2626",
    icon = "landmark"
}) => {
    const resolvedIcon = !(icon in dynamicIconImports)? "landmark" : icon

    return <div className={`flex ${padding} align-items-center justify-items-center`}>
         <DynamicIcon name={resolvedIcon} color={color} size={size}/>
    </div>
};

export const IconConfig: ComponentConfig<IconProps> = {
    fields: {
        size: { type: "number" },
        padding: paddingSettingsField,
        color: backgroundColorSettingField,
        icon: { type: "text" }
    },
    defaultProps: {
        size: 55,
        padding: "p-4",
        color: "#dc2626",
        icon: "landmark"
    },
    render: (props) => <Icon {...props} />,
}