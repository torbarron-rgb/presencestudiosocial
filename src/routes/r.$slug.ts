import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/r/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: link } = await supabaseAdmin
          .from("tracked_links")
          .select("id, destination_url, is_active")
          .eq("slug", params.slug)
          .maybeSingle();

        if (!link || !link.is_active) {
          return new Response(null, { status: 302, headers: { location: "/" } });
        }

        await supabaseAdmin.from("link_clicks").insert({
          link_id: link.id,
          referrer: request.headers.get("referer"),
          user_agent: request.headers.get("user-agent"),
          country: request.headers.get("cf-ipcountry"),
        });

        return new Response(null, {
          status: 302,
          headers: { location: link.destination_url, "cache-control": "no-store" },
        });
      },
    },
  },
});
