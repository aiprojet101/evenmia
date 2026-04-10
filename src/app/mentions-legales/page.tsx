import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { config } from "@/lib/config";

export const metadata = {
  title: `Mentions legales — ${config.brand}`,
  description: `Mentions legales du site ${config.domain}`,
};

export default function MentionsLegales() {
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
        <h1 className="text-3xl font-bold mb-8 text-[var(--text)]">Mentions legales</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-[var(--text-light)]">
          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Editeur du site</h2>
            <p>
              {config.brand}<br />
              Micro-entreprise<br />
              {config.city}, {config.postalCode} — {config.department}<br />
              Email : <a href={`mailto:${config.email}`} className="text-[var(--rose)] hover:underline">{config.email}</a><br />
              Telephone : <a href={`tel:${config.phoneIntl}`} className="text-[var(--rose)] hover:underline">{config.phone}</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Hebergement</h2>
            <p>
              Vercel Inc.<br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723, USA<br />
              <a href="https://vercel.com" className="text-[var(--rose)] hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Propriete intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, logo, mise en page) est la propriete exclusive d'{config.brand} ou de ses partenaires. Toute reproduction, meme partielle, est interdite sans autorisation prealable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Donnees personnelles</h2>
            <p>
              Les informations collectees via le formulaire de devis sont utilisees uniquement pour traiter votre demande. Elles ne sont ni vendues, ni partagees avec des tiers. Conformement au RGPD, vous pouvez exercer vos droits d'acces, de rectification et de suppression en nous contactant a <a href={`mailto:${config.email}`} className="text-[var(--rose)] hover:underline">{config.email}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text)]">Cookies</h2>
            <p>
              Ce site utilise uniquement des cookies techniques necessaires a son bon fonctionnement. Aucun cookie publicitaire ou de suivi n'est utilise.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
