"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Plus, X, LogOut, Calendar as CalendarIcon,
  Users, Mail, Phone, MapPin, Clock, Trash2, Lock, Unlock, Loader2, Check,
  CreditCard, AlertCircle,
} from "lucide-react";
import type { Reservation, BlockedDate } from "@/lib/reservations";

interface Props {
  initialReservations: Reservation[];
  initialBlocked: BlockedDate[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-orange-100 text-orange-800" },
  confirmed: { label: "Confirmé", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulé", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Terminé", color: "bg-blue-100 text-blue-800" },
};

const TIME_SLOTS: Record<string, string> = {
  matin: "Matin (8h-12h)",
  midi: "Midi (12h-16h)",
  soir: "Soir (16h-22h)",
  journee: "Journée complète",
};

export default function AdminDashboard({ initialReservations, initialBlocked }: Props) {
  const router = useRouter();
  const [reservations, setReservations] = useState(initialReservations);
  const [blocked, setBlocked] = useState(initialBlocked);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);

  // Calendrier mensuel
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Lundi = 0

  const monthName = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // Index reservations par date
  const resByDate = useMemo(() => {
    const map: Record<string, Reservation[]> = {};
    for (const r of reservations) {
      if (r.status === "cancelled") continue;
      if (!map[r.eventDate]) map[r.eventDate] = [];
      map[r.eventDate].push(r);
    }
    return map;
  }, [reservations]);

