"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Check, Heart, Gem, Cake, Baby,
  Gift, Building2, Sparkles, MapPin, Phone, Mail, Loader2,
  PartyPopper, Calendar, Users, Euro, Palette,
} from "lucide-react";
import { config, EVENT_TYPES, FORMULAS, SERVICES } from "@/lib/config";
import { buildWhatsAppUrl, buildDevisMessage } from "./WhatsAppButton";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
};

const GUEST_RANGES = ["Moins de 20", "20-50", "50-100", "100-150", "150-200", "200-300", "300+"];
const BUDGET_RANGES = ["< 500€", "500-1000€", "1000-2500€", "2500-5000€", "5000-10000€", "10000€+", "A definir"];
const AMBIANCES = [
  { id: "champetre", label: "Champetre", emoji: "🌾" },
  { id: "chic", label: "Chic & elegant", emoji: "✨" },
  { id: "boheme", label: "Boheme", emoji: "🌿" },
  { id: "moderne", label: "Moderne & epure", emoji: "🖤" },
  { id: "romantique", label: "Romantique", emoji: "🌹" },
  { id: "festif", label: "Festif & colore", emoji: "🎉" },
];

const TOTAL_STEPS = 7;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

interface Props {
  onClose: () => void;
  prefillType?: string;
}

