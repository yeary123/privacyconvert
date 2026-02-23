import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PAYPAL_BASE = process.env.PAYPAL_SANDBOX === "true" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) throw new Error("PayPal not configured");
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${auth}` },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description ?? "PayPal token failed");
  return data.access_token;
}

async function verifyWebhook(
  headers: Headers,
  body: Record<string, unknown>
): Promise<boolean> {
  if (!PAYPAL_WEBHOOK_ID) return false;
  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo");
  const transmissionSig = headers.get("paypal-transmission-sig");
  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) return false;
  try {
    const token = await getPayPalAccessToken();
    const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      }),
    });
    const verifyData = await verifyRes.json();
    return verifyData.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = body.event_type as string | undefined;
  if (eventType !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ received: true });
  }

  if (PAYPAL_WEBHOOK_ID && !(await verifyWebhook(request.headers, body))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const resource = body.resource as Record<string, unknown> | undefined;
  const payer = resource?.payer as Record<string, unknown> | undefined;
  const payerEmail = (payer?.email_address as string)?.trim()?.toLowerCase();
  const orderId = (resource?.id as string) ?? (body.id as string) ?? "";

  if (!payerEmail) {
    return NextResponse.json({ error: "Missing payer email" }, { status: 400 });
  }

  const now = new Date().toISOString();

  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", payerEmail)
    .limit(1)
    .single();

  if (existing?.id) {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        is_pro: true,
        pro_since: now,
        paypal_order_id: orderId,
        updated_at: now,
      })
      .eq("id", existing.id);
    if (error) {
      console.error("PayPal webhook update profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabaseAdmin.from("paypal_pro_purchases").insert({
    email: payerEmail,
    paypal_order_id: orderId,
    captured_at: now,
  });
  if (error) {
    console.error("PayPal webhook insert pending:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
