import "server-only";
import { createClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as {
  supabase?: ReturnType<typeof createClient>;
};

export const supabase =
  globalForSupabase.supabase ??
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase;
}

export const MEDIA_BUCKET = "media";
