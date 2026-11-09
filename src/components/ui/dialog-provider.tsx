"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useDialogPromise } from "./use-dialog-promise";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useId, useRef, useState } from "react";

type PromptInput = {
  title: string;
  description?: string;
  label?: string;
  defaultValue?: string;
  /** Keep the dialog open with an inline error instead of accepting an empty value. */
  required?: boolean;
};

type ConfirmInput = {
  message: string;
  actionLabel?: string;
  destructive?: boolean;
};

type DialogContextValue = {
  alert: (message: string) => Promise<void>;
  confirm: (input: ConfirmInput) => Promise<boolean>;
  prompt: (input: PromptInput) => Promise<string | null>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function PromptDialogContent({
  title,
  description,
  label,
  defaultValue,
  required,
  onResolve,
}: PromptInput & {
  onResolve: (value: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const value = inputRef.current?.value ?? "";
          if (required && !value.trim()) {
            // Name the problem next to the field and keep focus there (WCAG 3.3.1, 3.3.3).
            setError(`Enter a ${label ? label.toLowerCase() : "value"}.`);
            inputRef.current?.focus();
            return;
          }
          onResolve(value);
        }}
      >
        <div className="grid gap-2">
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          <Input
            id={inputId}
            ref={inputRef}
            aria-label={label ? undefined : title}
            defaultValue={defaultValue}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={() => setError(null)}
            autoFocus
          />
          {error && (
            <p id={errorId} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onResolve(null)}>
            Cancel
          </Button>
          <Button type="submit">OK</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [alertDialog, alert] = useDialogPromise<string, void>((message, resolve) => (
    <AlertDialog open onOpenChange={() => resolve()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => resolve()}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ));

  const [confirmDialog, confirm] = useDialogPromise<ConfirmInput, boolean>(({ message, actionLabel, destructive }, resolve) => (
    <AlertDialog open onOpenChange={() => resolve(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => resolve(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            onClick={() => resolve(true)}
          >
            {actionLabel ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ));

  const [promptDialog, prompt] = useDialogPromise<PromptInput, string | null>((input, resolve, key) => (
    <Dialog open onOpenChange={() => resolve(null)}>
      <PromptDialogContent
        key={key}
        {...input}
        onResolve={resolve}
      />
    </Dialog>
  ));

  return (
    <DialogContext value={{ alert, confirm, prompt }}>
      {children}
      {alertDialog}
      {confirmDialog}
      {promptDialog}
    </DialogContext>
  );
}

export function useDialogs() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialogs must be used within a DialogProvider");
  }
  return ctx;
}
