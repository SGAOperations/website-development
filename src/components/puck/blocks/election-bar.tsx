import type { ComponentConfig } from "@puckeditor/core";
import { defineProps, field } from "@/lib/puck/define-props";
import { margin, padding, textSize, type TokenValue } from "@/lib/puck/tokens";
import { cn } from "@/lib/utils";

type ElectionResultsProps = {
  yes: number;
  no: number;
  abstain: number;
  padding: TokenValue<typeof padding>;
  margin: TokenValue<typeof margin>;
  textSize: TokenValue<typeof textSize>;
};

const props = defineProps({
  yes: field.raw({ type: "number", label: "Yes Vote(s)", min: 0, step: 1 }, 1),
  no: field.raw({ type: "number", label: "No Vote(s)", min: 0, step: 1 }, 1),
  abstain: field.raw({ type: "number", label: "Abstain Vote(s)", min: 0, step: 1 }, 1),
  padding: field.select(padding, { label: "Padding", default: "none" }),
  margin: field.select(margin, { label: "Margin", default: "none" }),
  textSize: field.select(textSize, { label: "Text Size", default: "sm" }),
});

export const ElectionResultsComponent: ComponentConfig<ElectionResultsProps> = {
  label: "Election Results Bar",
  ...props,
  render: ({
    yes,
    no,
    abstain,
    padding: p = "none",
    margin: spacing = "none",
    textSize: size = "sm",
  }) => {
    const segments = [
      { label: "Yes", value: yes, color: "rgb(175, 248, 162)" },
      { label: "No", value: no, color: "rgb(235, 85, 40)" },
      { label: "Abstain", value: abstain, color: "rgb(234, 51, 35)" },
    ];
    const total = yes + no + abstain;
    const isValid = segments.every(({ value }) => Number.isSafeInteger(value) && value >= 0);
    const className = cn(padding.classes[p], margin.classes[spacing], textSize.classes[size]);

    if (!isValid) {
      return (
        <div className={className}>
          <p role="status">Enter whole numbers of votes, zero or greater.</p>
        </div>
      );
    }

    return (
      <div className={className}>
        <div
          role="img"
          aria-label={`Election results. Yes: ${yes}, No: ${no}, Abstain: ${abstain}`}
          className="flex h-10 w-full overflow-hidden"
        >
          {total > 0 &&
            segments.map(({ label, value, color }) => (
              <div
                key={label}
                aria-hidden="true"
                className="flex shrink-0 items-center overflow-hidden whitespace-nowrap text-black"
                style={{
                  width: `${(value / total) * 100}%`,
                  backgroundColor: color,
                }}
              >
                <span className="px-5">
                  {label} {value === 1 ? "Vote" : "Votes"}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  },
};
