import { Field } from "@measured/puck";

export const booleanSettingsField: Field<boolean> = {
  type: "radio",
  options: [
    { label: "True", value: true },
    { label: "False", value: false },
  ]
} as const

export const gapSettingsField: Field<string> = {
  type: "select",
  options: [
    { label: "None", value: "gap-0" },
    { label: "Small (gap-2)", value: "gap-2" },
    { label: "Medium (gap-4)", value: "gap-4" },
    { label: "Large (gap-6)", value: "gap-6" },
    { label: "Extra Large (gap-8)", value: "gap-8" },
  ],
} as const;

export const heightSettingsField: Field<string> = {
  type: "select",
  options: [
    { label: "Auto", value: "h-auto" },
    { label: "Full", value: "h-full" },
  ],
} as const;

export const widthSettingsField: Field<string> = {
  type: "select",
  options: [
    { label: "Auto", value: "w-auto" },
    { label: "Full", value: "w-full" },
  ],
} as const;

export const paddingSettingsField: Field<string> = {
  type: "select",
  options: [
    { label: "None", value: "p-0" },
    { label: "Small (p-2)", value: "p-2" },
    { label: "Medium (p-4)", value: "p-4" },
    { label: "Large (p-6)", value: "p-6" },
    { label: "Extra Large (p-8)", value: "p-8" },
    { label: "2XL (p-10)", value: "p-10" },
    { label: "3XL (p-12)", value: "p-12" },
  ]
} as const;

export const outlineSettingsField: Field<string> = {
  type: "select",
  options: [
    { label: "None", value: "" },
    { label: "Thin", value: "border border-1" },
    { label: "Normal", value: "border border-2" },
    { label: "Thick", value: "border border-4" },
  ]
} as const;