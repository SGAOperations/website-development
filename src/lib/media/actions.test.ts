import { vi } from "vitest";

// Runs before any imports: load .env so prisma/supabase see their variables.
vi.hoisted(() => {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      // file doesn't exist, skip it
    }
  }
});

// Replace the "server-only" guard with nothing, for this test file only.
vi.mock("server-only", () => ({}));
import { describe, it, expect, afterEach } from "vitest";
import { supabase, MEDIA_BUCKET } from "../supabase";
import { prisma } from "../prisma";
import { uploadMediaAction, renameMediaAction, deleteMediaAction } from "./actions";

const createdIds: number[] = [];
const unique = () => `t${Date.now()}${Math.floor(Math.random() * 1000)}`;

/** Uploads a tiny real file (storage object + DB row) and tracks it for cleanup. */
async function createTestMedia() {
  const fd = new FormData();
  fd.append("file", new File(["hello"], "test.webp", { type: "image/webp" }));
  const result = await uploadMediaAction(fd);
  if (!result.success) throw new Error(result.error);
  createdIds.push(result.data.id);
  return result.data;
}

async function existsInStorage(path: string) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).download(path);
  return !error;
}

afterEach(async () => {
  // deleteMediaAction reads the CURRENT storagePath, so this works after renames too
  for (const id of createdIds.splice(0)) {
    await deleteMediaAction({ id });
  }
});

describe("renameMediaAction", () => {
  it("renames only the display name without moving the file", async () => {
    const m = await createTestMedia();
    const result = await renameMediaAction({ id: m.id, name: "New label" });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBe("New label");
    expect(result.data.storagePath).toBe(m.storagePath);
    expect(await existsInStorage(m.storagePath)).toBe(true);
  });

  it("moves the file in storage and updates storagePath", async () => {
    const m = await createTestMedia();
    const newBase = unique();
    const result = await renameMediaAction({ id: m.id, fileName: newBase });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.storagePath).toBe(`${newBase}.webp`); // extension preserved
    expect(result.data.url).toContain(`${newBase}.webp`);
    expect(await existsInStorage(`${newBase}.webp`)).toBe(true);
    expect(await existsInStorage(m.storagePath)).toBe(false); // old one is gone

    const row = await prisma.media.findUniqueOrThrow({ where: { id: m.id } });
    expect(row.storagePath).toBe(`${newBase}.webp`);
  });

  it("updates both name and file name at once", async () => {
    const m = await createTestMedia();
    const newBase = unique();
    const result = await renameMediaAction({ id: m.id, name: "Both", fileName: newBase });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBe("Both");
    expect(result.data.storagePath).toBe(`${newBase}.webp`);
  });

  it("normalizes the file name (spaces and uppercase)", async () => {
    const m = await createTestMedia();
    const base = unique();
    const result = await renameMediaAction({ id: m.id, fileName: `  ${base.toUpperCase()} Photo ` });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.storagePath).toBe(`${base}-photo.webp`);
  });

  it("rejects a name that collides with an existing file", async () => {
    const a = await createTestMedia();
    const b = await createTestMedia();
    const base = unique();

    expect((await renameMediaAction({ id: a.id, fileName: base })).success).toBe(true);
    const second = await renameMediaAction({ id: b.id, fileName: base });

    expect(second.success).toBe(false);
    // b must be untouched
    const row = await prisma.media.findUniqueOrThrow({ where: { id: b.id } });
    expect(row.storagePath).toBe(b.storagePath);
    expect(await existsInStorage(b.storagePath)).toBe(true);
  });

  it("rejects invalid file names and moves nothing", async () => {
    const m = await createTestMedia();
    for (const bad of ["my/photo", "", "..", ".hidden", "what?"]) {
      const result = await renameMediaAction({ id: m.id, fileName: bad });
      expect(result.success).toBe(false);
    }
    const row = await prisma.media.findUniqueOrThrow({ where: { id: m.id } });
    expect(row.storagePath).toBe(m.storagePath);
  });
});