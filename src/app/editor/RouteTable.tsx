"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, SquarePen, Trash2, X } from "lucide-react";
import {
  createRouteAction,
  updateRouteAction,
  deleteRouteAction,
} from "../../lib/routes/actions";
import { getEditorUrl } from "../../lib/editor-url";
import { assertValidRoutePath } from "../../lib/routes/utils";
import { runAction } from "./runAction";
import { useDialogs } from "@/components/ui/dialog-provider";
import { cn } from "@/lib/utils";

// 24px targets (WCAG 2.5.8); muted-foreground keeps the icons above 3:1 in every theme (WCAG 1.4.11).
const iconButtonClassName = "inline-flex size-6 items-center justify-center rounded text-muted-foreground disabled:opacity-60";

type RouteRow = {
  id: number;
  path: string;
  documentId: number;
  documentName: string;
};

type DocumentOption = {
  id: number;
  name: string;
};

function EditableRouteRow({
  defaultPath,
  defaultDocumentId,
  documents,
  isPending,
  onSubmit,
  onCancel,
}: {
  defaultPath?: string;
  defaultDocumentId: number;
  documents: DocumentOption[];
  isPending: boolean;
  onSubmit: (path: string, documentId: number) => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [documentId, setDocumentId] = useState(defaultDocumentId);
  const [error, setError] = useState<string | null>(null);
  const hintId = useId();
  const errorId = useId();

  function handleSubmit() {
    const path = inputRef.current?.value.trim() ?? "";
    // Same rules the server enforces, shown next to the field instead of in a dialog (WCAG 3.3.1).
    try {
      assertValidRoutePath(path);
    } catch (e) {
      setError((e as Error).message);
      inputRef.current?.focus();
      return;
    }
    onSubmit(path, documentId);
  }

  return (
    <tr className="border-t">
      <td className="py-1">
        <input
          ref={inputRef}
          defaultValue={defaultPath}
          placeholder="/path"
          aria-label="Route path"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${errorId} ${hintId}` : hintId}
          autoFocus
          className="font-mono border border-input bg-background rounded px-1 py-0.5 w-full aria-invalid:border-red-700 dark:aria-invalid:border-red-400"
          onChange={() => setError(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onCancel();
          }}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          Lowercase letters, numbers, - and _, starting with /. For example /about-us.
        </p>
      </td>
      <td className="py-1">
        <select
          value={documentId}
          onChange={(e) => setDocumentId(parseInt(e.target.value, 10))}
          disabled={isPending}
          aria-label="Document"
          className="border border-input bg-background rounded px-1 py-0.5"
        >
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </td>
      <td className="py-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className={cn(iconButtonClassName, "hover:text-green-700 dark:hover:text-green-400")}
            title="Save"
            aria-label="Save route"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className={cn(iconButtonClassName, "hover:text-red-600 dark:hover:text-red-400")}
            title="Cancel"
            aria-label="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function RouteRowComponent({
  route,
  documents,
  isPending,
  onUpdate,
  onDelete,
}: {
  route: RouteRow;
  documents: DocumentOption[];
  isPending: boolean;
  onUpdate: (id: number, path: string, documentId: number) => void;
  onDelete: (route: RouteRow) => void;
}) {
  const [editing, setEditing] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);

  // Return focus to the Edit button when the row leaves edit mode (WCAG 2.4.3).
  useEffect(() => {
    if (wasEditing.current && !editing) editButtonRef.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  if (editing) {
    return (
      <EditableRouteRow
        defaultPath={route.path}
        defaultDocumentId={route.documentId}
        documents={documents}
        isPending={isPending}
        onSubmit={(path, documentId) => {
          if (path !== route.path || documentId !== route.documentId) {
            onUpdate(route.id, path, documentId);
          }
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <tr className="border-t">
      <td className="py-1">
        <span className="font-mono">{route.path}</span>
      </td>
      <td className="py-1">
        <Link
          href={getEditorUrl(route.documentId, route.documentName)}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {route.documentName}
        </Link>
      </td>
      <td className="py-1">
        <div className="flex items-center gap-1">
          <button
            ref={editButtonRef}
            type="button"
            onClick={() => setEditing(true)}
            disabled={isPending}
            className={cn(iconButtonClassName, "hover:text-foreground")}
            title="Edit route"
            aria-label={`Edit route ${route.path}`}
          >
            <SquarePen size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(route)}
            disabled={isPending}
            className={cn(iconButtonClassName, "hover:text-red-600 dark:hover:text-red-400")}
            title="Delete route"
            aria-label={`Delete route ${route.path}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function RouteTable({
  routes: initialRoutes,
  documents,
}: {
  routes: RouteRow[];
  documents: DocumentOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [creating, setCreating] = useState(false);
  const [routes, setRoutes] = useState(initialRoutes);
  const { confirm, alert } = useDialogs();
  const newRouteRef = useRef<HTMLButtonElement>(null);

  const focusHeading = () => document.getElementById("routes-heading")?.focus();

  function cancelCreate() {
    setCreating(false);
    requestAnimationFrame(() => newRouteRef.current?.focus());
  }

  function handleCreate(path: string, documentId: number) {
    setCreating(false);
    startTransition(async () => {
      const result = await runAction(createRouteAction({ path, documentId }));
      if (result.success) {
        const doc = documents.find((d) => d.id === documentId)!;
        setRoutes((prev) => [...prev, { id: result.data.routeId, path, documentId, documentName: doc.name }]);
        toast.success(`Created route ${path}`);
        focusHeading();
      } else {
        await alert(result.error);
      }
    });
  }

  function handleUpdate(id: number, path: string, documentId: number) {
    startTransition(async () => {
      const result = await runAction(updateRouteAction({ id, path, documentId }));
      if (result.success) {
        const doc = documents.find((d) => d.id === documentId)!;
        setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, path, documentId, documentName: doc.name } : r)));
        toast.success(`Updated route ${path}`);
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleDelete(route: RouteRow) {
    if (!await confirm({ message: `Delete route "${route.path}"?`, actionLabel: "Delete", destructive: true })) return;
    startTransition(async () => {
      const result = await runAction(deleteRouteAction({ id: route.id }));
      if (result.success) {
        setRoutes((prev) => prev.filter((r) => r.id !== route.id));
        toast.success(`Deleted route ${route.path}`);
        focusHeading();
      } else {
        await alert(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="routes-heading" tabIndex={-1} className="text-2xl font-bold">Routes</h2>
        <button
          ref={newRouteRef}
          type="button"
          onClick={() => setCreating(true)}
          disabled={isPending || creating}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Working..." : <><span aria-hidden="true">+ </span>New Route</>}
        </button>
      </div>

      <div className="overflow-x-auto">
      <table aria-labelledby="routes-heading" className="border-collapse w-full">
        <thead>
          <tr>
            <th scope="col" className="text-left">Path</th>
            <th scope="col" className="text-left">Document</th>
            <th scope="col" className="text-left w-16">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <RouteRowComponent
              key={route.id}
              route={route}
              documents={documents}
              isPending={isPending}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
          {creating && (
            <EditableRouteRow
              defaultDocumentId={documents[0]?.id}
              documents={documents}
              isPending={isPending}
              onSubmit={handleCreate}
              onCancel={cancelCreate}
            />
          )}
          {routes.length === 0 && !creating && (
            <tr>
              <td colSpan={3} className="py-4 text-center text-muted-foreground">
                No routes yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
