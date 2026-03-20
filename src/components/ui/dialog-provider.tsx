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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

type PromptInput = {
  title: string;
  defaultValue?: string;
};

type ConfirmInput = {
  message: string;
  actionLabel?: string;
};

type DialogContextValue = {
  alert: (message: string) => Promise<void>;
  confirm: (input: ConfirmInput) => Promise<boolean>;
  prompt: (input: PromptInput) => Promise<string | null>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function PromptDialogContent({
  title,
  defaultValue,
  onResolve,
}: {
  title: string;
  defaultValue?: string;
  onResolve: (value: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onResolve(inputRef.current?.value ?? "");
        }}
      >
        <Input
          ref={inputRef}
          defaultValue={defaultValue}
          autoFocus
        />
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

  const [confirmDialog, confirm] = useDialogPromise<ConfirmInput, boolean>(({ message, actionLabel }, resolve) => (
    <AlertDialog open onOpenChange={() => resolve(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => resolve(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => resolve(true)}>
            {actionLabel ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ));

  const [promptDialog, prompt] = useDialogPromise<PromptInput, string | null>(({ title, defaultValue }, resolve, key) => (
    <Dialog open onOpenChange={() => resolve(null)}>
      <PromptDialogContent
        key={key}
        title={title}
        defaultValue={defaultValue}
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