export default function DevisPopup({ onClose, prefillType = "" }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Data
  const [eventType, setEventType] = useState(prefillType);
  const [formula, setFormula] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [ambiance, setAmbiance] = useState("");
  const [date, setDate] = useState("");
  const [dateFlexible, setDateFlexible] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lieu, setLieu] = useState("");
  const [notes, setNotes] = useState("");

  // State
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!eventType;
      case 1: return !!formula;
      case 2: return !!guests;
      case 3: return true; // ambiance optional
      case 4: return true; // services optional
      case 5: return name && phone;
      default: return false;
    }
  };

  const eventLabel = EVENT_TYPES.find(e => e.id === eventType)?.label || eventType;
  const formulaObj = FORMULAS.find(f => f.id === formula);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType, formula, date, dateFlexible, guests, budget,
          ambiance, lieu, selectedServices, name, phone, email, notes,
        }),
      });
      const whatsappUrl = buildWhatsAppUrl(
        buildDevisMessage({
          eventType: eventLabel,
          date: date || "A definir",
          guests,
          name,
          phone,
          formula: formulaObj?.name || formula,
          location: lieu || "A definir",
          notes,
        })
      );
      window.open(whatsappUrl, "_blank");
      setSubmitted(true);
    } catch {
      alert("Erreur. Veuillez reessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg mx-4 bg-[var(--cream)] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--rose-dark)] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[var(--text)]">Votre devis</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--warm)] flex items-center justify-center text-[var(--text-light)] hover:text-[var(--text)]"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress bar */}
        <div className="px-6 shrink-0">
          <div className="h-1.5 bg-[var(--warm)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose-dark)] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-[var(--text-lighter)] mt-2">Etape {step + 1} sur {TOTAL_STEPS}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait" custom={direction}>
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--sage)]/20 flex items-center justify-center"
                >
                  <PartyPopper className="w-10 h-10 text-[var(--sage)]" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-[var(--text)] mb-3"
                >
                  Demande envoyee !
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[var(--text-light)] mb-8"
                >
                  Merci {name} ! Nous vous recontacterons sous 24h avec votre devis personnalise.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="btn-rose"
                >
                  Fermer
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Step 0: Event Type */}
                {step === 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2">Quel evenement preparons-nous ?</h2>
                    <p className="text-sm text-[var(--text-light)] mb-6">Selectionnez le type d'evenement</p>
                    <div className="grid grid-cols-2 gap-3">
                      {EVENT_TYPES.map((evt) => {
                        const Icon = ICON_MAP[evt.icon] || Sparkles;
                        const selected = eventType === evt.id;
                        return (
                          <motion.button
                            key={evt.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { setEventType(evt.id); setTimeout(goNext, 300); }}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                              selected
                                ? "border-[var(--rose)] bg-[var(--rose)]/10 shadow-md"
                                : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
                            }`}
                          >
                            <motion.div animate={selected ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
                              <Icon className={`w-6 h-6 mb-2 ${selected ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`} />
                            </motion.div>
                            <p className="font-medium text-sm text-[var(--text)]">{evt.label}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 1: Formula */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2">Quel accompagnement souhaitez-vous ?</h2>
                    <p className="text-sm text-[var(--text-light)] mb-6">Choisissez votre niveau de service</p>
                    <div className="space-y-3">
                      {FORMULAS.map((f) => {
                        const selected = formula === f.id;
                        return (
                          <motion.button
                            key={f.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setFormula(f.id); setTimeout(goNext, 300); }}
                            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                              selected
                                ? "border-[var(--rose)] bg-[var(--rose)]/10 shadow-md"
                                : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-[var(--text)]">{f.name}</p>
                              <p className="font-bold text-[var(--rose)]">{f.price}€</p>
                            </div>
                            <p className="text-sm text-[var(--text-light)]">{f.description}</p>
                            {selected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="mt-3 pt-3 border-t border-[var(--border)]"
                              >
                                <ul className="space-y-1">
                                  {f.features.map(feat => (
                                    <li key={feat} className="flex items-center gap-2 text-xs text-[var(--text-light)]">
                                      <Check className="w-3 h-3 text-[var(--sage)]" /> {feat}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Guests + Budget */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2">Combien d'invites ?</h2>
                    <p className="text-sm text-[var(--text-light)] mb-6">Selectionnez une fourchette</p>
                    <div className="grid grid-cols-3 gap-2 mb-8">
                      {GUEST_RANGES.map((g) => (
                        <motion.button
                          key={g}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setGuests(g)}
                          className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                            guests === g
                              ? "bg-[var(--rose)] text-white border-[var(--rose)] shadow-md"
                              : "border-[var(--border)] bg-white text-[var(--text-light)] hover:border-[var(--rose)]/40"
                          }`}
                        >
                          {g}
                        </motion.button>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text)] mb-2">Budget indicatif ?</h3>
                    <p className="text-sm text-[var(--text-light)] mb-4">Optionnel — aide a orienter nos propositions</p>
                    <div className="grid grid-cols-3 gap-2">
                      {BUDGET_RANGES.map((b) => (
                        <motion.button
                          key={b}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setBudget(b)}
                          className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                            budget === b
                              ? "bg-[var(--rose)] text-white border-[var(--rose)] shadow-md"
                              : "border-[var(--border)] bg-white text-[var(--text-light)] hover:border-[var(--rose)]/40"
                          }`}
                        >
                          {b}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Ambiance + Date */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2">Quelle ambiance ?</h2>
                    <p className="text-sm text-[var(--text-light)] mb-6">Selectionnez le style qui vous ressemble</p>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {AMBIANCES.map((a) => (
                        <motion.button
                          key={a.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setAmbiance(a.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            ambiance === a.id
                              ? "border-[var(--rose)] bg-[var(--rose)]/10 shadow-md"
                              : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
                          }`}
                        >
                          <span className="text-2xl">{a.emoji}</span>
                          <p className="font-medium text-sm text-[var(--text)] mt-1">{a.label}</p>
                        </motion.button>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text)] mb-3">Date souhaitee ?</h3>
                    <input
                      className="input-light w-full"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDateFlexible(!dateFlexible)}
                      className={`mt-3 flex items-center gap-2 text-sm ${dateFlexible ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        dateFlexible ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"
                      }`}>
                        {dateFlexible && <Check className="w-3 h-3 text-white" />}
                      </div>
                      Mes dates sont flexibles
                    </motion.button>
                  </div>
                )}

                {/* Step 4: Services */}
                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2">Des services en plus ?</h2>
                    <p className="text-sm text-[var(--text-light)] mb-6">Optionnel — cochez ce qui vous interesse</p>
                    <div className="space-y-2">
                      {SERVICES.map((s, i) => {
                        const selected = selectedServices.includes(s.id);
                        return (
                          <motion.button
                            key={s.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleService(s.id)}
                            className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                              selected
                                ? "border-[var(--rose)] bg-[var(--rose)]/10"
                                : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
                            }`}
                          >
                            <motion.div
                              animate={selected ? { scale: [1, 1.3, 1] } : {}}
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                                selected ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"
                              }`}
                            >
                              {selected && <Check className="w-3 h-3 text-white" />}
                            </motion.div>
                            <span className="flex-1 font-medium text-sm text-[var(--text)]">{s.label}</span>
                            <span className="text-xs text-[var(--rose-dark)]">{s.price}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 5: Contact */}
                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2">Vos coordonnees</h2>
                    <p className="text-sm text-[var(--text-light)] mb-6">Pour recevoir votre devis personnalise</p>
                    <div className="space-y-4">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <label className="text-sm font-medium text-[var(--text)] mb-1 block">Nom complet *</label>
                        <input className="input-light" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <label className="text-sm font-medium text-[var(--text)] mb-1 block">Telephone *</label>
                        <input className="input-light" type="tel" placeholder="06 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <label className="text-sm font-medium text-[var(--text)] mb-1 block">Email</label>
                        <input className="input-light" type="email" placeholder="votre@email.com (optionnel)" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <label className="text-sm font-medium text-[var(--text)] mb-1 block">Lieu de l'evenement</label>
                        <input className="input-light" placeholder="Ville ou adresse (optionnel)" value={lieu} onChange={(e) => setLieu(e.target.value)} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <label className="text-sm font-medium text-[var(--text)] mb-1 block">Autre chose a nous dire ?</label>
                        <textarea className="input-light" rows={3} placeholder="Vos envies, idees, contraintes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Step 6: Recap */}
                {step === 6 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2">Recapitulatif</h2>
                    <p className="text-sm text-[var(--text-light)] mb-6">Verifiez avant d'envoyer</p>
                    <div className="space-y-3">
                      {[
                        { label: "Evenement", value: eventLabel },
                        { label: "Formule", value: formulaObj?.name, highlight: true },
                        { label: "Invites", value: guests },
                        budget ? { label: "Budget", value: budget } : null,
                        ambiance ? { label: "Ambiance", value: AMBIANCES.find(a => a.id === ambiance)?.label } : null,
                        date ? { label: "Date", value: `${date}${dateFlexible ? " (flexible)" : ""}` } : null,
                        lieu ? { label: "Lieu", value: lieu } : null,
                        { label: "Contact", value: `${name} — ${phone}` },
                      ].filter(Boolean).map((item, i) => (
                        <motion.div
                          key={item!.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-none"
                        >
                          <span className="text-sm text-[var(--text-lighter)]">{item!.label}</span>
                          <span className={`text-sm font-medium ${item!.highlight ? "text-[var(--rose)]" : "text-[var(--text)]"}`}>
                            {item!.value}
                          </span>
                        </motion.div>
                      ))}
                      {selectedServices.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="pt-2"
                        >
                          <p className="text-sm text-[var(--text-lighter)] mb-2">Services</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedServices.map(id => {
                              const s = SERVICES.find(s => s.id === id);
                              return s ? (
                                <span key={id} className="text-xs bg-[var(--rose)]/10 text-[var(--rose-dark)] px-3 py-1 rounded-full">
                                  {s.label}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex gap-3 shrink-0 bg-white/50 backdrop-blur-sm">
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={goBack}
                className="flex items-center gap-1 px-5 py-3 rounded-full border border-[var(--border)] text-[var(--text-light)] text-sm font-medium hover:text-[var(--text)] transition"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </motion.button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(212,165,116,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={goNext}
                disabled={!canNext()}
                className="btn-rose flex-1 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(212,165,116,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-rose flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</>
                ) : (
                  <>Envoyer ma demande <Check className="w-4 h-4" /></>
                )}
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
