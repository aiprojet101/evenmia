import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
      <div className="card-light p-10 max-w-md text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-3">Paiement annulé</h1>
        <p className="text-[var(--text-light)] mb-8">
          Aucun montant n&apos;a été prélevé. Vous pouvez réessayer ou me contacter directement.
        </p>
        <Link href="/" className="btn-rose inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour au site
        </Link>
      </div>
    </div>
  );
}
