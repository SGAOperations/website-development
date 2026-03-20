import type { ReactNode } from "react";

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const seconds = Math.floor((now - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  const months = Math.floor(days / 30);
  if (days < 365) return `${months} ${months === 1 ? "mo" : "mos"} ago`;
  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "yr" : "yrs"} ago`;
}

export function ResourceCard({
  preview,
  name,
  date,
  actions,
}: {
  preview: ReactNode;
  name: string;
  date: string | null;
  actions?: ReactNode;
}) {
  return (
    <div className="flex h-48 w-32 shrink-0 flex-col rounded-lg bg-gray-100 overflow-hidden">
      <div className="flex h-24 items-center justify-center bg-gray-200">
        {preview}
      </div>

      <div className="flex flex-1 flex-col p-2">
        <span className="truncate text-xs font-medium" title={name}>
          {name}
        </span>
        <span className="text-xs text-gray-500">
          {date ?? "\u00A0"}
        </span>

        {actions && (
          <div className="mt-auto flex gap-1">{actions}</div>
        )}
      </div>
    </div>
  );
}

export function NewResourceCard({
  label,
  loadingLabel,
  disabled,
  onClick,
  children,
}: {
  label: string;
  loadingLabel: string;
  disabled: boolean;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-48 w-32 shrink-0 cursor-pointer rounded-lg flex-col items-center justify-center border border-dashed border-gray-400 bg-white p-4 text-center text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="text-3xl leading-none">+</span>
      <span className="mt-2 text-sm font-medium">
        {disabled ? loadingLabel : label}
      </span>
      {children}
    </button>
  );
}

export function ActionButton({
  onClick,
  disabled,
  title,
  variant = "default",
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  title: string;
  variant?: "default" | "danger";
  children: ReactNode;
}) {
  const hoverColor = variant === "danger" ? "hover:text-red-600" : "hover:text-blue-600";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded p-1 text-gray-500 ${hoverColor} disabled:opacity-50`}
      title={title}
    >
      {children}
    </button>
  );
}
