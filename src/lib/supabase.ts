import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./env";

const globalForSupabase = globalThis as unknown as {
  supabase?: ReturnType<typeof createClient>;
};

export const supabase =
  globalForSupabase.supabase ??
  createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY")
  );

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase;
}

export const MEDIA_BUCKET = "media";

export function getMediaUrl(storagePath: string): string {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath).data
    .publicUrl;
}
