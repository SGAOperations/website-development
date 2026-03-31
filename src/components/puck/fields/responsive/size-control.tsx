import { AutoField } from "@puckeditor/core";
import { Input } from "@/components/ui/input";
import {
  sizeUnits,
  type SizeMode,
  type SizeUnit,
  type SizeValue,
} from "@/lib/puck/style-values";
import type { TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveFieldControlProps } from "./frame";
import type { ResponsiveSizeFieldDescriptor } from "./kinds";

const inheritOption = { label: "–", value: "" } as const;

type ModeSelectValue = SizeMode | "";

function getModeOptions(
  descriptor: ResponsiveSizeFieldDescriptor<string>,
): TokenOption<SizeMode>[] {
  const options: TokenOption<SizeMode>[] = [{ label: "Unset", value: "none" }];

  if (descriptor.allowAuto !== false) {
    options.push({ label: "Auto", value: "auto" });
  }

  options.push({ label: "Full", value: "full" });

  if (descriptor.allowFit !== false) {
    options.push({ label: "Fit content", value: "fit" });
  }

  if (descriptor.presets && descriptor.presets.length > 0) {
    options.push({ label: "Preset", value: "preset" });
  }

  options.push({ label: "Custom", value: "custom" });

  return options;
}

function getUnitOptions(units: SizeUnit[]): TokenOption<SizeUnit>[] {
  return units.map((unit) => ({ label: unit, value: unit }));
}

function createSizeValueForMode(
  mode: SizeMode,
  descriptor: ResponsiveSizeFieldDescriptor<string>,
): SizeValue<string> {
  switch (mode) {
    case "none":
      return { mode: "none" };
    case "auto":
      return { mode: "auto" };
    case "full":
      return { mode: "full" };
    case "fit":
      return { mode: "fit" };
    case "preset":
      return {
        mode: "preset",
        preset: descriptor.presets?.[0]?.value ?? "",
      };
    case "custom":
      return {
        mode: "custom",
        value: 100,
        unit: descriptor.units?.[0] ?? "px",
      };
  }
}

function toModeSelectValue(value: SizeValue<string> | undefined): ModeSelectValue {
  return value?.mode ?? "";
}

export function ResponsiveSizeControl({
  isBase,
  value,
  onChange,
  readOnly,
  descriptor,
}: ResponsiveFieldControlProps<SizeValue<string>> & {
  descriptor: ResponsiveSizeFieldDescriptor<string>;
}) {
  const modeOptions = getModeOptions(descriptor);
  const unitOptions = getUnitOptions(descriptor.units ?? [...sizeUnits]);
  const fieldOptions = isBase ? modeOptions : [inheritOption, ...modeOptions];
  const isInheriting = !isBase && value === undefined;

  return (
    <div className={isInheriting ? "opacity-40" : undefined}>
      <div className="flex flex-col gap-1">
        <AutoField
          field={{ type: "select", options: fieldOptions }}
          value={toModeSelectValue(value)}
          onChange={(selected: ModeSelectValue) => {
            if (selected === "") {
              onChange(undefined);
              return;
            }

            onChange(createSizeValueForMode(selected, descriptor));
          }}
          readOnly={readOnly}
        />

        {value?.mode === "preset" && descriptor.presets && descriptor.presets.length > 0 ? (
          <AutoField
            field={{ type: "select", options: descriptor.presets }}
            value={value.preset}
            onChange={(preset: string) => {
              onChange({ mode: "preset", preset });
            }}
            readOnly={readOnly}
          />
        ) : null}

        {value?.mode === "custom" ? (
          <div className="grid grid-cols-[1fr_auto] gap-1">
            <Input
              type="number"
              value={String(value.value)}
              readOnly={readOnly}
              onChange={(event) => {
                const nextValue = Number(event.currentTarget.value);
                if (Number.isNaN(nextValue)) {
                  return;
                }

                onChange({
                  ...value,
                  value: nextValue,
                });
              }}
            />
            <AutoField
              field={{ type: "select", options: unitOptions }}
              value={value.unit}
              onChange={(unit: SizeUnit) => {
                onChange({
                  ...value,
                  unit,
                });
              }}
              readOnly={readOnly}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
