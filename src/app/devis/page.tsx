"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Calendar, Users, Check, Phone,
  Loader2, MapPin, ChevronRight, Heart, Gem, Cake, Baby,
  Gift, Building2, Sparkles, MessageCircle, Euro, Clock,
} from "lucide-react";
import { config, EVENT_TYPES, FORMULAS, SERVICES } from "@/lib/config";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { buildWhatsAppUrl, buildDevisMessage } from "@/components/WhatsAppButton";

type Step = "event" | "details" | "services" | "contact" | "confirm";
const STEPS_ORDER: Step[] = ["event", "details", "services", "contact", "confirm"];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
};

const GUEST_RANGES = [
  "Moins de 20",
  "20 - 50",
  "50 - 100",
  "100 - 150",
  "150 - 200",
  "200 - 300",
  "Plus de 300",
];

const BUDGET_RANGES = [
  "Moins de 500€",
  "500€ - 1 000€",
  "1 000€ - 2 500€",
  "2 500€ - 5 000€",
  "5 000€ - 10 000€",
  "Plus de 10 000€",
  "A definir ensemble",
];

const AMBIANCES = [
  { id: "champetre", label: "Champetre", emoji: "🌾" },
  { id: "chic", label: "Chic & elegant", emoji: "✨" },
  { id: "boheme", label: "Boheme", emoji: "🌿" },
  { id: "moderne", label: "Moderne", emoji: "🖤" },
  { id: "romantique", label: "Romantique", emoji: "🌹" },
  { id: "festif", label: "Festif & colore", emoji: "🎉" },
  { id: "autre", label: "Autre / A definir", emoji: "💭" },
];

export default function DevisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-light)]">Chargement...</div>}>
      <DevisContent />
    </Suspense>
  );
}

