import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { updateReservation } from "@/lib/reservations";

// Crée une Stripe Checkout Session pour l'acompte d'une réservation existante.
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!stripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const { reservationId, amountEur, description, clientEmail } = await request.json();
  if (!reservationId || !amountEur) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const origin = request.headers.get("origin") || "https://evenmia.fr";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: description || "Acompte Evenmia",
            description: `Acompte pour la réservation ${reservationId}`,
          },
          unit_amount: Math.round(amountEur * 100),
        },
        quantity: 1,
      },
    ],
    customer_email: clientEmail,
    success_url: `${origin}/paiement/succes?session_id={CHECKOUT_SESSION_ID}&reservation=${reservationId}`,
    cancel_url: `${origin}/paiement/annule?reservation=${reservationId}`,
    metadata: {
      reservationId,
      type: "deposit",
    },
  });

  // Stocke l'ID de session sur la réservation
  await updateReservation(reservationId, { stripeSessionId: session.id });

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
