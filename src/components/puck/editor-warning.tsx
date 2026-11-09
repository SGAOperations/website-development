import { TriangleAlert } from "lucide-react";

/**
 * Accessibility hint drawn on the editor canvas only (render it behind `puck.isEditing`).
 * Shows a short `label` in the corner so it covers little of the block; screen readers hear the full message.
 * The parent must be positioned.
 */
export function EditorWarning({ label, children }: { label: string; children: string }) {
  return (
    <div
      role="note"
      className="pointer-events-none absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900 shadow-sm"
    >
      <TriangleAlert className="size-3.5" />
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{children}</span>
    </div>
  );
}