function DevisContent() {
  const searchParams = useSearchParams();
  const prefillType = searchParams.get("type");
  const prefillFormula = searchParams.get("formule");

  const [step, setStep] = useState<Step>("event");

  // Step 1: Event
  const [eventType, setEventType] = useState(prefillType || "");
  const [formula, setFormula] = useState(prefillFormula || "");

  // Step 2: Details
  const [date, setDate] = useState("");
  const [dateFlexible, setDateFlexible] = useState(false);
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [ambiance, setAmbiance] = useState("");
  const [lieu, setLieu] = useState("");
  const [lieuKm, setLieuKm] = useState("");
  const [calculating, setCalculating] = useState(false);

  // Step 3: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Step 4: Contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Submit
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prefillType) setEventType(prefillType);
    if (prefillFormula) setFormula(prefillFormula);
  }, [prefillType, prefillFormula]);

  const travelFee = useMemo(() => {
    if (!lieuKm) return 0;
    const km = parseFloat(lieuKm);
    if (km <= config.freeKmRadius) return 0;
    return Math.round((km - config.freeKmRadius) * config.pricePerKm);
  }, [lieuKm]);

  const handleLieuSelected = useCallback(async (address: string) => {
    setLieu(address);
    setCalculating(true);
    try {
      const origin = encodeURIComponent(`${config.city}, France`);
      const destination = encodeURIComponent(address);
      const res = await fetch(`/api/distance?origin=${origin}&destination=${destination}`);
      if (res.ok) {
        const data = await res.json();
        setLieuKm(String(data.distanceKm));
      }
    } finally {
      setCalculating(false);
    }
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const currentStepIndex = STEPS_ORDER.indexOf(step);
  const canNext = () => {
    switch (step) {
      case "event": return eventType && formula;
      case "details": return guests;
      case "services": return true;
      case "contact": return name && phone;
      default: return false;
    }
  };

  const goNext = () => {
    const idx = STEPS_ORDER.indexOf(step);
    if (idx < STEPS_ORDER.length - 1) setStep(STEPS_ORDER[idx + 1]);
  };
  const goBack = () => {
    const idx = STEPS_ORDER.indexOf(step);
    if (idx > 0) setStep(STEPS_ORDER[idx - 1]);
  };

  const eventLabel = EVENT_TYPES.find(e => e.id === eventType)?.label || eventType;
  const formulaLabel = FORMULAS.find(f => f.id === formula)?.name || formula;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const body = {
        eventType, formula, date, dateFlexible, guests, budget,
        ambiance, lieu, lieuKm: lieuKm ? parseFloat(lieuKm) : null,
        travelFee, selectedServices, name, phone, email, notes,
      };
      await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const whatsappUrl = buildWhatsAppUrl(
        buildDevisMessage({
          eventType: eventLabel,
          date: date || "A definir",
          guests,
          name,
          phone,
          formula: formulaLabel,
          location: lieu || "A definir",
          notes,
        })
      );
      window.open(whatsappUrl, "_blank");
      setSubmitted(true);
    } catch {
      alert("Erreur lors de l'envoi. Veuillez reessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--cream)]">
        <div className="card-light p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--sage)]/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-[var(--sage)]" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-[var(--text)]">Demande envoyee !</h1>
          <p className="text-[var(--text-light)] mb-6">
            Votre demande de devis a ete envoyee via WhatsApp. Nous vous repondrons sous 24h.
          </p>
          <div className="card-light p-4 text-left text-sm space-y-2 mb-6">
            <p><span className="text-[var(--text-lighter)]">Evenement :</span> {eventLabel}</p>
            <p><span className="text-[var(--text-lighter)]">Formule :</span> {formulaLabel}</p>
            <p><span className="text-[var(--text-lighter)]">Invites :</span> {guests}</p>
            {date && <p><span className="text-[var(--text-lighter)]">Date :</span> {date}</p>}
          </div>
          <Link href="/" className="btn-rose inline-block text-center w-full">Retour a l&apos;accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[var(--cream)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--text)] transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <span className="text-rose-gradient font-bold">{config.brand}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-10">
          {STEPS_ORDER.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  step === s
                    ? "bg-[var(--rose)] text-white"
                    : currentStepIndex > i
                    ? "bg-[var(--rose)]/20 text-[var(--rose)]"
                    : "bg-[var(--border)] text-[var(--text-lighter)]"
                }`}
              >
                {currentStepIndex > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS_ORDER.length - 1 && <div className="flex-1 h-px bg-[var(--border)]" />}
            </div>
          ))}
        </div>

        {/* Step 1: Event Type + Formula */}
        {step === "event" && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2 text-[var(--text)]">Quel evenement preparons-nous ?</h1>
            <p className="text-[var(--text-light)] mb-8">Selectionnez le type et la formule souhaitee</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {EVENT_TYPES.map((evt) => {
                const Icon = ICON_MAP[evt.icon] || Sparkles;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setEventType(evt.id)}
                    className={`card-light p-4 text-left transition ${
                      eventType === evt.id ? "!border-[var(--rose)] bg-[var(--rose)]/5" : ""
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${eventType === evt.id ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`} />
                    <p className="font-medium text-sm text-[var(--text)]">{evt.label}</p>
                  </button>
                );
              })}
            </div>

            <h2 className="text-lg font-bold mb-4 text-[var(--text)]">Quelle formule ?</h2>
            <div className="space-y-3">
              {FORMULAS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormula(f.id)}
                  className={`w-full card-light p-5 flex items-center justify-between text-left ${
                    formula === f.id ? "!border-[var(--rose)] bg-[var(--rose)]/5" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold text-[var(--text)]">{f.name}</p>
                    <p className="text-sm text-[var(--text-light)]">{f.description}</p>
                  </div>
                  <p className="text-lg font-bold text-[var(--rose)] whitespace-nowrap ml-4">{f.price}€</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === "details" && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2 text-[var(--text)]">Les details de votre evenement</h1>
            <p className="text-[var(--text-light)] mb-8">Plus on en sait, meilleur sera le devis</p>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-2 block">Date souhaitee</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3 w-4 h-4 text-[var(--text-lighter)]" />
                  <input className="input-light pl-11" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <button
                  onClick={() => setDateFlexible(!dateFlexible)}
                  className={`mt-2 flex items-center gap-2 text-sm ${dateFlexible ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${dateFlexible ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"}`}>
                    {dateFlexible && <Check className="w-3 h-3 text-white" />}
                  </div>
                  Dates flexibles
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-2 block">Nombre d'invites *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GUEST_RANGES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGuests(g)}
                      className={`py-2.5 px-3 rounded-full text-sm font-medium border transition ${
                        guests === g
                          ? "bg-[var(--rose)] text-white border-[var(--rose)]"
                          : "border-[var(--border)] text-[var(--text-light)] hover:border-[var(--rose)]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-2 block">Budget indicatif</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUDGET_RANGES.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`py-2.5 px-3 rounded-full text-sm font-medium border transition ${
                        budget === b
                          ? "bg-[var(--rose)] text-white border-[var(--rose)]"
                          : "border-[var(--border)] text-[var(--text-light)] hover:border-[var(--rose)]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-2 block">Ambiance souhaitee</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AMBIANCES.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAmbiance(a.id)}
                      className={`py-2.5 px-3 rounded-full text-sm font-medium border transition ${
                        ambiance === a.id
                          ? "bg-[var(--rose)] text-white border-[var(--rose)]"
                          : "border-[var(--border)] text-[var(--text-light)] hover:border-[var(--rose)]"
                      }`}
                    >
                      {a.emoji} {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-2 block">Lieu de l'evenement (pour frais de deplacement)</label>
                <AddressAutocomplete
                  label=""
                  placeholder="Adresse ou ville du lieu..."
                  onPlaceSelected={handleLieuSelected}
                />
                {calculating && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-lighter)] mt-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Calcul de la distance...
                  </div>
                )}
                {lieuKm && !calculating && (
                  <div className="card-light p-3 mt-2 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[var(--rose)]" />
                    <span className="text-sm">{lieuKm} km depuis {config.city}</span>
                    {travelFee > 0 ? (
                      <span className="ml-auto text-sm font-medium text-[var(--rose)]">+{travelFee}€ deplacement</span>
                    ) : (
                      <span className="ml-auto text-sm text-[var(--sage)]">Gratuit (rayon {config.freeKmRadius}km)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {step === "services" && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2 text-[var(--text)]">Services complementaires</h1>
            <p className="text-[var(--text-light)] mb-8">Selectionnez les services qui vous interessent (optionnel)</p>

            <div className="space-y-3">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`w-full card-light p-4 flex items-center gap-4 text-left ${
                    selectedServices.includes(s.id) ? "!border-[var(--rose)] bg-[var(--rose)]/5" : ""
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                    selectedServices.includes(s.id) ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"
                  }`}>
                    {selectedServices.includes(s.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[var(--text)]">{s.label}</p>
                  </div>
                  <span className="text-xs text-[var(--rose-dark)] font-medium">{s.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Contact */}
        {step === "contact" && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2 text-[var(--text)]">Vos coordonnees</h1>
            <p className="text-[var(--text-light)] mb-8">Pour vous recontacter avec votre devis personnalise</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-1 block">Nom complet *</label>
                <input className="input-light" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-1 block">Telephone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3 w-4 h-4 text-[var(--text-lighter)]" />
                  <input className="input-light pl-11" type="tel" placeholder="06 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-1 block">Email</label>
                <input className="input-light" type="email" placeholder="votre@email.com (optionnel)" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text)] mb-1 block">Details supplementaires</label>
                <textarea className="input-light" rows={4} placeholder="Decrivez votre vision, vos envies, vos contraintes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === "confirm" && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2 text-[var(--text)]">Recapitulatif</h1>
            <p className="text-[var(--text-light)] mb-8">Verifiez et envoyez votre demande de devis</p>

            <div className="card-light p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-[var(--text-lighter)]">Evenement</span>
                <span className="font-medium">{eventLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-lighter)]">Formule</span>
                <span className="font-medium text-[var(--rose)]">{formulaLabel}</span>
              </div>
              {date && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-lighter)]">Date</span>
                  <span>{date}{dateFlexible ? " (flexible)" : ""}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--text-lighter)]">Invites</span>
                <span>{guests}</span>
              </div>
              {budget && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-lighter)]">Budget</span>
                  <span>{budget}</span>
                </div>
              )}
              {ambiance && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-lighter)]">Ambiance</span>
                  <span>{AMBIANCES.find(a => a.id === ambiance)?.label}</span>
                </div>
              )}
              {lieu && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-lighter)]">Lieu</span>
                  <span className="text-right text-sm max-w-[60%]">{lieu}</span>
                </div>
              )}
              {travelFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-lighter)]">Frais deplacement</span>
                  <span className="text-[var(--rose)] font-medium">{travelFee}€</span>
                </div>
              )}
              {selectedServices.length > 0 && (
                <div>
                  <span className="text-[var(--text-lighter)] text-sm">Services demandes :</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedServices.map(id => {
                      const s = SERVICES.find(s => s.id === id);
                      return s ? (
                        <span key={id} className="text-xs bg-[var(--rose)]/10 text-[var(--rose-dark)] px-3 py-1 rounded-full">
                          {s.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              <hr className="border-[var(--border)]" />
              <div className="flex justify-between">
                <span className="text-[var(--text-lighter)]">Nom</span>
                <span>{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-lighter)]">Telephone</span>
                <span>{phone}</span>
              </div>
              {email && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-lighter)]">Email</span>
                  <span>{email}</span>
                </div>
              )}
            </div>

            <div className="mt-4 card-light p-4 border-[var(--sage)]/30 bg-[var(--sage)]/5 flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-light)]">
                En confirmant, votre demande sera envoyee via WhatsApp. Vous recevrez un devis detaille sous 24h.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {currentStepIndex > 0 && (
            <button onClick={goBack} className="flex-1 py-3 rounded-full bg-white border border-[var(--border)] text-[var(--text-light)] text-sm font-medium hover:text-[var(--text)] transition">
              Retour
            </button>
          )}
          {step !== "confirm" ? (
            <button
              onClick={goNext}
              disabled={!canNext()}
              className="btn-rose flex-[2] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continuer <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-rose flex-[2] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
              {!submitting && <Check className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
