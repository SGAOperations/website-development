import { ComponentConfig, SlotComponent } from "@measured/puck"
import { booleanSettingsField } from "../../lib/settings-fields";

export interface RootContainerProps {
    content: SlotComponent;
    padTop?: boolean;
    padBottom?: boolean;
}

export const RootContainer: React.FC<RootContainerProps> = ({
    content: Content,
    padTop = false,
    padBottom = false,
}) => {
    const paddingStyles = "px-[clamp(1rem,4vw,4rem)] " +
        (padTop ? "pt-[clamp(1rem,4vw,4rem)] " : "") +
        (padBottom ? "pb-[clamp(1rem,4vw,4rem)] " : "")

    return (
        <div className={`w-full ${paddingStyles}`}>
            <Content className="max-w-7xl mx-auto" />
        </div>
    )

}

export const RootContainerConfig: ComponentConfig<RootContainerProps> = {
    fields: {
        content: { type: "slot" },
        padTop: booleanSettingsField,
        padBottom: booleanSettingsField,
    },
    defaultProps: {
        content: null,
        padTop: false,
        padBottom: false,
    },
    render: (props) => {
        return <RootContainer {...props} />;
    }
}