"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function DevisRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";

  useEffect(() => {
    // Redirect to home with devis popup open
    const params = type ? `?devis=1&type=${type}` : "?devis=1";
    router.replace(`/${params}`);
  }, [router, type]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--rose)]/10 flex items-center justify-center animate-pulse">
          <svg className="w-5 h-5 text-[var(--rose)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-[var(--text-light)]">Ouverture du questionnaire...</p>
      </div>
    </div>
  );
}

export default function DevisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--cream)]" />}>
      <DevisRedirect />
    </Suspense>
  );
}
