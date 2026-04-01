"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDialogs } from "@/components/ui/dialog-provider";

const LEAVE_MESSAGE = "You have unsaved changes. Leave this page without saving?";

// Next.js internally sets an auto-incrementing `idx` on history.state to track
// navigation position. This is an undocumented internal — not a public API — so
// it may disappear or change in any Next.js release. We use it to determine
// whether the user navigated forward or back so we can revert the navigation
// when they cancel. If `idx` is absent we degrade gracefully (warn, but can't
// revert). See: https://github.com/vercel/next.js/discussions/34980
function getCurrentHistoryIndex() {
  const historyState = window.history.state as { idx?: number } | null;
  return typeof historyState?.idx === "number" ? historyState.idx : null;
}

export function useUnsavedChangesGuard(isDirty: boolean) {
  const { confirm } = useDialogs();
  const historyIndexRef = useRef<number | null>(null);
  const isRevertingNavigationRef = useRef(false);

  const confirmDiscardChanges = useCallback(async () => {
    if (!isDirty) {
      return true;
    }

    return await confirm({
      message: LEAVE_MESSAGE,
      actionLabel: "Leave",
      destructive: true,
    });
  }, [confirm, isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    historyIndexRef.current = getCurrentHistoryIndex();
    isRevertingNavigationRef.current = false;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Needed for Chrome version <=119 to show the confirmation dialog
      event.returnValue = true;
    };

    const handlePopState = () => {
      const nextHistoryIndex = getCurrentHistoryIndex();

      if (!isRevertingNavigationRef.current) {
        const shouldLeave = window.confirm(LEAVE_MESSAGE);

        if (!shouldLeave) {
          if (
            historyIndexRef.current !== null &&
            nextHistoryIndex !== null &&
            historyIndexRef.current !== nextHistoryIndex
          ) {
            isRevertingNavigationRef.current = true;
            window.history.go(historyIndexRef.current > nextHistoryIndex ? 1 : -1);
            return;
          }

          console.warn("Unable to determine history direction for unsaved-changes guard");
        }
      }

      isRevertingNavigationRef.current = false;
      historyIndexRef.current = nextHistoryIndex;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      isRevertingNavigationRef.current = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  return {
    confirmDiscardChanges,
  };
}
