import type { ActionResult } from "../../lib/types";

export async function runAction<T>(action: Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await action;
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
