import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { config } from "@/lib/config";

export const metadata = {
  title: `Conditions generales — ${config.brand}`,
  description: `Conditions generales de vente et de prestation ${config.brand}`,
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
        <h1 className="text-3xl font-bold mb-8 text-[var(--text)]">Conditions generales de vente</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-[var(--text-light)]">
          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 1 — Objet</h2>
            <p>
              Les presentes conditions generales regissent les prestations d'organisation d'evenements proposees par {config.brand}, micro-entreprise basee a {config.city} ({config.postalCode}).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 2 — Prestations</h2>
            <p>
              {config.brand} propose des services d'organisation, coordination et decoration d'evenements prives et professionnels : mariages, fiancailles, anniversaires, baptemes, baby showers, seminaires d'entreprise et tout autre evenement sur-mesure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 3 — Devis et commande</h2>
            <p>
              Toute prestation fait l'objet d'un devis personnalise gratuit. Le devis est valable 30 jours a compter de sa date d'emission. La commande est consideree comme ferme et definitive apres signature du devis et versement de l'acompte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 4 — Tarifs et paiement</h2>
            <p>
              Les prix sont indiques en euros TTC (TVA non applicable, art. 293 B du CGI). Un acompte de 30% du montant total est exige a la commande. Le solde est du au plus tard 7 jours avant la date de l'evenement. Les frais de deplacement sont factures a {config.pricePerKm}€/km au-dela de {config.freeKmRadius} km depuis {config.city}.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 5 — Annulation</h2>
            <p>
              En cas d'annulation par le client :<br />
              — Plus de 60 jours avant l'evenement : remboursement de l'acompte moins 10% de frais de dossier.<br />
              — Entre 30 et 60 jours : l'acompte est conserve.<br />
              — Moins de 30 jours : la totalite du montant est due.<br />
              En cas de force majeure, les parties conviennent de trouver un accord amiable (report de date, avoir).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 6 — Responsabilite</h2>
            <p>
              {config.brand} s'engage a mettre en oeuvre tous les moyens necessaires a la bonne execution de la prestation. La responsabilite de {config.brand} est limitee au montant de la prestation. {config.brand} ne saurait etre tenue responsable des defaillances de prestataires tiers (traiteur, lieu, etc.) qu'elle a selectionnes sur indication du client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 7 — Droit a l'image</h2>
            <p>
              Sauf mention contraire ecrite du client, {config.brand} se reserve le droit d'utiliser les photos de l'evenement a des fins de promotion (portfolio, reseaux sociaux, site internet), en respectant la vie privee des participants.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Article 8 — Litiges</h2>
            <p>
              En cas de litige, les parties s'engagent a rechercher une solution amiable. A defaut, le tribunal competent sera celui de Boulogne-sur-Mer.
            </p>
          </section>

          <p className="text-xs text-[var(--text-lighter)] pt-4">
            Derniere mise a jour : avril 2026
          </p>
        </div>
      </div>
    </div>
  );
}
