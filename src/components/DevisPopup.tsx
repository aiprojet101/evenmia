"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Check, Heart, Gem, Cake, Baby,
  Gift, Building2, Sparkles, Phone, Loader2,
  PartyPopper, Calendar, Users, MapPin, Music,
  Camera, Video, Gamepad2, Flower2, PenTool, CakeSlice,
  Clock, Truck, Home as HomeIcon, TreePine, UtensilsCrossed, Building,
} from "lucide-react";
import { config, EVENT_TYPES, FORMULAS } from "@/lib/config";
import { calculateDevis, getSeasonFromDate, formatPrice, type DevisData } from "@/lib/pricing-engine";
import { buildWhatsAppUrl, buildDevisMessage } from "./WhatsAppButton";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
};

const TOTAL_STEPS = 10;

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
};

interface Props {
  onClose: () => void;
  prefillType?: string;
}

function ChoiceButton({ selected, onClick, children, className = "" }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 text-left transition-all ${
        selected ? "border-[var(--rose)] bg-[var(--rose)]/10 shadow-md" : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}

function QuestionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h2 className="text-xl font-bold text-[var(--text)] mb-1">{title}</h2>
      <p className="text-sm text-[var(--text-light)] mb-6">{subtitle}</p>
    </>
  );
}

export default function DevisPopup({ onClose, prefillType = "" }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 0: Event type
  const [eventType, setEventType] = useState(prefillType);
  // Step 1: Formula
  const [formula, setFormula] = useState("");
  // Step 2: Guests + Duration
  const [guestsValue, setGuestsValue] = useState(80);
  const [duration, setDuration] = useState("journee");
  // Step 3: Date + Timeline
  const [date, setDate] = useState("");
  const [dateFlexible, setDateFlexible] = useState(false);
  const [timeline, setTimeline] = useState("");
  // Step 4: Venue
  const [hasVenue, setHasVenue] = useState("");
  const [venueType, setVenueType] = useState("");
  // Step 5: Decoration
  const [decorLevel, setDecorLevel] = useState("");
  const [ambiance, setAmbiance] = useState("");
  // Step 6: Catering + Sweet table
  const [cateringHelp, setCateringHelp] = useState("");
  const [sweetTable, setSweetTable] = useState(false);
  // Step 7: Entertainment + Floral + Stationery
  const [entertainmentNeeds, setEntertainmentNeeds] = useState<string[]>([]);
  const [floralBudget, setFloralBudget] = useState("");
  const [stationery, setStationery] = useState(false);
  // Step 8: Setup + Distance
  const [setupTeardown, setSetupTeardown] = useState("");
  const [lieu, setLieu] = useState("");
  const [distanceKm, setDistanceKm] = useState(0);
  // Step 9: Contact (recap + price + contact)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const toggleEntertainment = (id: string) => {
    setEntertainmentNeeds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!eventType;
      case 1: return !!formula;
      case 2: return guestsValue > 0;
      case 3: return !!timeline;
      case 4: return !!hasVenue;
      case 5: return !!decorLevel;
      case 6: return !!cateringHelp;
      case 7: return true;
      case 8: return !!setupTeardown;
      case 9: return !!(name && phone);
      default: return false;
    }
  };

  const devisData: DevisData = useMemo(() => ({
    eventType,
    formula: formula || "premium",
    guests: guestsValue,
    duration,
    season: getSeasonFromDate(date),
    hasVenue,
    venueType,
    decorLevel,
    cateringHelp,
    entertainmentNeeds,
    floralBudget,
    stationery,
    sweetTable,
    setupTeardown,
    timeline,
    distanceKm,
    complexity: "standard",
  }), [eventType, formula, guestsValue, duration, date, hasVenue, venueType, decorLevel, cateringHelp, entertainmentNeeds, floralBudget, stationery, sweetTable, setupTeardown, timeline, distanceKm]);

  const pricing = useMemo(() => calculateDevis(devisData), [devisData]);

  const eventLabel = EVENT_TYPES.find(e => e.id === eventType)?.label || eventType;
  const formulaObj = FORMULAS.find(f => f.id === formula);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...devisData, name, phone, email, notes, lieu,
          estimatedPrice: pricing.total,
          dateFlexible, ambiance, date,
        }),
      });
      const whatsappUrl = buildWhatsAppUrl(
        buildDevisMessage({
          eventType: eventLabel,
          date: date || "A definir",
          guests: `${guestsValue} personnes`,
          name, phone,
          formula: formulaObj?.name || formula,
          location: lieu || "A definir",
          notes: `Devis estime: ${formatPrice(pricing.total)}€\n${notes}`,
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg mx-4 bg-[var(--cream)] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--rose-dark)] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[var(--text)]">Votre devis personnalise</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--warm)] flex items-center justify-center text-[var(--text-light)]"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress */}
        <div className="px-6 shrink-0">
          <div className="h-1.5 bg-[var(--warm)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose-dark)] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-[var(--text-lighter)]">Question {step + 1} / {TOTAL_STEPS}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait" custom={direction}>
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--sage)]/20 flex items-center justify-center">
                  <PartyPopper className="w-10 h-10 text-[var(--sage)]" />
                </motion.div>
                <h2 className="text-2xl font-bold text-[var(--text)] mb-3">Demande envoyee !</h2>
                <p className="text-[var(--text-light)] mb-4">Merci {name} !</p>
                <div className="card-light p-5 mb-6 text-center">
                  <p className="text-sm text-[var(--text-lighter)] mb-1">Votre devis estime</p>
                  <p className="text-4xl font-bold text-[var(--rose)]">{formatPrice(pricing.total)}€</p>
                  <p className="text-xs text-[var(--text-lighter)] mt-1">Acompte : {formatPrice(pricing.depositAmount)}€ (30%)</p>
                </div>
                <p className="text-sm text-[var(--text-light)] mb-6">Nous vous recontacterons sous 24h pour affiner ensemble.</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="btn-rose">Fermer</motion.button>
              </motion.div>
            ) : (
              <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>

                {/* Step 0: Event Type */}
                {step === 0 && (
                  <div>
                    <QuestionTitle title="Quel evenement preparons-nous ?" subtitle="Chaque type d'evenement a ses specificites" />
                    <div className="grid grid-cols-2 gap-3">
                      {EVENT_TYPES.map((evt) => {
                        const Icon = ICON_MAP[evt.icon] || Sparkles;
                        return (
                          <ChoiceButton key={evt.id} selected={eventType === evt.id}
                            onClick={() => { setEventType(evt.id); setTimeout(goNext, 250); }}>
                            <Icon className={`w-6 h-6 mb-2 ${eventType === evt.id ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`} />
                            <p className="font-medium text-sm">{evt.label}</p>
                          </ChoiceButton>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 1: Formula */}
                {step === 1 && (
                  <div>
                    <QuestionTitle title="Quel niveau d'accompagnement ?" subtitle="Plus on vous accompagne, plus vous profitez" />
                    <div className="space-y-3">
                      {FORMULAS.map((f) => (
                        <ChoiceButton key={f.id} selected={formula === f.id} className="w-full"
                          onClick={() => { setFormula(f.id); setTimeout(goNext, 250); }}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-[var(--text)]">{f.name}</p>
                              <p className="text-xs text-[var(--text-light)]">{f.description}</p>
                            </div>
                            <p className="font-bold text-[var(--rose)] whitespace-nowrap ml-3">{f.price}€</p>
                          </div>
                          {formula === f.id && (
                            <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              className="mt-2 pt-2 border-t border-[var(--border)] space-y-1">
                              {f.features.map(feat => (
                                <li key={feat} className="flex items-center gap-2 text-xs text-[var(--text-light)]">
                                  <Check className="w-3 h-3 text-[var(--sage)]" /> {feat}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Guests + Duration */}
                {step === 2 && (
                  <div>
                    <QuestionTitle title="Combien d'invites et quelle duree ?" subtitle="Le nombre d'invites est le facteur n°1 du prix" />
                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-3">
                        <label className="text-sm font-medium text-[var(--text)]">Nombre d'invites</label>
                        <motion.span key={guestsValue} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                          className="text-2xl font-bold text-[var(--rose)]">{guestsValue}</motion.span>
                      </div>
                      <input type="range" min="10" max="500" step="10" value={guestsValue}
                        onChange={(e) => setGuestsValue(parseInt(e.target.value))}
                        className="w-full h-2 bg-[var(--warm)] rounded-full appearance-none cursor-pointer accent-[var(--rose)]"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-lighter)] mt-1">
                        <span>10</span><span>100</span><span>200</span><span>300</span><span>500</span>
                      </div>
                    </div>

                    <label className="text-sm font-medium text-[var(--text)] mb-3 block">Duree de l'evenement</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "demi-journee", label: "Demi-journee", sub: "4-5h" },
                        { id: "journee", label: "Journee", sub: "8-12h" },
                        { id: "weekend", label: "Week-end", sub: "2 jours" },
                      ].map((d) => (
                        <ChoiceButton key={d.id} selected={duration === d.id} onClick={() => setDuration(d.id)}>
                          <p className="font-medium text-sm text-center">{d.label}</p>
                          <p className="text-xs text-[var(--text-lighter)] text-center">{d.sub}</p>
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Date + Timeline */}
                {step === 3 && (
                  <div>
                    <QuestionTitle title="Quand aura lieu l'evenement ?" subtitle="La saison et le delai influencent le tarif" />
                    <label className="text-sm font-medium text-[var(--text)] mb-2 block">Date souhaitee</label>
                    <input className="input-light w-full mb-3" type="date" value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]} />
                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={() => setDateFlexible(!dateFlexible)}
                      className={`mb-6 flex items-center gap-2 text-sm ${dateFlexible ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${dateFlexible ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"}`}>
                        {dateFlexible && <Check className="w-3 h-3 text-white" />}
                      </div>
                      Dates flexibles
                    </motion.button>

                    {date && getSeasonFromDate(date) === "haute" && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-xs text-[var(--rose)] bg-[var(--rose)]/10 px-3 py-2 rounded-xl mb-4">
                        Haute saison (mai-sept) : supplement de 15% — les prestataires sont tres demandes
                      </motion.p>
                    )}

                    <label className="text-sm font-medium text-[var(--text)] mb-3 block">Dans combien de temps ?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "< 3 mois", label: "Moins de 3 mois", warn: true },
                        { id: "3-6 mois", label: "3 a 6 mois" },
                        { id: "6-12 mois", label: "6 a 12 mois" },
                        { id: "> 12 mois", label: "Plus d'un an" },
                      ].map((t) => (
                        <ChoiceButton key={t.id} selected={timeline === t.id}
                          onClick={() => { setTimeline(t.id); setTimeout(goNext, 250); }}>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${t.warn ? "text-orange-400" : "text-[var(--text-lighter)]"}`} />
                            <p className="font-medium text-sm">{t.label}</p>
                          </div>
                          {t.warn && timeline === t.id && (
                            <p className="text-xs text-orange-500 mt-1">Supplement urgence 25%</p>
                          )}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Venue */}
                {step === 4 && (
                  <div>
                    <QuestionTitle title="Avez-vous deja un lieu ?" subtitle="On peut aussi vous aider a en trouver un" />
                    <div className="space-y-3 mb-6">
                      {[
                        { id: "oui", label: "Oui, j'ai deja mon lieu", icon: Check },
                        { id: "recherche", label: "Non, aidez-moi a en trouver un", icon: MapPin, fee: "+200€" },
                        { id: "non", label: "Je n'ai pas encore cherche", icon: MapPin },
                      ].map((v) => (
                        <ChoiceButton key={v.id} selected={hasVenue === v.id} className="w-full"
                          onClick={() => setHasVenue(v.id)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <v.icon className="w-5 h-5 text-[var(--text-lighter)]" />
                              <p className="font-medium text-sm">{v.label}</p>
                            </div>
                            {v.fee && <span className="text-xs text-[var(--rose)]">{v.fee}</span>}
                          </div>
                        </ChoiceButton>
                      ))}
                    </div>

                    {(hasVenue === "oui" || hasVenue === "recherche") && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <label className="text-sm font-medium text-[var(--text)] mb-3 block">Type de lieu souhaite</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "salle", label: "Salle de reception", icon: Building },
                            { id: "domaine", label: "Domaine / Chateau", icon: HomeIcon },
                            { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
                            { id: "exterieur", label: "Plein air", icon: TreePine },
                          ].map((v) => (
                            <ChoiceButton key={v.id} selected={venueType === v.id} onClick={() => setVenueType(v.id)}>
                              <v.icon className="w-5 h-5 mb-1 text-[var(--text-lighter)]" />
                              <p className="text-sm font-medium">{v.label}</p>
                            </ChoiceButton>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 5: Decoration */}
                {step === 5 && (
                  <div>
                    <QuestionTitle title="Quel niveau de decoration ?" subtitle="De sobre a spectaculaire, on s'adapte" />
                    <div className="space-y-3 mb-8">
                      {[
                        { id: "simple", label: "Sobre & epure", desc: "Quelques elements cles, tons neutres", price: "Inclus" },
                        { id: "elabore", label: "Elabore & soigne", desc: "Centres de table, arche, eclairage", price: "+350€" },
                        { id: "luxe", label: "Luxueux & spectaculaire", desc: "Scenographie complete, wow effect", price: "+800€" },
                      ].map((d) => (
                        <ChoiceButton key={d.id} selected={decorLevel === d.id} className="w-full"
                          onClick={() => { setDecorLevel(d.id); }}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm">{d.label}</p>
                              <p className="text-xs text-[var(--text-light)]">{d.desc}</p>
                            </div>
                            <span className="text-xs font-medium text-[var(--rose)]">{d.price}</span>
                          </div>
                        </ChoiceButton>
                      ))}
                    </div>

                    <label className="text-sm font-medium text-[var(--text)] mb-3 block">Style / ambiance</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "champetre", label: "Champetre", e: "🌾" },
                        { id: "chic", label: "Chic", e: "✨" },
                        { id: "boheme", label: "Boheme", e: "🌿" },
                        { id: "moderne", label: "Moderne", e: "🖤" },
                        { id: "romantique", label: "Romantique", e: "🌹" },
                        { id: "festif", label: "Festif", e: "🎉" },
                      ].map((a) => (
                        <ChoiceButton key={a.id} selected={ambiance === a.id} onClick={() => setAmbiance(a.id)}>
                          <p className="text-center text-lg">{a.e}</p>
                          <p className="text-xs text-center font-medium mt-1">{a.label}</p>
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Catering */}
                {step === 6 && (
                  <div>
                    <QuestionTitle title="Et pour le traiteur ?" subtitle="On peut chercher et negocier pour vous" />
                    <div className="space-y-3 mb-8">
                      {[
                        { id: "oui", label: "Aidez-moi a trouver un traiteur", desc: "Selection, degustation, negociation", price: "+150€" },
                        { id: "deja", label: "J'ai deja mon traiteur", desc: "On coordonnera avec lui", price: "Inclus" },
                        { id: "non", label: "Pas besoin de traiteur", desc: "Cocktail, buffet maison...", price: "" },
                      ].map((c) => (
                        <ChoiceButton key={c.id} selected={cateringHelp === c.id} className="w-full"
                          onClick={() => setCateringHelp(c.id)}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm">{c.label}</p>
                              <p className="text-xs text-[var(--text-light)]">{c.desc}</p>
                            </div>
                            {c.price && <span className="text-xs font-medium text-[var(--rose)]">{c.price}</span>}
                          </div>
                        </ChoiceButton>
                      ))}
                    </div>

                    <div className="card-light p-4">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSweetTable(!sweetTable)}
                        className="flex items-center gap-3 w-full">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                          sweetTable ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"
                        }`}>
                          {sweetTable && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">Sweet table / Candy bar</p>
                          <p className="text-xs text-[var(--text-light)]">Bar a bonbons, cupcakes, cake pops...</p>
                        </div>
                        <span className="text-xs text-[var(--rose)]">+180€</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 7: Entertainment + Extras */}
                {step === 7 && (
                  <div>
                    <QuestionTitle title="Quels prestataires rechercher ?" subtitle="On les trouve, on negocie, on coordonne" />
                    <div className="space-y-2 mb-8">
                      {[
                        { id: "dj", label: "DJ / Musique", icon: Music, price: "+100€" },
                        { id: "photo", label: "Photographe", icon: Camera, price: "+80€" },
                        { id: "video", label: "Videaste", icon: Video, price: "+80€" },
                        { id: "animation", label: "Animations / Jeux", icon: Gamepad2, price: "+120€" },
                      ].map((e) => {
                        const sel = entertainmentNeeds.includes(e.id);
                        return (
                          <motion.button key={e.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => toggleEntertainment(e.id)}
                            className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 ${
                              sel ? "border-[var(--rose)] bg-[var(--rose)]/10" : "border-[var(--border)] bg-white"
                            }`}>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                              sel ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"
                            }`}>
                              {sel && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <e.icon className="w-5 h-5 text-[var(--text-lighter)]" />
                            <span className="flex-1 text-left font-medium text-sm">{e.label}</span>
                            <span className="text-xs text-[var(--rose)]">{e.price}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <label className="text-sm font-medium text-[var(--text)] mb-3 block">Compositions florales</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { id: "non", label: "Non merci", price: "" },
                        { id: "petit", label: "Quelques bouquets", price: "+100€" },
                        { id: "moyen", label: "Deco florale complete", price: "+250€" },
                        { id: "grand", label: "Fleurs partout !", price: "+500€" },
                      ].map((f) => (
                        <ChoiceButton key={f.id} selected={floralBudget === f.id} onClick={() => setFloralBudget(f.id)}>
                          <p className="text-sm font-medium">{f.label}</p>
                          {f.price && <p className="text-xs text-[var(--rose)]">{f.price}</p>}
                        </ChoiceButton>
                      ))}
                    </div>

                    <div className="card-light p-4">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStationery(!stationery)}
                        className="flex items-center gap-3 w-full">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                          stationery ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"
                        }`}>
                          {stationery && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">Faire-part & papeterie</p>
                          <p className="text-xs text-[var(--text-light)]">Invitations, menus, marque-places</p>
                        </div>
                        <span className="text-xs text-[var(--rose)]">+150€</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 8: Setup + Distance */}
                {step === 8 && (
                  <div>
                    <QuestionTitle title="Installation et logistique" subtitle="Qui installe et desinstalle la decoration ?" />
                    <div className="space-y-3 mb-8">
                      {[
                        { id: "nous", label: "Evenmia gere tout", desc: "Installation + desinstallation completes", price: "+200€" },
                        { id: "partage", label: "On fait ensemble", desc: "On supervise, vous aidez", price: "+100€" },
                        { id: "client", label: "Je gere moi-meme", desc: "Vous fournissez les consignes", price: "Inclus" },
                      ].map((s) => (
                        <ChoiceButton key={s.id} selected={setupTeardown === s.id} className="w-full"
                          onClick={() => setSetupTeardown(s.id)}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm">{s.label}</p>
                              <p className="text-xs text-[var(--text-light)]">{s.desc}</p>
                            </div>
                            <span className="text-xs font-medium text-[var(--rose)]">{s.price}</span>
                          </div>
                        </ChoiceButton>
                      ))}
                    </div>

                    <label className="text-sm font-medium text-[var(--text)] mb-2 block">Lieu de l'evenement</label>
                    <input className="input-light w-full mb-2" placeholder="Ville ou adresse"
                      value={lieu} onChange={(e) => setLieu(e.target.value)} />
                    <p className="text-xs text-[var(--text-lighter)]">
                      Deplacement gratuit dans un rayon de {config.freeKmRadius}km autour de {config.city}
                    </p>
                  </div>
                )}

                {/* Step 9: Price Reveal + Contact */}
                {step === 9 && (
                  <div>
                    {!showPrice ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Votre devis est pret !</h2>
                        <p className="text-sm text-[var(--text-light)] mb-8">Cliquez pour decouvrir votre estimation</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowPrice(true)}
                          className="btn-rose !py-4 !px-10 text-lg mx-auto flex items-center gap-2"
                        >
                          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}>
                            <PartyPopper className="w-5 h-5" />
                          </motion.span>
                          Voir mon devis
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Price reveal */}
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 15 }}
                          className="card-light p-6 text-center mb-4"
                        >
                          <p className="text-sm text-[var(--text-lighter)] mb-1">Estimation pour votre {eventLabel.toLowerCase()}</p>
                          <motion.p
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.3 }}
                            className="text-5xl font-bold text-[var(--rose)] my-3"
                          >
                            {formatPrice(pricing.total)}€
                          </motion.p>
                          <p className="text-xs text-[var(--text-lighter)]">Acompte de {formatPrice(pricing.depositAmount)}€ (30%)</p>
                        </motion.div>

                        {/* Breakdown */}
                        <motion.details initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                          className="mb-6 text-sm">
                          <summary className="cursor-pointer text-[var(--rose)] font-medium text-sm mb-2">Voir le detail</summary>
                          <div className="space-y-1 text-xs text-[var(--text-light)] bg-white rounded-xl p-4">
                            <div className="flex justify-between"><span>Formule {formulaObj?.name}</span><span>{formatPrice(pricing.basePrice)}€</span></div>
                            {pricing.guestSupplement > 0 && <div className="flex justify-between"><span>Supplement invites ({guestsValue}p.)</span><span>+{formatPrice(pricing.guestSupplement)}€</span></div>}
                            {pricing.durationSupplement !== 0 && <div className="flex justify-between"><span>Duree</span><span>{pricing.durationSupplement > 0 ? "+" : ""}{formatPrice(pricing.durationSupplement)}€</span></div>}
                            {pricing.seasonSupplement > 0 && <div className="flex justify-between"><span>Haute saison</span><span>+{formatPrice(pricing.seasonSupplement)}€</span></div>}
                            {pricing.decorSupplement > 0 && <div className="flex justify-between"><span>Decoration</span><span>+{formatPrice(pricing.decorSupplement)}€</span></div>}
                            {pricing.venueSearchFee > 0 && <div className="flex justify-between"><span>Recherche lieu</span><span>+{formatPrice(pricing.venueSearchFee)}€</span></div>}
                            {pricing.cateringSearchFee > 0 && <div className="flex justify-between"><span>Recherche traiteur</span><span>+{formatPrice(pricing.cateringSearchFee)}€</span></div>}
                            {pricing.entertainmentFees > 0 && <div className="flex justify-between"><span>Prestataires</span><span>+{formatPrice(pricing.entertainmentFees)}€</span></div>}
                            {pricing.floralFee > 0 && <div className="flex justify-between"><span>Fleurs</span><span>+{formatPrice(pricing.floralFee)}€</span></div>}
                            {pricing.stationeryFee > 0 && <div className="flex justify-between"><span>Papeterie</span><span>+{formatPrice(pricing.stationeryFee)}€</span></div>}
                            {pricing.sweetTableFee > 0 && <div className="flex justify-between"><span>Sweet table</span><span>+{formatPrice(pricing.sweetTableFee)}€</span></div>}
                            {pricing.setupFee > 0 && <div className="flex justify-between"><span>Installation</span><span>+{formatPrice(pricing.setupFee)}€</span></div>}
                            {pricing.urgencyFee > 0 && <div className="flex justify-between"><span>Supplement urgence</span><span>+{formatPrice(pricing.urgencyFee)}€</span></div>}
                            {pricing.travelFee > 0 && <div className="flex justify-between"><span>Deplacement</span><span>+{formatPrice(pricing.travelFee)}€</span></div>}
                            <div className="flex justify-between font-bold text-[var(--text)] pt-2 border-t border-[var(--border)]">
                              <span>Total</span><span>{formatPrice(pricing.total)}€</span>
                            </div>
                          </div>
                        </motion.details>

                        {/* Contact form */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                          <p className="text-sm font-medium text-[var(--text)] mb-3">Recevez votre devis detaille :</p>
                          <div className="space-y-3">
                            <input className="input-light" placeholder="Votre nom *" value={name} onChange={(e) => setName(e.target.value)} />
                            <input className="input-light" type="tel" placeholder="Telephone *" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <input className="input-light" type="email" placeholder="Email (optionnel)" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <textarea className="input-light" rows={2} placeholder="Precisions, envies..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!submitted && (step < 9 || showPrice) && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex gap-3 shrink-0 bg-white/50 backdrop-blur-sm">
            {step > 0 && (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goBack}
                className="flex items-center gap-1 px-5 py-3 rounded-full border border-[var(--border)] text-[var(--text-light)] text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Retour
              </motion.button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goNext}
                disabled={!canNext()}
                className="btn-rose flex-1 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                Continuer <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : showPrice ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                disabled={submitting || !name || !phone}
                className="btn-rose flex-1 flex items-center justify-center gap-2 disabled:opacity-30">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : <>Recevoir mon devis <Check className="w-4 h-4" /></>}
              </motion.button>
            ) : null}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
