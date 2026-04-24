import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
      <div className="card-light p-10 max-w-md text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--sage)]/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[var(--sage)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-3">Paiement reçu !</h1>
        <p className="text-[var(--text-light)] mb-8">
          Votre acompte a bien été enregistré. Votre date est officiellement réservée. Je vous recontacte très vite pour les détails.
        </p>
        <Link href="/" className="btn-rose inline-flex items-center gap-2">
          Retour au site <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
