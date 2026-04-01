"use client";

import { createContext, useContext } from "react";

type UnsavedChangesContextType = {
  confirmDiscardChanges: () => Promise<boolean>;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextType>({
  confirmDiscardChanges: async () => true,
});

export function useUnsavedChangesContext() {
  return useContext(UnsavedChangesContext);
}

export { UnsavedChangesContext };
