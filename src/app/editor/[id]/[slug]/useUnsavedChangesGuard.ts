"use client";

import { useCallback, useEffect } from "react";
import { useDialogs } from "@/components/ui/dialog-provider";

const LEAVE_MESSAGE = "You have unsaved changes. Leave this page without saving?";

export function useUnsavedChangesGuard(isDirty: boolean) {
  const { confirm } = useDialogs();

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

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Needed for Chrome version <=119 to show the confirmation dialog
      event.returnValue = true;
    };

    const handleHistoryNavigate = (event: NavigateEvent) => {
      if (event.navigationType !== "traverse" || !event.cancelable || event.hashChange) {
        return;
      }

      const destination = new URL(event.destination.url);

      if (destination.origin !== window.location.origin) {
        return;
      }

      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.navigation?.addEventListener("navigate", handleHistoryNavigate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.navigation?.removeEventListener("navigate", handleHistoryNavigate);
    };
  }, [isDirty]);

  return {
    confirmDiscardChanges,
  };
}
