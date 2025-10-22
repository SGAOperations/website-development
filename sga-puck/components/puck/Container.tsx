import { SlotComponent } from "@measured/puck"

export interface ContainerProps {
    content: SlotComponent;
    padding?: string;
    gap?: string;
    outline?: string;
}

export const Container: React.FC<ContainerProps> = ({
    content: Content,
    padding,
    gap,
    outline,
}) => (
    <Content className={`flex flex-col w-full ${padding} ${gap} ${outline}`} />
)