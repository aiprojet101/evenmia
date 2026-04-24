import Link from "next/link";
import { PartyPopper, Mail } from "lucide-react";

export default function FormationSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
      <div className="card-light p-10 max-w-lg text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--rose)] flex items-center justify-center shadow-xl">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--text)] mb-3">Bienvenue dans Wedding Pro 30 !</h1>
        <p className="text-[var(--text-light)] mb-6">
          Votre paiement est confirmé. Vous allez recevoir un email avec :
        </p>
        <ul className="text-left text-sm text-[var(--text-light)] space-y-2 mb-8 inline-block">
          <li>• Vos accès à la plateforme de formation</li>
          <li>• Le lien vers le groupe WhatsApp privé</li>
          <li>• Vos templates et bonus à télécharger</li>
          <li>• Le programme détaillé jour par jour</li>
        </ul>
        <p className="text-xs text-[var(--text-lighter)] mb-6 flex items-center justify-center gap-1">
          <Mail className="w-3 h-3" /> Vérifiez vos spams si l&apos;email tarde
        </p>
        <Link href="/" className="btn-rose inline-flex items-center gap-2">
          Retour au site
        </Link>
      </div>
    </div>
  );
}
