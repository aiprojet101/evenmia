"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from "lucide-react";

type AvailMap = Record<string, "free" | "partial" | "full" | "blocked">;

export default function DisponibilitesPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailMap>({});
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthName = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/availability?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailability(data.availability || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, month]);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7;

  const days: ({ date: string; day: number } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ date, day: d });
  }

  function changeMonth(delta: number) {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + delta);
    setCurrentDate(d);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="bg-white border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--text)] transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <span className="text-rose-gradient font-bold">Evenmia</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Mes disponibilités</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
            Trouvez votre <span className="text-rose-gradient">date</span>
          </h1>
          <p className="text-[var(--text-light)] max-w-lg mx-auto">
            Vérifiez en un coup d&apos;œil si je suis disponible. Les dates en vert sont libres.
          </p>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs text-[var(--text-light)]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--sage)]" /> Disponible</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--gold)]" /> Quelques créneaux</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--rose-dark)]" /> Complet</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-400" /> Indisponible</span>
        </div>

        {/* Calendrier */}
        <div className="card-light p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="w-10 h-10 rounded-full hover:bg-[var(--warm)] flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text)] capitalize">{monthName}</h2>
            <button onClick={() => changeMonth(1)} className="w-10 h-10 rounded-full hover:bg-[var(--warm)] flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-[var(--text-lighter)] mb-2 font-medium">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const status = availability[d.date] || "free";
              const isPast = d.date < today;
              let bgClass = "bg-[var(--sage)]/15 text-[var(--text)]";
              if (status === "partial") bgClass = "bg-[var(--gold)]/20 text-[var(--text)]";
              else if (status === "full") bgClass = "bg-[var(--rose-dark)]/20 text-[var(--rose-dark)]";
              else if (status === "blocked") bgClass = "bg-gray-200 text-gray-400";
              if (isPast) bgClass = "bg-gray-50 text-gray-300";
              return (
                <motion.div
                  key={d.date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: d.day * 0.005 }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${bgClass}`}
                >
                  {d.day}
                </motion.div>
              );
            })}
          </div>

          {loading && <p className="text-center text-xs text-[var(--text-lighter)] mt-4">Chargement...</p>}
        </div>

        {/* CTA */}
        <div className="mt-10 card-light p-8 text-center bg-gradient-to-br from-[var(--gold-light)]/10 to-[var(--rose)]/5">
          <Sparkles className="w-10 h-10 text-[var(--rose)] mx-auto mb-3" />
          <h3 className="text-xl font-bold text-[var(--text)] mb-2">Votre date est disponible ?</h3>
          <p className="text-sm text-[var(--text-light)] mb-5">
            Demandez votre devis gratuit dès maintenant — je vous recontacte sous 24h.
          </p>
          <Link href="/" className="btn-rose inline-flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Demander un devis
          </Link>
        </div>
      </div>
    </div>
  );
}
