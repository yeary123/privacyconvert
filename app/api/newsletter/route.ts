import { NextRequest, NextResponse } from "next/server";

/**
 * Newsletter signup. Placeholder: set CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID
 * or BUTTONDOWN_API_KEY to forward to ConvertKit or Buttondown.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const convertKitKey = process.env.CONVERTKIT_API_KEY;
    const convertKitFormId = process.env.CONVERTKIT_FORM_ID;
    const buttondownKey = process.env.BUTTONDOWN_API_KEY;

    if (convertKitKey && convertKitFormId) {
      const res = await fetch(`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: convertKitKey, email }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("ConvertKit subscribe error:", err);
        return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }

    if (buttondownKey) {
      const res = await fetch("https://api.buttondown.com/v1/subscribers", {
        method: "POST",
        headers: {
          Authorization: `Token ${buttondownKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("Buttondown subscribe error:", err);
        return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }

    // No provider configured: accept and respond success (for testing / placeholder)
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
