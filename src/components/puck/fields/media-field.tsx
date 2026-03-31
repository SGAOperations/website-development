import type { CustomField } from "@puckeditor/core";
import { MediaFieldClient } from "./media-field-client";

export type ImageValue = { mediaId: number; url: string } | null;

export function mediaField(label: string): CustomField<ImageValue> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <MediaFieldClient
        label={label}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ),
  };
}
