"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Check, Heart, Gem, Cake, Baby,
  Gift, Building2, Sparkles, Phone, Loader2, PartyPopper, Calendar, Star,
} from "lucide-react";
import { config, EVENT_TYPES } from "@/lib/config";
import { EVENT_STEPS, type QuestionStep } from "@/lib/questions";
import { calculateFromAnswers, formatPrice } from "@/lib/pricing-engine";
import { buildWhatsAppUrl, buildDevisMessage } from "./WhatsAppButton";
import AddressAutocomplete from "./AddressAutocomplete";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
};

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d < 0 ? 280 : -280, opacity: 0 }),
};

interface Props { onClose: () => void; prefillType?: string; }

export default function DevisPopup({ onClose, prefillType = "" }: Props) {
  // Phase: "type" -> "questions" -> "date" -> "funnel" -> "contact" -> "reveal"
  const [phase, setPhase] = useState<"type" | "questions" | "date" | "funnel" | "contact" | "reveal">(prefillType ? "questions" : "type");
  const [direction, setDirection] = useState(1);

  const [eventType, setEventType] = useState(prefillType);
  const formula = "premium"; // formule determinee par Anais, pas par le client
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [questionIndex, setQuestionIndex] = useState(0);

  // Date
  const [date, setDate] = useState("");
  const [dateFlexible, setDateFlexible] = useState(false);

  // Contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lieu, setLieu] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Get current event's questions, filtered by showIf
  const allSteps = useMemo(() => EVENT_STEPS[eventType] || [], [eventType]);
  const visibleSteps = useMemo(() =>
    allSteps.filter(s => !s.showIf || s.showIf(answers)),
    [allSteps, answers]
  );

  const currentStep = visibleSteps[questionIndex];
  const totalPhases = 4 + visibleSteps.length; // type + questions + date + funnel + contact + reveal
  const currentPhaseIndex = phase === "type" ? 0 :
    phase === "questions" ? 1 + questionIndex : phase === "date" ? 1 + visibleSteps.length :
    phase === "funnel" ? 2 + visibleSteps.length :
    phase === "contact" ? 3 + visibleSteps.length : totalPhases;
  const progress = Math.min(((currentPhaseIndex + 1) / (totalPhases + 2)) * 100, 100);

  const pricing = useMemo(() =>
    calculateFromAnswers(eventType, { ...answers, _date: date }, formula),
    [eventType, answers, date, formula]
  );

  const eventLabel = EVENT_TYPES.find(e => e.id === eventType)?.label || eventType;

  const setAnswer = (id: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const goNextPhase = () => {
    setDirection(1);
    if (phase === "type") { setQuestionIndex(0); setPhase("questions"); }
    else if (phase === "questions") {
      if (questionIndex < visibleSteps.length - 1) setQuestionIndex(i => i + 1);
      else setPhase("date");
    }
    else if (phase === "date") setPhase("funnel");
    else if (phase === "funnel") setPhase("contact");
    else if (phase === "contact") setPhase("reveal");
  };

  const goBackPhase = () => {
    setDirection(-1);
    if (phase === "questions") {
      if (questionIndex > 0) setQuestionIndex(i => i - 1);
      else setPhase("type");
    }
    else if (phase === "date") { setQuestionIndex(visibleSteps.length - 1); setPhase("questions"); }
    else if (phase === "funnel") setPhase("date");
    else if (phase === "contact") setPhase("funnel");
    else if (phase === "reveal") setPhase("contact");
  };

  const canNext = (): boolean => {
    if (phase === "type") return !!eventType;
    if (phase === "questions" && currentStep) {
      if (!currentStep.required && currentStep.type === "multi") return true;
      if (currentStep.type === "slider") return true;
      const val = answers[currentStep.id];
      if (currentStep.type === "multi") return true; // multi is always optional
      return val !== undefined && val !== "";
    }
    if (phase === "date") return true;
    if (phase === "funnel") return true;
    if (phase === "contact") return !!(name && phone);
    return true;
  };

  const handleSingleSelect = (stepId: string, optionId: string, autoAdv?: boolean) => {
    setAnswer(stepId, optionId);
    if (autoAdv) setTimeout(goNextPhase, 250);
  };

  const handleMultiToggle = (stepId: string, optionId: string) => {
    const current = (answers[stepId] as string[]) || [];
    if (optionId === "non") {
      setAnswer(stepId, ["non"]);
    } else {
      const filtered = current.filter(id => id !== "non");
      setAnswer(stepId, filtered.includes(optionId) ? filtered.filter(id => id !== optionId) : [...filtered, optionId]);
    }
  };

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType, formula, answers, date, dateFlexible,
          name, phone, email, lieu, notes,
          estimatedPrice: pricing.total,
        }),
      });
      const whatsappUrl = buildWhatsAppUrl(buildDevisMessage({
        eventType: eventLabel, date: date || "A definir",
        guests: String(answers.invites || answers.participants || ""),
        name, phone, formula: formula,
        location: lieu || "A definir",
        notes: `Devis estime: ${formatPrice(pricing.total)}€\n${notes}`,
      }));
      window.open(whatsappUrl, "_blank");
      setSubmitted(true);
    } catch { alert("Erreur."); } finally { setSubmitting(false); }
  }

  // Render a question step
  function renderStep(step: QuestionStep) {
    const val = answers[step.id];

    return (
      <div>
        <h2 className="text-xl font-bold text-[var(--text)] mb-1">{step.question}</h2>
        {step.subtitle && <p className="text-sm text-[var(--text-light)] mb-5">{step.subtitle}</p>}
        {!step.subtitle && <div className="mb-5" />}

        {/* Single select */}
        {step.type === "single" && step.options && (
          <div className={`grid gap-2.5 ${step.options.length <= 4 ? "grid-cols-1" : "grid-cols-2"}`}>
            {step.options.map(opt => {
              const sel = val === opt.id;
              return (
                <motion.button key={opt.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleSingleSelect(step.id, opt.id, step.autoAdvance)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                    sel ? "border-[var(--rose)] bg-[var(--rose)]/10 shadow-md" : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
                  }`}>
                  <div className="flex items-center gap-3">
                    {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{opt.label}</p>
                      {opt.priceNote && <p className="text-xs text-[var(--text-lighter)]">{opt.priceNote}</p>}
                    </div>
                    {opt.price && opt.price > 0 && <span className="text-xs text-[var(--rose)] font-medium">+{opt.price}€</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Multi select */}
        {step.type === "multi" && step.options && (
          <div className="space-y-2">
            {step.options.map(opt => {
              const selected = Array.isArray(val) && (val as string[]).includes(opt.id);
              return (
                <motion.button key={opt.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleMultiToggle(step.id, opt.id)}
                  className={`w-full p-3.5 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                    selected ? "border-[var(--rose)] bg-[var(--rose)]/10" : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
                  }`}>
                  <motion.div animate={selected ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.2 }}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                      selected ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"
                    }`}>
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </motion.div>
                  {opt.emoji && <span className="text-lg">{opt.emoji}</span>}
                  <span className="flex-1 font-medium text-sm">{opt.label}</span>
                  {opt.price && opt.price > 0 && <span className="text-xs text-[var(--rose)]">+{opt.price}€</span>}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Slider */}
        {step.type === "slider" && (
          <div>
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm text-[var(--text-light)]">{step.sliderUnit}</span>
              <motion.span key={String(val || step.sliderMin)} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                className="text-3xl font-bold text-[var(--rose)]">
                {String(val || step.sliderMin || 0)}
              </motion.span>
            </div>
            <input type="range" min={step.sliderMin} max={step.sliderMax} step={step.sliderStep}
              value={Number(val || step.sliderMin || 0)}
              onChange={(e) => setAnswer(step.id, parseInt(e.target.value))}
              className="w-full h-2 bg-[var(--warm)] rounded-full appearance-none cursor-pointer accent-[var(--rose)]" />
            <div className="flex justify-between text-xs text-[var(--text-lighter)] mt-1">
              <span>{step.sliderMin}</span><span>{step.sliderMax}</span>
            </div>
          </div>
        )}

        {/* Boolean */}
        {step.type === "boolean" && (
          <div className="grid grid-cols-2 gap-3">
            {[{ id: true, label: "Oui", emoji: "👍" }, { id: false, label: "Non", emoji: "👎" }].map(opt => (
              <motion.button key={String(opt.id)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setAnswer(step.id, opt.id); setTimeout(goNextPhase, 250); }}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  val === opt.id ? "border-[var(--rose)] bg-[var(--rose)]/10 shadow-md" : "border-[var(--border)] bg-white"
                }`}>
                <span className="text-2xl">{opt.emoji}</span>
                <p className="font-medium text-sm mt-1">{opt.label}</p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg mx-4 bg-[var(--cream)] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--rose-dark)] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-[var(--text)]">
                {phase === "type" ? "Votre projet" : eventLabel}
              </span>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--warm)] flex items-center justify-center text-[var(--text-light)]">
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress */}
        <div className="px-6 shrink-0">
          <div className="h-1.5 bg-[var(--warm)] rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose-dark)] rounded-full"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
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
                <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Demande envoyee !</h2>
                <p className="text-[var(--text-light)] mb-4">Merci {name} !</p>
                <div className="card-light p-5 mb-4 text-center">
                  <p className="text-sm text-[var(--text-lighter)] mb-1">Devis estime pour votre {eventLabel.toLowerCase()}</p>
                  <p className="text-4xl font-bold text-[var(--rose)]">{formatPrice(pricing.total)}€</p>
                  <p className="text-xs text-[var(--text-lighter)] mt-1">Acompte : {formatPrice(pricing.deposit)}€</p>
                </div>
                <p className="text-sm text-[var(--text-light)] mb-6">Reponse sous 24h avec le devis detaille.</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="btn-rose">Fermer</motion.button>
              </motion.div>
            ) : (
              <motion.div key={`${phase}-${questionIndex}`} custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>

                {/* Phase: Event Type */}
                {phase === "type" && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-1">Quel evenement preparons-nous ?</h2>
                    <p className="text-sm text-[var(--text-light)] mb-5">Chaque evenement a son propre parcours de questions</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {EVENT_TYPES.map(evt => {
                        const Icon = ICON_MAP[evt.icon] || Sparkles;
                        return (
                          <motion.button key={evt.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { setEventType(evt.id); setAnswers({}); setQuestionIndex(0); setDirection(1); setTimeout(() => setPhase("questions"), 250); }}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                              eventType === evt.id ? "border-[var(--rose)] bg-[var(--rose)]/10 shadow-md" : "border-[var(--border)] bg-white hover:border-[var(--rose)]/40"
                            }`}>
                            <Icon className={`w-6 h-6 mb-2 ${eventType === evt.id ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`} />
                            <p className="font-medium text-sm">{evt.label}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Phase: Questions */}
                {phase === "questions" && currentStep && renderStep(currentStep)}

                {/* Phase: Date */}
                {phase === "date" && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-1">Quand aura lieu l'evenement ?</h2>
                    <p className="text-sm text-[var(--text-light)] mb-5">La saison influence les tarifs des prestataires</p>
                    <input className="input-light w-full mb-3" type="date" value={date}
                      onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setDateFlexible(!dateFlexible)}
                      className={`mb-4 flex items-center gap-2 text-sm ${dateFlexible ? "text-[var(--rose)]" : "text-[var(--text-lighter)]"}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${dateFlexible ? "bg-[var(--rose)] border-[var(--rose)]" : "border-[var(--border)]"}`}>
                        {dateFlexible && <Check className="w-3 h-3 text-white" />}
                      </div>
                      Dates flexibles
                    </motion.button>
                    {date && new Date(date).getMonth() >= 4 && new Date(date).getMonth() <= 8 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-xs text-[var(--rose)] bg-[var(--rose)]/10 px-3 py-2 rounded-xl">
                        Haute saison (mai-sept) : les prestataires sont tres demandes
                      </motion.p>
                    )}

                    <div className="mt-6">
                      <label className="text-sm font-medium text-[var(--text)] mb-2 block">Lieu de l'evenement</label>
                      <AddressAutocomplete
                        label=""
                        placeholder="Tapez une adresse ou ville..."
                        onPlaceSelected={(addr) => setLieu(addr)}
                      />
                      {!window.google?.maps && (
                        <input className="input-light w-full mt-2" placeholder="Ville ou adresse" value={lieu} onChange={(e) => setLieu(e.target.value)} />
                      )}
                      <p className="text-xs text-[var(--text-lighter)] mt-1">Gratuit dans un rayon de {config.freeKmRadius}km autour d'{config.city}</p>
                    </div>
                  </div>
                )}

                {/* Phase: Funnel de vente */}
                {phase === "funnel" && (
                  <div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--rose)]/10 flex items-center justify-center"
                      >
                        <Heart className="w-8 h-8 text-[var(--rose)]" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-[var(--text)] mb-2">
                        Votre {eventLabel.toLowerCase()} est entre de bonnes mains
                      </h2>
                      <p className="text-sm text-[var(--text-light)]">Voici ce qu'Evenmia fait pour vous</p>
                    </motion.div>

                    <div className="space-y-3">
                      {[
                        { emoji: "🎯", title: "Un seul interlocuteur", desc: "Anais s'occupe de tout de A a Z. Vous profitez, elle gere." },
                        { emoji: "💰", title: "Meilleurs tarifs prestataires", desc: "Grace a notre reseau local, on negocie les meilleurs prix pour vous." },
                        { emoji: "😌", title: "Zero stress", desc: "Retroplanning, coordination jour-J, gestion des imprevus — on anticipe tout." },
                        { emoji: "✨", title: "Sur-mesure uniquement", desc: "Pas de formule toute faite. Chaque evenement est unique, comme vous." },
                        { emoji: "📍", title: "Expertise locale", desc: `On connait les meilleurs lieux et prestataires d'${config.city} et environs.` },
                      ].map((item, i) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-[var(--border)]"
                        >
                          <span className="text-xl mt-0.5">{item.emoji}</span>
                          <div>
                            <p className="font-semibold text-sm text-[var(--text)]">{item.title}</p>
                            <p className="text-xs text-[var(--text-light)] leading-relaxed">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 bg-[var(--sage)]/10 rounded-xl p-4 text-center"
                    >
                      <p className="text-sm font-medium text-[var(--text)]">
                        Plus de 50 evenements organises
                      </p>
                      <div className="flex justify-center gap-0.5 mt-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-4 h-4 text-[var(--rose)] fill-[var(--rose)]" />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--text-light)] mt-1">Note moyenne 5/5 sur Google</p>
                    </motion.div>
                  </div>
                )}

                {/* Phase: Contact */}
                {phase === "contact" && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-1">Derniere etape !</h2>
                    <p className="text-sm text-[var(--text-light)] mb-5">Vos coordonnees pour recevoir le devis</p>
                    <div className="space-y-3">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <input className="input-light" placeholder="Votre nom *" value={name} onChange={(e) => setName(e.target.value)} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <input className="input-light" type="tel" placeholder="Telephone *" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <input className="input-light" type="email" placeholder="Email (optionnel)" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <textarea className="input-light" rows={3} placeholder="Autre chose a nous dire ?" value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Phase: Reveal */}
                {phase === "reveal" && (
                  <div>
                    {!showPrice ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}>
                          <PartyPopper className="w-16 h-16 text-[var(--rose)] mx-auto mb-6" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-[var(--text)] mb-3">Votre devis est pret !</h2>
                        <p className="text-sm text-[var(--text-light)] mb-8">Base sur vos {visibleSteps.length} reponses</p>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => setShowPrice(true)}
                          className="btn-rose !py-4 !px-10 text-lg mx-auto flex items-center gap-3">
                          Decouvrir mon devis
                          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            <ArrowRight className="w-5 h-5" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 15 }} className="card-light p-6 text-center mb-4">
                          <p className="text-sm text-[var(--text-lighter)] mb-1">Votre {eventLabel.toLowerCase()}</p>
                          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}
                            className="text-5xl font-bold text-[var(--rose)] my-3">{formatPrice(pricing.total)}€</motion.p>
                          <p className="text-xs text-[var(--text-lighter)]">Acompte : {formatPrice(pricing.deposit)}€ (30%)</p>
                        </motion.div>

                        <motion.details initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-4">
                          <summary className="cursor-pointer text-[var(--rose)] font-medium text-sm mb-2">Detail du devis</summary>
                          <div className="space-y-1 text-xs text-[var(--text-light)] bg-white rounded-xl p-4">
                            {pricing.breakdown.map((b, i) => (
                              <div key={i} className="flex justify-between">
                                <span>{b.label}</span>
                                <span className="font-medium">{b.amount > 0 ? "+" : ""}{formatPrice(b.amount)}€</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-bold text-[var(--text)] pt-2 border-t border-[var(--border)]">
                              <span>Total</span><span>{formatPrice(pricing.total)}€</span>
                            </div>
                          </div>
                        </motion.details>

                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                          className="text-xs text-[var(--text-lighter)] text-center mb-2">
                          Estimation indicative. Le devis definitif sera affine ensemble.
                        </motion.p>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!submitted && phase !== "type" && !(phase === "reveal" && !showPrice) && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex gap-3 shrink-0 bg-white/50 backdrop-blur-sm">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goBackPhase}
              className="flex items-center gap-1 px-4 py-3 rounded-full border border-[var(--border)] text-[var(--text-light)] text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour
            </motion.button>
            {phase !== "reveal" ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goNextPhase}
                disabled={!canNext()}
                className="btn-rose flex-1 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                Continuer <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : showPrice ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                disabled={submitting}
                className="btn-rose flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : <>Recevoir mon devis <Check className="w-4 h-4" /></>}
              </motion.button>
            ) : null}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
