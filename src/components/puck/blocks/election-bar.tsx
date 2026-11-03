import type { ComponentConfig } from "@puckeditor/core";
import { defineProps, field } from "@/lib/puck/define-props";
import {padding, type Spacing} from "@/lib/puck/tokens"

type ElectionResultsProps = {
    yes: number;
    no: number;
    abstain: number;
    padding: Spacing;
}

const props = defineProps({
    yes: field.raw({ type: "number", label: "Yes", min: 0, max: 100}, 33),
    no: field.raw({ type: "number", label: "No", min: 0, max: 100}, 33), 
    abstain: field.raw({ type: "number", label: "Abstain", min: 0, max: 100}, 34), 
    padding: field.select(padding, {label: "Padding", default: "none", }),
})

export const ElectionResultsComponent : ComponentConfig<ElectionResultsProps> = {
    label: "Election Results Bar",
    ...props,
    render: ({yes, no, abstain, padding: p}) => {
        const segments = [
            {label: "Yes", value: yes, color: "rgb(175, 248, 162)"},
            {label: "No", value: no, color: "rgb(235, 85, 40)"},
            {label: "Abstain", value: abstain, color: "rgb(234, 51, 35)"},
        ];
        const total = yes + no + abstain;
        let isValid = true;
        for (const segment of segments) {
            if (!Number.isFinite(segment.value) || segment.value < 0 || segment.value > 100){
            isValid = false;
            }
        }
        if (Math.abs(total - 100) > 1e-10) {
            isValid = false;
        }
        if (!isValid) {
            return (
                <div className={padding.classes[p]}>
                <p role="status">
                    Enter percentages between 0 and 100 that total 100%.
                </p>
                </div>
            );
        }

        return (
      <div className={padding.classes[p]}>
        <div
          role="img"
          aria-label={`Election results: Yes ${yes}%, No ${no}%, Abstain ${abstain}%`}
          className="flex h-10 w-full overflow-hidden"
        >
          {segments.map(({ label, value, color }) => (
            <div
                key={label}
                aria-hidden="true"
                className="flex shrink-0 items-center overflow-hidden whitespace-nowrap text-sm p-5 text-black"
                style={{
                width: `${value}%`,
                backgroundColor: color,
                }}
            >
                {`${label}`}
            </div>
            ))}
        </div>
      </div>
    );
    }





}
