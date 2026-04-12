import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { config } from "@/lib/config";

export const metadata = {
  title: `Conditions générales — ${config.brand}`,
  description: `Conditions générales de vente et de prestation ${config.brand}`,
};

export default function CGV() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="bg-white border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--text)] transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <span className="text-rose-gradient font-bold">{config.brand}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8 text-[var(--text)]">Conditions générales de vente</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-[var(--text-light)]">
          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 1 — Objet</h2>
            <p>
              Les présentes conditions générales régissent les prestations d'organisation d'événements proposées par {config.brand}, micro-entreprise basée a {config.city} ({config.postalCode}).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 2 — Prestations</h2>
            <p>
              {config.brand} propose des services d'organisation, coordination et décoration d'événements privés et professionnels : mariages, fiançailles, anniversaires, baptêmes, baby showers, séminaires d'entreprise et tout autre événement sur-mesure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 3 — Devis et commande</h2>
            <p>
              Toute prestation fait l'objet d'un devis personnalisé gratuit. Le devis est valable 30 jours à compter de sa date d'émission. La commande est considérée comme ferme et définitive après signature du devis et versement de l'acompte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 4 — Tarifs et paiement</h2>
            <p>
              Les prix sont indiqués en euros TTC (TVA non applicable, art. 293 B du CGI). Un acompte de 30% du montant total est exigé à la commande. Le solde est dû au plus tard 7 jours avant la date de l'événement. Les frais de déplacement sont facturés à {config.pricePerKm}€/km au-delà de {config.freeKmRadius} km depuis {config.city}.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 5 — Annulation</h2>
            <p>
              En cas d'annulation par le client :<br />
              — Plus de 60 jours avant l'événement : remboursement de l'acompte moins 10% de frais de dossier.<br />
              — Entre 30 et 60 jours : l'acompte est conservé.<br />
              — Moins de 30 jours : la totalité du montant est due.<br />
              En cas de force majeure, les parties conviennent de trouver un accord amiable (report de date, avoir).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 6 — Responsabilité</h2>
            <p>
              {config.brand} s'engage à mettre en oeuvre tous les moyens nécessaires à la bonne exécution de la prestation. La responsabilité de {config.brand} est limitée au montant de la prestation. {config.brand} ne saurait être tenue responsable des défaillances de prestataires tiers (traiteur, lieu, etc.) qu'elle a sélectionnés sur indication du client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 7 — Droit à l'image</h2>
            <p>
              Sauf mention contraire écrite du client, {config.brand} se réserve le droit d'utiliser les photos de l'événement à des fins de promotion (portfolio, réseaux sociaux, site internet), en respectant la vie privée des participants.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 8 — Litiges</h2>
            <p>
              En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, le tribunal compétent sera celui de Boulogne-sur-Mer.
            </p>
          </section>

          <p className="text-xs text-[var(--text-lighter)] pt-4">
            Dernière mise a jour : avril 2026
          </p>
        </div>
      </div>
    </div>
  );
}
