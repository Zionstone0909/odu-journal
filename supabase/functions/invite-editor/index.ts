/// <reference lib="deno.window" />
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin using their JWT
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await anonClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, full_name } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse name
    const nameParts = (full_name || "").trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    // Get the site URL from the request origin or use a fallback
    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || supabaseUrl;

    // Invite user via admin API - this sends an email with a link to set password
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        first_name,
        last_name,
        invited_as_editor: true,
      },
      redirectTo: `${origin}/reset-password`,
    });

    if (inviteError) {
      // If user already exists, return a specific message
      if (inviteError.message?.includes("already been registered") || inviteError.message?.includes("already exists")) {
        return new Response(JSON.stringify({ error: "This email is already registered. The user can log in or use 'Forgot Password'." }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw inviteError;
    }

    // Assign editor role to the newly invited user
    if (inviteData?.user?.id) {
      const { error: roleError } = await adminClient
        .from("user_roles")
        .insert({
          user_id: inviteData.user.id,
          role: "editor",
        });

      if (roleError) {
        console.error("Error assigning editor role:", roleError);
        // Don't fail completely, but log the error
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Invitation sent successfully" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("invite-editor error:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