  const blockedByDate = useMemo(() => {
    const map: Record<string, BlockedDate> = {};
    for (const b of blocked) map[b.date] = b;
    return map;
  }, [blocked]);

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

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  async function toggleBlock(date: string) {
    const existing = blockedByDate[date];
    if (existing) {
      await fetch("/api/admin/blocked-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: existing.id }),
      });
      setBlocked(blocked.filter((b) => b.id !== existing.id));
    } else {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, reason: "Indisponible" }),
      });
      const data = await res.json();
      setBlocked([...blocked, data.blocked]);
    }
  }

  async function updateStatus(id: string, status: Reservation["status"]) {
    const res = await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { status } }),
    });
    const data = await res.json();
    setReservations(reservations.map((r) => (r.id === id ? data.reservation : r)));
  }

  async function deleteReservation(id: string) {
    if (!confirm("Supprimer cette réservation ?")) return;
    await fetch("/api/admin/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setReservations(reservations.filter((r) => r.id !== id));
  }

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    revenue: reservations
      .filter((r) => r.status === "confirmed" || r.status === "completed")
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0),
  };

  const selectedDayReservations = selectedDate ? resByDate[selectedDate] || [] : [];
  const isSelectedBlocked = selectedDate ? !!blockedByDate[selectedDate] : false;

  return (
    <div className="min-h-screen bg-[var(--cream)] py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard Evenmia</h1>
            <p className="text-sm text-[var(--text-light)]">Espace privé d&apos;Anaïs</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="text-sm text-[var(--text-light)] hover:text-[var(--rose)] transition px-4 py-2">
              Voir le site
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-[var(--text-light)] hover:text-red-500 transition px-4 py-2"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Réservations", value: stats.total, icon: CalendarIcon },
          { label: "Confirmées", value: stats.confirmed, icon: Check },
          { label: "En attente", value: stats.pending, icon: AlertCircle },
          { label: "Chiffre d'affaires", value: `${stats.revenue}€`, icon: CreditCard },
        ].map((s) => (
          <div key={s.label} className="card-light p-4">
            <div className="flex items-center gap-2 text-[var(--text-light)] text-xs mb-1">
              <s.icon className="w-4 h-4" /> {s.label}
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-2 card-light p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="w-9 h-9 rounded-full hover:bg-[var(--warm)] flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-bold text-[var(--text)] capitalize">{monthName}</h2>
            <button onClick={() => changeMonth(1)} className="w-9 h-9 rounded-full hover:bg-[var(--warm)] flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-3 text-xs mb-3 text-[var(--text-lighter)]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--sage)]" /> Libre</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--gold)]" /> Partiel</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--rose-dark)]" /> Complet</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Bloqué</span>
          </div>

          {/* Grille jours */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--text-lighter)] mb-2">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const reservationsThisDay = resByDate[d.date] || [];
              const blockedThisDay = blockedByDate[d.date];
              let bgClass = "bg-[var(--sage)]/10 hover:bg-[var(--sage)]/20";
              if (blockedThisDay) bgClass = "bg-gray-200 hover:bg-gray-300";
              else if (reservationsThisDay.length >= 3) bgClass = "bg-[var(--rose-dark)]/20 hover:bg-[var(--rose-dark)]/30";
              else if (reservationsThisDay.length > 0) bgClass = "bg-[var(--gold)]/20 hover:bg-[var(--gold)]/30";
              const isSelected = selectedDate === d.date;
              return (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date === selectedDate ? null : d.date)}
                  className={`aspect-square rounded-lg p-1 text-sm transition relative ${bgClass} ${
                    isSelected ? "ring-2 ring-[var(--rose)]" : ""
                  }`}
                >
                  <span className={`block text-center ${blockedThisDay ? "line-through text-gray-400" : "text-[var(--text)]"}`}>
                    {d.day}
                  </span>
                  {reservationsThisDay.length > 0 && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[var(--rose-dark)]">
                      {reservationsThisDay.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Détail jour sélectionné */}
        <div className="card-light p-6">
          {!selectedDate ? (
            <div className="text-center py-12 text-[var(--text-lighter)]">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Sélectionnez un jour pour voir les détails</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--text)]">
                  {new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </h3>
                <button
                  onClick={() => toggleBlock(selectedDate)}
                  className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition ${
                    isSelectedBlocked
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-[var(--rose)]/10 text-[var(--rose-dark)] hover:bg-[var(--rose)]/20"
                  }`}
                >
                  {isSelectedBlocked ? <><Unlock className="w-3 h-3" /> Débloquer</> : <><Lock className="w-3 h-3" /> Bloquer</>}
                </button>
              </div>

              {selectedDayReservations.length === 0 && !isSelectedBlocked && (
                <div className="text-center py-6 text-[var(--text-lighter)] text-sm">
                  Aucune réservation. Date libre.
                </div>
              )}
              {isSelectedBlocked && (
                <div className="bg-gray-100 rounded-xl p-4 text-sm text-[var(--text-light)] text-center mb-3">
                  Date bloquée : {blockedByDate[selectedDate].reason || "indisponible"}
                </div>
              )}

              <div className="space-y-3">
                {selectedDayReservations.map((r) => (
                  <div key={r.id} className="card-light p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[r.status].color}`}>
                        {STATUS_LABELS[r.status].label}
                      </span>
                      <button onClick={() => deleteReservation(r.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-[var(--text)] mb-1">{r.clientName}</p>
                    <p className="text-xs text-[var(--text-light)] mb-1 capitalize">{r.eventType} • {TIME_SLOTS[r.timeSlot || "journee"]}</p>
                    {r.lieu && <p className="text-xs text-[var(--text-lighter)] flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.lieu}</p>}
                    <p className="text-xs text-[var(--text-lighter)] flex items-center gap-1"><Phone className="w-3 h-3" /> {r.clientPhone}</p>
                    {r.totalPrice && <p className="text-xs font-medium text-[var(--rose-dark)] mt-2">Prix : {r.totalPrice}€ • Acompte : {r.depositAmount || Math.round(r.totalPrice * 0.3)}€</p>}
                    <div className="flex gap-1 mt-3">
                      {r.status === "pending" && (
                        <button onClick={() => updateStatus(r.id, "confirmed")} className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">
                          Confirmer
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button onClick={() => updateStatus(r.id, "cancelled")} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">
                          Annuler
                        </button>
                      )}
                      {r.status === "confirmed" && (
                        <button onClick={() => updateStatus(r.id, "completed")} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
                          Terminé
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!isSelectedBlocked && (
                <button
                  onClick={() => { setEditingRes({ eventDate: selectedDate } as Reservation); setShowCreateModal(true); }}
                  className="w-full mt-4 btn-outline !py-2.5 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Nouvelle réservation
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Liste complete des réservations */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="card-light p-6">
          <h2 className="font-bold text-[var(--text)] mb-4">Toutes les réservations ({reservations.length})</h2>
          {reservations.length === 0 ? (
            <p className="text-sm text-[var(--text-lighter)] text-center py-8">Aucune réservation pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {[...reservations].sort((a, b) => b.eventDate.localeCompare(a.eventDate)).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--warm)] transition gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-[var(--text)]">{r.clientName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[r.status].color}`}>
                        {STATUS_LABELS[r.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-light)] truncate">
                      {r.eventDate} • {r.eventType} • {r.clientPhone}
                    </p>
                  </div>
                  {r.totalPrice && (
                    <span className="text-sm font-bold text-[var(--rose-dark)] whitespace-nowrap">{r.totalPrice}€</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal création */}
      <AnimatePresence>
        {showCreateModal && editingRes && (
          <CreateReservationModal
            initial={editingRes}
            onClose={() => { setShowCreateModal(false); setEditingRes(null); }}
            onCreated={(r) => {
              setReservations([...reservations, r]);
              setShowCreateModal(false);
              setEditingRes(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// Modal création
// =========================================================

function CreateReservationModal({
  initial, onClose, onCreated,
}: { initial: Partial<Reservation>; onClose: () => void; onCreated: (r: Reservation) => void }) {
  const [form, setForm] = useState<{
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    eventType: string;
    eventDate: string;
    timeSlot: "matin" | "midi" | "soir" | "journee";
    lieu: string;
    notes: string;
    totalPrice: string;
    depositAmount: string;
  }>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventType: "anniversaire",
    eventDate: initial.eventDate || "",
    timeSlot: "journee",
    lieu: "",
    notes: "",
    totalPrice: "",
    depositAmount: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const total = parseInt(form.totalPrice, 10) || 0;
    const deposit = parseInt(form.depositAmount, 10) || Math.round(total * 0.3);
    const res = await fetch("/api/admin/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalPrice: total,
        depositAmount: deposit,
        prestations: [],
        status: "pending",
      }),
    });
    const data = await res.json();
    onCreated(data.reservation);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="relative bg-[var(--cream)] rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[var(--text)]">Nouvelle réservation</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--warm)] flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="input-light" placeholder="Nom client *" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          <input className="input-light" type="email" placeholder="Email *" required value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} />
          <input className="input-light" type="tel" placeholder="Téléphone *" required value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} />
          <select className="input-light" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
            <option value="mariage">Mariage</option>
            <option value="bapteme">Baptême</option>
            <option value="anniversaire">Anniversaire</option>
            <option value="fiancailles">Fiançailles</option>
            <option value="baby-shower">Baby Shower</option>
            <option value="autre">Autre</option>
          </select>
          <input className="input-light" type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
          <select className="input-light" value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value as "matin" | "midi" | "soir" | "journee" })}>
            <option value="journee">Journée complète</option>
            <option value="matin">Matin (8h-12h)</option>
            <option value="midi">Midi (12h-16h)</option>
            <option value="soir">Soir (16h-22h)</option>
          </select>
          <input className="input-light" placeholder="Lieu" value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input-light" type="number" placeholder="Prix total €" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} />
            <input className="input-light" type="number" placeholder="Acompte €" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: e.target.value })} />
          </div>
          <textarea className="input-light" rows={3} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit" disabled={loading} className="btn-rose w-full disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</> : "Créer la réservation"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
