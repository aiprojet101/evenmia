import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { updateReservation } from "@/lib/reservations";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  if (!stripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Signature invalide: ${err instanceof Error ? err.message : "?"}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationId = session.metadata?.reservationId;
    const type = session.metadata?.type;

    if (type === "deposit" && reservationId) {
      await updateReservation(reservationId, {
        status: "confirmed",
        paidAt: new Date().toISOString(),
      });

      // Notification Telegram
      const tgToken = process.env.TELEGRAM_BOT_TOKEN;
      const tgChat = process.env.TELEGRAM_CHAT_ID;
      if (tgToken && tgChat) {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChat,
            text: `Acompte payé !\n\nRéservation : ${reservationId}\nMontant : ${(session.amount_total || 0) / 100}€\nClient : ${session.customer_email || "?"}`,
          }),
        }).catch(() => {});
      }
    }

    if (type === "formation") {
      const tgToken = process.env.TELEGRAM_BOT_TOKEN;
      const tgChat = process.env.TELEGRAM_CHAT_ID;
      if (tgToken && tgChat) {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChat,
            text: `NOUVEL INSCRIT FORMATION !\n\nOffre : ${session.metadata?.offer || "?"}\nMontant : ${(session.amount_total || 0) / 100}€\nClient : ${session.customer_email || "?"}`,
          }),
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}
