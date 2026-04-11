"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
  ArrowRight, Phone, Star, ChevronRight, Check,
  Mail, MapPin, Palette, X, PartyPopper,
} from "lucide-react";
import { config, EVENT_TYPES, FORMULAS, SERVICES } from "@/lib/config";
import DevisPopup from "@/components/DevisPopup";

const TESTIMONIALS = [
  { name: "Sophie L.", text: "Anais a transforme notre mariage en un reve eveille. Chaque detail etait parfait, du premier rendez-vous jusqu'a la derniere danse.", stars: 5, tag: "Mariage", initials: "SL" },
  { name: "Julie & Marc", text: "Un bapteme magnifique organise en un mois seulement. Decoration sublime, coordination impeccable. On recommande a 200% !", stars: 5, tag: "Bapteme", initials: "JM" },
  { name: "Thomas R.", text: "Seminaire de 80 personnes gere sans stress. Nos collaborateurs en parlent encore. Merci Evenmia !", stars: 5, tag: "Seminaire CE", initials: "TR" },
  { name: "Camille D.", text: "Ma baby shower etait absolument magique. Anais a su capter exactement l'ambiance que je voulais.", stars: 5, tag: "Baby Shower", initials: "CD" },
];

const STEPS = [
  { num: "01", title: "Racontez-nous", desc: "Repondez a quelques questions sur votre evenement reve", icon: Heart },
  { num: "02", title: "On imagine ensemble", desc: "Rendez-vous pour affiner votre vision, budget et envies", icon: Palette },
  { num: "03", title: "On s'occupe de tout", desc: "Organisation, coordination, decoration — profitez", icon: Sparkles },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
};

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCard({ children, className = "", index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[var(--rose)]/20"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Home() {
  const [showDevis, setShowDevis] = useState(false);
  const [devisType, setDevisType] = useState("");

  // Auto-open devis si ?devis=1 dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("devis") === "1") {
      setDevisType(params.get("type") || "");
      setShowDevis(true);
    }
  }, []);

  const openDevis = (type = "") => {
    setDevisType(type);
    setShowDevis(true);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)]/80 backdrop-blur-xl border-b border-[var(--border)]"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-2">
          <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
            <img src="/logo.png" alt={config.brand} className="h-14 sm:h-16" />
          </motion.div>
          <div className="flex items-center gap-5">
            <Link href="/portfolio" className="hidden md:block text-sm text-[var(--text-light)] hover:text-[var(--rose)] transition">Portfolio</Link>
            <Link href="/blog" className="hidden md:block text-sm text-[var(--text-light)] hover:text-[var(--rose)] transition">Blog</Link>
            <a href={`tel:${config.phoneIntl}`} className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-light)] hover:text-[var(--rose)] transition">
              <Phone className="w-4 h-4" />
              {config.phone}
            </a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openDevis()}
              className="btn-rose !py-2.5 !px-6 !text-xs"
            >
              Devis gratuit
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--rose)]/5 via-transparent to-transparent" />
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--rose)]/8 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <FloatingParticle delay={0} x="15%" y="25%" size={8} />
        <FloatingParticle delay={1} x="80%" y="30%" size={6} />
        <FloatingParticle delay={2} x="25%" y="70%" size={10} />
        <FloatingParticle delay={1.5} x="70%" y="65%" size={7} />
        <FloatingParticle delay={0.5} x="50%" y="20%" size={5} />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--rose)]/10 border border-[var(--rose)]/20 text-sm text-[var(--rose-dark)] mb-8"
              animate={{ boxShadow: ["0 0 0 0 rgba(212,165,116,0)", "0 0 0 8px rgba(212,165,116,0.1)", "0 0 0 0 rgba(212,165,116,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Organisation d'evenements — {config.city} & {config.region}
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-[var(--text)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            Vos evenements
            <br />
            <motion.span
              className="text-rose-gradient inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              sur-mesure
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-8 text-lg sm:text-xl text-[var(--text-light)] max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Mariages, fiancailles, anniversaires, baptemes, seminaires...
            <br className="hidden sm:block" />
            Chaque moment merite d'etre <strong className="text-[var(--rose-dark)]">inoubliable</strong>.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(212,165,116,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openDevis()}
              className="btn-rose flex items-center gap-2 text-base !py-4 !px-8"
            >
              Creer mon evenement
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${config.phoneIntl}`}
              className="btn-outline flex items-center gap-2 !py-4 !px-8"
            >
              <Phone className="w-4 h-4" />
              Appeler
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center justify-center gap-6 sm:gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            {[
              { value: "5.0", label: "Google", stars: true },
              { value: "50+", label: "Evenements" },
              { value: "100%", label: "Sur-mesure" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-10">
                <div className="text-center">
                  <motion.p
                    className={`text-2xl font-bold ${i === 0 ? "text-[var(--rose)]" : "text-[var(--text)]"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.5 + i * 0.15, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                  {stat.stars && (
                    <div className="flex gap-0.5 justify-center mt-1">
                      {[1,2,3,4,5].map(j => <Star key={j} className="w-3 h-3 text-[var(--rose)] fill-[var(--rose)]" />)}
                    </div>
                  )}
                  <p className="text-xs text-[var(--text-lighter)] mt-1">{stat.label}</p>
                </div>
                {i < 2 && <div className="w-px h-10 bg-[var(--border)]" />}
              </div>
            ))}
          </motion.div>
        </div>

      </section>

      {/* Event Types */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Nos specialites</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--text)]">
              Chaque evenement est <span className="text-rose-gradient">unique</span>
            </h2>
            <p className="text-center text-[var(--text-light)] mb-16 max-w-lg mx-auto">
              Particuliers ou entreprises, nous donnons vie a vos projets.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENT_TYPES.slice(0, 8).map((evt, i) => {
              const Icon = ICON_MAP[evt.icon] || Sparkles;
              return (
                <AnimatedCard key={evt.id} index={i}>
                  <motion.button
                    onClick={() => openDevis(evt.id)}
                    whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(212,165,116,0.15)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full text-left card-light p-6 hover:bg-white transition-all duration-300"
                  >
                    <motion.div
                      className="w-12 h-12 mb-4 rounded-xl bg-[var(--rose)]/10 flex items-center justify-center"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-5 h-5 text-[var(--rose)]" />
                    </motion.div>
                    <h3 className="font-semibold mb-1.5 text-[var(--text)]">{evt.label}</h3>
                    <p className="text-sm text-[var(--text-light)] leading-relaxed">{evt.description}</p>
                  </motion.button>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Comment ca marche</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[var(--text)]">
              Votre evenement en <span className="text-rose-gradient">3 etapes</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <AnimatedCard key={s.num} index={i} className="relative text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--rose)]/10 to-[var(--sage)]/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <s.icon className="w-7 h-7 text-[var(--rose)]" />
                </motion.div>
                <div className="text-5xl font-black text-[var(--rose)]/10 absolute -top-2 left-1/2 -translate-x-1/2">{s.num}</div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text)]">{s.title}</h3>
                <p className="text-[var(--text-light)] text-sm leading-relaxed">{s.desc}</p>
                {i < 2 && <div className="hidden sm:block absolute top-8 -right-4 text-[var(--border)]"><ChevronRight className="w-6 h-6" /></div>}
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Formulas / Pricing */}
      <section id="tarifs" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Nos formules</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--text)]">
              Une formule pour chaque <span className="text-rose-gradient">besoin</span>
            </h2>
            <p className="text-center text-[var(--text-light)] mb-16 max-w-lg mx-auto">
              Du jour-J a l'organisation complete, choisissez votre niveau d'accompagnement.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMULAS.map((f, i) => (
              <AnimatedCard key={f.id} index={i}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: f.popular ? "0 20px 50px rgba(212,165,116,0.25)" : "0 12px 30px rgba(0,0,0,0.08)" }}
                  className={`card-light p-8 flex flex-col relative h-full ${
                    f.popular ? "ring-2 ring-[var(--rose)] shadow-lg" : ""
                  }`}
                >
                  {f.popular && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--rose)] text-white text-xs font-bold px-4 py-1 rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Populaire
                    </motion.div>
                  )}
                  <h3 className="text-xl font-bold text-[var(--text)] mb-1">{f.name}</h3>
                  <p className="text-sm text-[var(--text-light)] mb-4">{f.description}</p>
                  <p className="text-2xl font-bold text-[var(--rose)] mb-6">{f.price}€</p>
                  <ul className="space-y-3 flex-1">
                    {f.features.map((feat, fi) => (
                      <motion.li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-[var(--text-light)]"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: fi * 0.05 }}
                      >
                        <Check className="w-4 h-4 text-[var(--sage)] shrink-0 mt-0.5" />
                        {feat}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openDevis()}
                    className={`mt-8 text-center py-3 rounded-full font-semibold text-sm transition w-full ${
                      f.popular ? "btn-rose" : "btn-outline"
                    }`}
                  >
                    Demander un devis
                  </motion.button>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Temoignages</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[var(--text)]">
              Ils nous font <span className="text-rose-gradient">confiance</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedCard key={t.name} index={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card-light p-6 flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--rose)]/20 to-[var(--sage)]/20 flex items-center justify-center text-sm font-bold text-[var(--rose-dark)]">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{t.name}</p>
                      <p className="text-xs text-[var(--rose-dark)]">{t.tag}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-[var(--rose)] fill-[var(--rose)]" />
                    ))}
                  </div>
                  <p className="text-[var(--text-light)] text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--rose)]/5 to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <FloatingParticle delay={0} x="10%" y="30%" size={12} />
        <FloatingParticle delay={1.5} x="85%" y="40%" size={8} />
        <FloatingParticle delay={0.8} x="60%" y="20%" size={6} />

        <AnimatedSection className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[var(--rose)] to-[var(--rose-dark)] flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-[var(--text)]">
            Pret a creer un moment <span className="text-rose-gradient">magique</span> ?
          </h2>
          <p className="text-[var(--text-light)] mb-10 text-lg">Repondez a quelques questions et recevez votre devis en 24h.</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 16px 50px rgba(212,165,116,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openDevis()}
            className="btn-rose flex items-center gap-2 text-base !py-4 !px-10 mx-auto"
          >
            Commencer le questionnaire
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt={config.brand} className="h-16" />
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--text-light)]">
              <a href={`tel:${config.phoneIntl}`} className="hover:text-[var(--rose)] transition flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {config.phone}
              </a>
              <a href={`mailto:${config.email}`} className="hover:text-[var(--rose)] transition flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {config.email}
              </a>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm italic text-[var(--rose-dark)]/70">
              Anais, ce site est un cadeau de ton papa qui est fier de toi. Brille et realise tes reves, je serai toujours la pour toi.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-lighter)]">
            <span>&copy; {new Date().getFullYear()} {config.brand} — Tous droits reserves</span>
            <div className="flex gap-4">
              <Link href="/mentions-legales" className="hover:text-[var(--text-light)] transition">Mentions legales</Link>
              <Link href="/cgv" className="hover:text-[var(--text-light)] transition">CGV</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Devis Popup */}
      <AnimatePresence>
        {showDevis && (
          <DevisPopup onClose={() => setShowDevis(false)} prefillType={devisType} />
        )}
      </AnimatePresence>
    </div>
  );
}
