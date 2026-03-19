import { useState } from "react";
import type { ActionResult } from "../../lib/types";

export function useRunAction() {
  const [isPending, setIsPending] = useState(false);

  async function run<T>(action: Promise<ActionResult<T>>): Promise<ActionResult<T>> {
    setIsPending(true);
    try {
      const result = await action;
      if (!result.success) {
        alert(result.error);
      }
      return result;
    } catch {
      alert("Something went wrong. Please try again.");
      return { success: false, error: "Transport error" } as ActionResult<T>;
    } finally {
      setIsPending(false);
    }
  }

  return [isPending, run] as const;
}
