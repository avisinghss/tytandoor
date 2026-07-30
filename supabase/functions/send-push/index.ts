import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PushPayload = {
  title?: string;
  body?: string;
  targetTab?: string;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  try {
    const payload = (await request.json()) as PushPayload;
    const publicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const privateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!publicKey || !privateKey || !supabaseUrl || !serviceRoleKey) {
      throw new Error("Push notification secrets are not configured.");
    }

    webpush.setVapidDetails("mailto:admin@tytandoor.com", publicKey, privateKey);
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: subscriptions, error } = await admin
      .from("push_subscriptions")
      .select("id, subscription");

    if (error) throw error;

    const message = JSON.stringify({
      title: payload.title || "New Tytan update",
      body: payload.body || "You have a new customer request.",
      targetTab: payload.targetTab || "enquiries",
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      url: "/admintytandoor",
    });

    const results = await Promise.allSettled(
      (subscriptions || []).map(async ({ id, subscription }) => {
        try {
          await webpush.sendNotification(subscription, message);
          return true;
        } catch (error) {
          const statusCode = (error as { statusCode?: number }).statusCode;
          // Expired or revoked subscriptions should not be retried forever.
          if (statusCode === 404 || statusCode === 410) {
            await admin.from("push_subscriptions").delete().eq("id", id);
          }
          throw error;
        }
      }),
    );

    const sent = results.filter((result) => result.status === "fulfilled").length;
    return Response.json({ sent }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("send-push failed", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to send push notification" },
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
