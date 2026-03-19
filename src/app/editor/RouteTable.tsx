"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, SquarePen, Trash2, X } from "lucide-react";
import {
  createRouteAction,
  updateRouteAction,
  deleteRouteAction,
} from "../../lib/actions";
import { useRunAction } from "./useRunAction";

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

  function handleSubmit() {
    const path = inputRef.current?.value.trim();
    if (path) {
      onSubmit(path, documentId);
    }
  }

  return (
    <tr className="border-t">
      <td className="py-1">
        <input
          ref={inputRef}
          defaultValue={defaultPath}
          placeholder="/path"
          autoFocus
          className="font-mono border rounded px-1 py-0.5 w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onCancel();
          }}
        />
      </td>
      <td className="py-1">
        <select
          value={documentId}
          onChange={(e) => setDocumentId(parseInt(e.target.value, 10))}
          disabled={isPending}
          className="border rounded px-1 py-0.5"
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
            className="text-gray-400 hover:text-green-600 disabled:opacity-60"
            title="Save"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="text-gray-400 hover:text-red-600 disabled:opacity-60"
            title="Cancel"
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
          href={`/editor/${route.documentId}`}
          className="text-blue-500 hover:underline"
        >
          {route.documentName}
        </Link>
      </td>
      <td className="py-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-60"
            title="Edit route"
          >
            <SquarePen size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(route)}
            disabled={isPending}
            className="text-gray-400 hover:text-red-600 disabled:opacity-60"
            title="Delete route"
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
  const [isPending, run] = useRunAction();
  const [creating, setCreating] = useState(false);
  const [routes, setRoutes] = useState(initialRoutes);

  async function handleCreate(path: string, documentId: number) {
    setCreating(false);
    const result = await run(createRouteAction({ path, documentId }));
    if (result.success) {
      const docName = documents.find((d) => d.id === documentId)?.name ?? "";
      setRoutes((prev) => [...prev, { id: result.data.routeId, path, documentId, documentName: docName }]);
    }
  }

  async function handleUpdate(id: number, path: string, documentId: number) {
    const result = await run(updateRouteAction({ id, path, documentId }));
    if (result.success) {
      const docName = documents.find((d) => d.id === documentId)?.name ?? "";
      setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, path, documentId, documentName: docName } : r)));
    }
  }

  async function handleDelete(route: RouteRow) {
    if (!window.confirm(`Delete route "${route.path}"?`)) return;
    const result = await run(deleteRouteAction({ id: route.id }));
    if (result.success) {
      setRoutes((prev) => prev.filter((r) => r.id !== route.id));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Routes</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          disabled={isPending || creating}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? "Working..." : "+ New Route"}
        </button>
      </div>

      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="text-left">Path</th>
            <th className="text-left">Document</th>
            <th className="text-left w-12">Actions</th>
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
              onCancel={() => setCreating(false)}
            />
          )}
          {routes.length === 0 && !creating && (
            <tr>
              <td colSpan={3} className="py-4 text-center text-gray-500">
                No routes yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
