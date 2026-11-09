import type { CustomField } from "@puckeditor/core";
import { MediaFieldClient } from "./media-field-client";

export type MediaValue = { mediaId: number; url: string } | null;

export function mediaField(label: string): CustomField<MediaValue> {
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
