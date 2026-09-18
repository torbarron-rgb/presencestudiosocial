import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdmin, slugify, randomSuffix } from "./tracking.server";

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);

    const [linksRes, clicksRes, salesRes] = await Promise.all([
      context.supabase.from("tracked_links").select("*").order("created_at", { ascending: false }),
      context.supabase.from("link_clicks").select("id, link_id, created_at"),
      context.supabase.from("sales").select("*").order("occurred_on", { ascending: false }),
    ]);

    if (linksRes.error) throw linksRes.error;
    if (clicksRes.error) throw clicksRes.error;
    if (salesRes.error) throw salesRes.error;

    return {
      links: linksRes.data ?? [],
      clicks: clicksRes.data ?? [],
      sales: salesRes.data ?? [],
    };
  });

export const createLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        business_name: z.string().min(1),
        product_name: z.string().optional(),
        destination_url: z.string().url(),
        commission_rate: z.number().min(0).max(100).default(0),
        notes: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const slug = `${slugify(data.product_name || data.business_name)}-${randomSuffix()}`;
    const { data: row, error } = await context.supabase
      .from("tracked_links")
      .insert({
        slug,
        business_name: data.business_name,
        product_name: data.product_name || null,
        destination_url: data.destination_url,
        commission_rate: data.commission_rate,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const setLinkActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("tracked_links")
      .update({ is_active: data.is_active })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("tracked_links").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const addSale = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        link_id: z.string().uuid(),
        amount: z.number().min(0),
        commission: z.number().min(0),
        customer_name: z.string().optional(),
        note: z.string().optional(),
        status: z.enum(["pending", "confirmed", "paid"]).default("pending"),
        occurred_on: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("sales")
      .insert({
        link_id: data.link_id,
        amount: data.amount,
        commission: data.commission,
        customer_name: data.customer_name || null,
        note: data.note || null,
        status: data.status,
        occurred_on: data.occurred_on,
      })
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const updateSaleStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending", "confirmed", "paid"]) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("sales")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteSale = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("sales").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
