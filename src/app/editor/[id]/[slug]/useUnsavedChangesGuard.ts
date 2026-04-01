"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDialogs } from "@/components/ui/dialog-provider";

export type ConfirmDiscardChangesOptions = {
  message?: string;
  actionLabel?: string;
  destructive?: boolean;
};

const DEFAULT_LEAVE_MESSAGE = "You have unsaved changes. Leave this page without saving?";
const DEFAULT_LEAVE_ACTION_LABEL = "Leave";

export function useUnsavedChangesGuard(isDirty: boolean) {
  const { confirm } = useDialogs();
  const isHistoryGuardActiveRef = useRef(false);
  const skipNextPopStateRef = useRef(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const clearUnsavedChangesGuard = useCallback(() => {
    if (!isHistoryGuardActiveRef.current) {
      return Promise.resolve();
    }

    isHistoryGuardActiveRef.current = false;

    return new Promise<void>((resolve) => {
      pendingNavigationRef.current = resolve;
      skipNextPopStateRef.current = true;
      window.history.back();
    });
  }, []);

  const confirmDiscardChanges = useCallback(async (options: ConfirmDiscardChangesOptions = {}) => {
    if (!isDirty) {
      return true;
    }

    const shouldLeave = await confirm({
      message: options.message ?? DEFAULT_LEAVE_MESSAGE,
      actionLabel: options.actionLabel ?? DEFAULT_LEAVE_ACTION_LABEL,
      destructive: options.destructive ?? true,
    });

    if (!shouldLeave) {
      return false;
    }

    await clearUnsavedChangesGuard();
    return true;
  }, [clearUnsavedChangesGuard, confirm, isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Needed for Chrome version <=119 to show the confirmation dialog
      event.returnValue = true;
    };

    const handlePopState = () => {
      if (skipNextPopStateRef.current) {
        skipNextPopStateRef.current = false;
        pendingNavigationRef.current?.();
        pendingNavigationRef.current = null;
        return;
      }

      if (!isHistoryGuardActiveRef.current) {
        return;
      }

      const shouldLeave = window.confirm(DEFAULT_LEAVE_MESSAGE);

      if (!shouldLeave) {
        window.history.pushState(window.history.state, "", window.location.href);
        isHistoryGuardActiveRef.current = true;
        return;
      }

      isHistoryGuardActiveRef.current = false;
      skipNextPopStateRef.current = true;
      window.history.back();
    };

    if (!isHistoryGuardActiveRef.current) {
      window.history.pushState(window.history.state, "", window.location.href);
      isHistoryGuardActiveRef.current = true;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      isHistoryGuardActiveRef.current = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  return {
    clearUnsavedChangesGuard,
    confirmDiscardChanges,
  };
}
