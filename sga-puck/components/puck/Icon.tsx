import { Field, ComponentConfig } from "@puckeditor/core";
import React from "react";
import { IconName, DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';
import { paddingSettingsField } from '../../lib/settings-fields';

export type IconProps = {
    backgroundColor?: string;
    padding?: string;
    icon?: IconName;
};

export const Icon: React.FC<IconProps> = ({
    backgroundColor = "bg-sga-red",
    padding = "p-4",
    icon = "landmark"
}) => {
    const resolvedIcon = !(icon in dynamicIconImports)? "landmark" : icon

    return <div className={`flex ${padding} align-items-center justify-items-center`}>
    <div className={`${backgroundColor} rounded-full p-4  w-24 h-24`}>
         <DynamicIcon name={resolvedIcon} color="white" size={55}/>
    </div>
    </div>
};

export const IconConfig: ComponentConfig<IconProps> = {
    fields: {
        backgroundColor: {
            type: "select",
            options: [
                { label: "Red", value: "bg-sga-red" },
                { label: "Black", value: "bg-black" },
            ]
        },
        padding: paddingSettingsField,
        icon: { type: "text" }
    },
    defaultProps: {
        backgroundColor: "bg-sga-red",
        padding: "p-4",
        icon: "landmark"
    },
    render: (props) => <Icon {...props} />,
}