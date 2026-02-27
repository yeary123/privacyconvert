import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/me — Returns current user's Pro status from server (source of truth).
 * Runs sync first so any pending PayPal purchase is merged into profile.
 * Profile page should use this so Pro users always see correct status.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user?.id || !user.email) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Sync: ensure profile exists and merge any pending PayPal Pro purchase
  await supabaseAdmin
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email },
      { onConflict: "id" }
    );

  const email = user.email.trim().toLowerCase();
  const { data: pending } = await supabaseAdmin
    .from("paypal_pro_purchases")
    .select("paypal_order_id, captured_at")
    .eq("email", email)
    .order("captured_at", { ascending: false })
    .limit(1)
    .single();

  if (pending) {
    await supabaseAdmin.from("profiles").update({
      is_pro: true,
      pro_since: pending.captured_at,
      paypal_order_id: pending.paypal_order_id,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    await supabaseAdmin.from("paypal_pro_purchases").delete().eq("email", email);
  }

  // Read profile with admin (bypasses RLS) so we always get the real is_pro
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("is_pro, email")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    isPro: !!profile?.is_pro,
    email: profile?.email ?? user.email,
  });
}
