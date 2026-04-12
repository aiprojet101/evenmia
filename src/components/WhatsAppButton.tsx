"use client";

import { config } from "@/lib/config";
import { MessageCircle } from "lucide-react";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildDevisMessage(data: {
  eventType: string;
  date: string;
  guests: string;
  name: string;
  phone: string;
  formula: string;
  location: string;
  notes: string;
}): string {
  return `Bonjour Evenmia !

Je souhaite un devis pour :
- Événement : ${data.eventType}
- Formule : ${data.formula}
- Date souhaitee : ${data.date}
- Nombre d'invites : ${data.guests}
- Lieu : ${data.location}
- Nom : ${data.name}
- Telephone : ${data.phone}
${data.notes ? `- Notes : ${data.notes}` : ""}

Merci !`;
}

export default function WhatsAppButton() {
  const url = buildWhatsAppUrl("Bonjour ! Je souhaite organiser un événement et j'aimerais avoir plus d'informations.");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  );
}
