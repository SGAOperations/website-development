import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  href,
  external,
  actions,
}: {
  preview: ReactNode;
  name: string;
  date: string | null;
  href?: string;
  external?: boolean;
  actions?: ReactNode;
}) {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const previewContent = (
    <div className="flex h-24 items-center justify-center bg-muted">
      {preview}
    </div>
  );

  const nameContent = (
    <span className="truncate text-xs font-medium" title={name}>
      {name}
    </span>
  );

  return (
    <Card className="h-48 w-32 shrink-0 gap-0 py-0">
      {href ? (
        <Link href={href} className="block" {...linkProps}>
          {previewContent}
        </Link>
      ) : (
        previewContent
      )}

      <CardContent className="flex flex-1 flex-col px-2 py-2">
        {href ? (
          <Link
            href={href}
            className="truncate text-xs font-medium hover:underline"
            title={name}
            {...linkProps}
          >
            {name}
          </Link>
        ) : (
          nameContent
        )}
        <span className="text-xs text-muted-foreground">
          {date ?? "\u00A0"}
        </span>

        {actions && (
          <CardFooter className="mt-auto gap-1 border-t-0 bg-transparent p-0">
            {actions}
          </CardFooter>
        )}
      </CardContent>
    </Card>
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
    <Card
      className={cn(
        "h-48 w-32 shrink-0 cursor-pointer gap-0 border-dashed py-0 text-center transition-colors hover:bg-muted/50 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-60",
      )}
      role="button"
      tabIndex={0}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <span className="text-3xl leading-none">+</span>
        <span className="mt-2 text-sm font-medium">
          {disabled ? loadingLabel : label}
        </span>
        {children}
      </div>
    </Card>
  );
}
