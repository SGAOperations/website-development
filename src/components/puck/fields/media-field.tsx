"use client";

import { useState } from "react";
import { FieldLabel, type CustomField } from "@puckeditor/core";
import { ImageIcon, X } from "lucide-react";
import { useMedia } from "@/components/puck/media-context";
import { MediaPickerDialog } from "./media-picker-dialog";

function MediaFieldRender({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { getMedia, getUrl } = useMedia();
  const url = value !== null ? getUrl(value) : undefined;
  const name = value !== null ? getMedia(value)?.name : undefined;

  return (
    <FieldLabel label={label} el="div" readOnly={readOnly}>
      <div className="flex items-stretch overflow-hidden rounded-[4px] border border-[var(--puck-color-grey-09)]">
        <div className="flex w-10 shrink-0 items-center justify-center overflow-hidden bg-muted">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" />
          )}
        </div>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center px-3 py-3 text-left transition hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => setOpen(true)}
          disabled={readOnly}
        >
          <span className="truncate text-sm text-muted-foreground" title={name}>
            {name ?? "Choose image…"}
          </span>
        </button>

        {value !== null && (
          <button
            type="button"
            className="flex items-center border-l px-2 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            onClick={() => onChange(null)}
            disabled={readOnly}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <MediaPickerDialog
        open={open}
        onSelect={(media) => {
          onChange(media.id);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </FieldLabel>
  );
}

export function mediaField(label: string): CustomField<number | null> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <MediaFieldRender
        label={label}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ),
  };
}
