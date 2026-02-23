import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
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

  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email },
      { onConflict: "id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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

  return NextResponse.json({ ok: true });
}
