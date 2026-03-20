import { useState, useRef, useCallback, type ReactNode } from "react";

export function useDialogPromise<TInput, TResult>(
  renderDialog: (input: TInput, resolve: (value: TResult) => void, key: number) => ReactNode
) {
  const [state, setState] = useState<{ input: TInput; key: number } | null>(null);
  const resolveRef = useRef<((value: TResult) => void) | null>(null);
  const keyRef = useRef(0);

  const trigger = useCallback((input: TInput): Promise<TResult> => {
    return new Promise<TResult>((resolve) => {
      resolveRef.current = resolve;
      keyRef.current += 1;
      setState({ input, key: keyRef.current });
    });
  }, []);

  const handleResolve = useCallback((value: TResult) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setState(null);
  }, []);

  const dialog = state ? renderDialog(state.input, handleResolve, state.key) : null;

  return [dialog, trigger] as const;
}
