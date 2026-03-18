import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ActionResult } from "../../lib/types";

export function useRunAction() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(action: Promise<ActionResult<unknown>>) {
    startTransition(async () => {
      const result = await action;
      if (!result.success) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return [isPending, run] as const;
}
