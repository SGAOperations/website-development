import type { CustomField } from "@puckeditor/core";
import ColorSelector from "./color-selector-client";

export function colorField(label: string): CustomField<string> {
  return {
    type: "custom",
    render: ({value, onChange, readOnly }) => (
      <ColorSelector
      label={label}
      value={value ?? "#000000"}
      onChange={onChange}
      readOnly={readOnly}
      />
    ),
  };
}


/*
To implement colorField into an element (for instance, as a text color) -
in type <Element Name>Props:
textColor: string;

in defineProps:
textColor: field.raw(colorField("Color"), "#ff0000") (can be configured otherwise)

rather than adding color to className, use it as an inline style
<div style ={{color: textColor}} className={cn(...

*/