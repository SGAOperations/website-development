"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDialogs } from "@/components/ui/dialog-provider";

const LEAVE_MESSAGE = "You have unsaved changes. Leave this page without saving?";

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

    const shouldLeave = await confirm({
      message: LEAVE_MESSAGE,
      actionLabel: "Leave",
      destructive: true,
    });

    if (!shouldLeave) {
      return false;
    }

    return true;
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
