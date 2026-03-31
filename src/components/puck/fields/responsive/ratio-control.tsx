import { AutoField } from "@puckeditor/core";
import { Input } from "@/components/ui/input";
import { ratioPresets, type RatioPreset, type RatioValue } from "@/lib/puck/style-values";
import type { TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveFieldControlProps } from "./frame";

const inheritOption = { label: "–", value: "" } as const;

type RatioSelectValue = RatioPreset | "custom" | "none" | "";

const ratioOptions: TokenOption<Exclude<RatioSelectValue, "">>[] = [
  { label: "Auto", value: "none" },
  { label: "1:1", value: "square" },
  { label: "4:3", value: "photo" },
  { label: "3:2", value: "landscape" },
  { label: "16:9", value: "video" },
  { label: "21:9", value: "wide" },
  { label: "Custom", value: "custom" },
];

function toRatioSelectValue(value: RatioValue | undefined): RatioSelectValue {
  if (!value) {
    return "";
  }

  if (value.mode === "none") {
    return "none";
  }

  if (value.mode === "preset") {
    return value.preset;
  }

  return "custom";
}

export function ResponsiveRatioControl({
  isBase,
  value,
  onChange,
  readOnly,
}: ResponsiveFieldControlProps<RatioValue>) {
  const fieldOptions = isBase ? ratioOptions : [inheritOption, ...ratioOptions];
  const isInheriting = !isBase && value === undefined;

  return (
    <div className={isInheriting ? "opacity-40" : undefined}>
      <div className="flex flex-col gap-1">
        <AutoField
          field={{ type: "select", options: fieldOptions }}
          value={toRatioSelectValue(value)}
          onChange={(selected: RatioSelectValue) => {
            if (selected === "") {
              onChange(undefined);
              return;
            }

            if (selected === "none") {
              onChange({ mode: "none" });
              return;
            }

            if (selected === "custom") {
              onChange({ mode: "custom", width: 16, height: 9 });
              return;
            }

            onChange({ mode: "preset", preset: selected });
          }}
          readOnly={readOnly}
        />

        {value?.mode === "custom" ? (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
            <Input
              type="number"
              value={String(value.width)}
              readOnly={readOnly}
              onChange={(event) => {
                const nextValue = Number(event.currentTarget.value);
                if (Number.isNaN(nextValue) || nextValue <= 0) {
                  return;
                }

                onChange({
                  ...value,
                  width: nextValue,
                });
              }}
            />
            <span className="text-xs font-semibold text-muted-foreground">/</span>
            <Input
              type="number"
              value={String(value.height)}
              readOnly={readOnly}
              onChange={(event) => {
                const nextValue = Number(event.currentTarget.value);
                if (Number.isNaN(nextValue) || nextValue <= 0) {
                  return;
                }

                onChange({
                  ...value,
                  height: nextValue,
                });
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
