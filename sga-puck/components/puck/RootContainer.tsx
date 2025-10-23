import { SlotComponent } from "@measured/puck"

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