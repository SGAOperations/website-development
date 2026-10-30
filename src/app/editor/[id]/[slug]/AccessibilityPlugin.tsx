"use client";

import { useMemo } from "react";
import { createUsePuck, type Plugin } from "@puckeditor/core";
import { Accessibility, CircleCheck, OctagonX, TriangleAlert } from "lucide-react";
import { checkAccessibility, ROOT_ISSUE_ID, type A11yIssue } from "@/lib/puck/a11y-check";
import { cn } from "@/lib/utils";
import { useBlockActions } from "./block-actions";

const usePuck = createUsePuck();

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function IssueItem({ issue, onSelect, label }: { issue: A11yIssue; onSelect: () => void; label: string }) {
  const isError = issue.severity === "error";
  const Icon = isError ? OctagonX : TriangleAlert;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full cursor-pointer items-start gap-2 rounded-md border border-border bg-background p-2 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <Icon className={cn("mt-0.5 size-4 shrink-0", isError ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400")} />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs font-semibold">
            {/* Severity is spelled out, not only shown by icon color (WCAG 1.4.1). */}
            {isError ? "Error" : "Warning"} · {label}
          </span>
          <span>{issue.message}</span>
          <span className="text-xs text-muted-foreground">WCAG {issue.criterion}</span>
        </span>
      </button>
    </li>
  );
}

function AccessibilityPanel() {
  const data = usePuck((s) => s.appState.data);
  const issues = useMemo(() => checkAccessibility(data), [data]);
  const { select, labelFor } = useBlockActions();
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.length - errors;

  return (
    <section aria-labelledby="a11y-panel-title" className="flex flex-col gap-3 p-4 text-sm">
      <h2 id="a11y-panel-title" className="text-xs font-semibold text-muted-foreground">
        Accessibility check
      </h2>

      <p role="status" className="flex items-center gap-2">
        {issues.length === 0 ? (
          <>
            <CircleCheck className="size-4 text-green-700 dark:text-green-400" />
            No problems found.
          </>
        ) : (
          `${pluralize(errors, "error")}, ${pluralize(warnings, "warning")}. Choose one to select its block.`
        )}
      </p>

      {issues.length > 0 && (
        <ul className="flex flex-col gap-2">
          {issues.map((issue, index) => (
            <IssueItem
              key={`${issue.id}-${index}`}
              issue={issue}
              label={issue.id === ROOT_ISSUE_ID ? "Page" : labelFor(issue.type)}
              onSelect={() => select(issue.id)}
            />
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Automatic checks catch common problems only. Also check headings read in order, links make sense out of
        context, and videos have captions.
      </p>
    </section>
  );
}

export const AccessibilityPlugin: Plugin = {
  name: "a11y-plugin",
  label: "Checks",
  icon: <Accessibility />,
  render: AccessibilityPanel,
};
