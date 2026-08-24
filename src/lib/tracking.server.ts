import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type DB = SupabaseClient<Database>;

/**
 * Ensures the caller is an admin. Bootstraps the very first signed-in user as
 * admin when no admin exists yet (so the owner can claim the dashboard once).
 */
export async function requireAdmin(supabase: DB, userId: string) {
  const { data: mine } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (mine) return;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");

  if ((count ?? 0) === 0) {
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (!error) return;
  }

  throw new Error("Forbidden: admin access required");
}

export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return base || "link";
}

export function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}
