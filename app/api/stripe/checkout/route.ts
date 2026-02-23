import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, {});
}

export type CheckoutPlan = "monthly" | "yearly" | "lifetime";

const PLANS: Record<
  CheckoutPlan,
  { amount: number; name: string; recurring?: { interval: "month" | "year" } }
> = {
  monthly: { amount: 490, name: "Pro Monthly", recurring: { interval: "month" } },
  yearly: { amount: 4900, name: "Pro Yearly", recurring: { interval: "year" } },
  lifetime: { amount: 9900, name: "Pro Lifetime" },
};

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }
  try {
    const stripe = getStripe();
    const body = await request.json();
    const plan = (body?.plan as CheckoutPlan) || "monthly";
    const config = PLANS[plan];
    if (!config) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const successUrl = `${origin}/pricing?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/pricing`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: config.recurring ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: config.name },
            unit_amount: config.amount,
            ...(config.recurring && { recurring: config.recurring }),
          },
          quantity: 1,
        },
      ],
      metadata: { plan },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url ?? null });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
