import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeConfigured } from "@/lib/stripe";

const OFFERS: Record<string, { price: number; name: string; description: string }> = {
  starter: { price: 297, name: "Wedding Pro 30 — STARTER", description: "Formation 30 jours + bonus 1-5" },
  pro: { price: 497, name: "Wedding Pro 30 — PRO", description: "Formation complète + 10 bonus + coaching 30 min" },
  vip: { price: 997, name: "Wedding Pro 30 — VIP", description: "Formation + 3 sessions coaching + audits + garantie 1er client" },
};

export async function POST(request: NextRequest) {
  if (!stripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }
  const { offerId, email } = await request.json();
  const offer = OFFERS[offerId];
  if (!offer) return NextResponse.json({ error: "Offre invalide" }, { status: 400 });

  const origin = request.headers.get("origin") || "https://evenmia.fr";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: offer.name,
            description: offer.description,
          },
          unit_amount: offer.price * 100,
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: `${origin}/formations/succes?session_id={CHECKOUT_SESSION_ID}&offer=${offerId}`,
    cancel_url: `${origin}/formations`,
    metadata: {
      type: "formation",
      offer: offerId,
    },
  });

  return NextResponse.json({ url: session.url });
}
