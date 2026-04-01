"use client";

import { createContext, useContext } from "react";

type UnsavedChangesContextType = {
  confirmDiscardChanges: () => Promise<boolean>;
  clearUnsavedChangesGuard: () => Promise<void>;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextType>({
  confirmDiscardChanges: async () => true,
  clearUnsavedChangesGuard: async () => {},
});

export function useUnsavedChangesContext() {
  return useContext(UnsavedChangesContext);
}

export { UnsavedChangesContext };
