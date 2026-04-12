"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles, Check, ArrowRight, X, Star, Clock,
  Award, TrendingUp, Users, Calendar, Target,
  Briefcase, Heart, Gem, PartyPopper, ChevronDown,
  Euro, Shield, Zap, BookOpen, Download, MessageCircle,
  Gift, Mail, Video,
} from "lucide-react";

// =========================================================
// DATA
// =========================================================

const MODULES = [
  // SEMAINE 1 — FONDATIONS
  { week: "SEMAINE 1 — FONDATIONS", num: "01", title: "Le métier en 2026 : réalité du marché", desc: "Revenus réels, types de clients, pièges à éviter" },
  { week: "SEMAINE 1 — FONDATIONS", num: "02", title: "Statut juridique (micro-entreprise, EURL)", desc: "Seuils 2026, choisir le bon statut, déclarations URSSAF" },
  { week: "SEMAINE 1 — FONDATIONS", num: "03", title: "Assurance RC Pro (indispensable)", desc: "Comparatif 5 assureurs, contrats types, responsabilités" },
  { week: "SEMAINE 1 — FONDATIONS", num: "04", title: "Tarification et business model", desc: "Calcul du prix, marges, 4 méthodes tarifaires éprouvées" },
  { week: "SEMAINE 1 — FONDATIONS", num: "05", title: "Positionnement et niche", desc: "Te différencier pour vendre plus cher" },
  // SEMAINE 2 — TECHNIQUE
  { week: "SEMAINE 2 — TECHNIQUE", num: "06", title: "Rencontre client et brief", desc: "Questionnaire découverte, scripts de vente, closer un client" },
  { week: "SEMAINE 2 — TECHNIQUE", num: "07", title: "Réseau de prestataires et négociation", desc: "Marges sur prestataires, contrat d'apport d'affaires" },
  { week: "SEMAINE 2 — TECHNIQUE", num: "08", title: "Rétroplanning et coordination", desc: "Template complet, outils, checklist jour-J" },
  { week: "SEMAINE 2 — TECHNIQUE", num: "09", title: "Moodboard et scénographie", desc: "Concevoir une ambiance, palettes, outils pro gratuits" },
  { week: "SEMAINE 2 — TECHNIQUE", num: "10", title: "Décoration DIY et sourcing", desc: "Fournisseurs pros, marges, achat en gros" },
  // SEMAINE 3 — MARKETING
  { week: "SEMAINE 3 — MARKETING", num: "11", title: "Branding et identité visuelle", desc: "Logo, palette, Canva, créer une marque pro" },
  { week: "SEMAINE 3 — MARKETING", num: "12", title: "Site web et SEO local", desc: "50 mots-clés à cibler, Google My Business, backlinks" },
  { week: "SEMAINE 3 — MARKETING", num: "13", title: "Instagram qui convertit", desc: "7 piliers de contenu, algorithme 2026, stories qui vendent" },
  { week: "SEMAINE 3 — MARKETING", num: "14", title: "Tunnel de vente et automatisations", desc: "Notion OS, Make, Zapier — tout automatiser" },
  { week: "SEMAINE 3 — MARKETING", num: "15", title: "Pinterest et TikTok", desc: "Stratégies pour wedding planner, viralité, vues → clients" },
  // SEMAINE 4 — OPÉRATIONS
  { week: "SEMAINE 4 — OPÉRATIONS", num: "16", title: "Gestion du jour-J et crise", desc: "15 scénarios de crise, checklist d'urgence, sang-froid" },
  { week: "SEMAINE 4 — OPÉRATIONS", num: "17", title: "Comptabilité et fiscalité", desc: "TVA, charges, déclarations, logiciels gratuits" },
  { week: "SEMAINE 4 — OPÉRATIONS", num: "18", title: "Fidélisation et avis clients", desc: "Google reviews, bouche-à-oreille, upsells post-événement" },
  { week: "SEMAINE 4 — OPÉRATIONS", num: "19", title: "Scaling et équipe", desc: "Recruter des assistantes, KPIs, viser 10k€/mois" },
  { week: "SEMAINE 4 — OPÉRATIONS", num: "20", title: "Étude de cas : 0 à 1er contrat", desc: "Cas concret pas-à-pas, du lancement à la signature" },
];

const BONUS = [
  { icon: BookOpen, title: "Notion OS Wedding Planner", value: "297€", desc: "Système complet Notion pour gérer tes clients, prestataires, budgets" },
  { icon: Download, title: "50 templates Canva Premium", value: "197€", desc: "Faire-part, moodboards, posts Instagram, présentations clients" },
  { icon: Shield, title: "Contrat juridique (relu avocat)", value: "297€", desc: "Contrat de prestation conforme RGPD, clauses pro" },
  { icon: Users, title: "Base de 200+ prestataires France", value: "197€", desc: "Traiteurs, fleuristes, DJ, photographes — contacts réels" },
  { icon: Target, title: "Scripts de vente (10 emails + 5 DM)", value: "97€", desc: "Emails relance, DMs Instagram qui closent" },
  { icon: Calendar, title: "Rétroplanning 12 mois (Notion + Excel)", value: "97€", desc: "Template prêt à dupliquer, adaptable" },
  { icon: TrendingUp, title: "Audit SEO + 50 mots-clés", value: "147€", desc: "Liste de mots-clés prêts à cibler pour ta ville" },
  { icon: Video, title: "Bibliothèque de 100 Reels templates", value: "97€", desc: "Vidéos virales wedding planner à recréer" },
  { icon: MessageCircle, title: "Groupe privé WhatsApp à vie", value: "Inestimable", desc: "Communauté de wedding planners — entraide quotidienne" },
  { icon: Zap, title: "Session coaching 1-to-1 (30 min)", value: "150€", desc: "Audit personnalisé de ton business — offert" },
];

const OFFERS = [
  {
    id: "starter",
    name: "STARTER",
    price: 297,
    originalPrice: null,
    badge: null,
    description: "Pour celles qui veulent se lancer vite",
    features: [
      "Les 20 modules vidéo à vie",
      "Tous les templates et livrables",
      "Accès communauté WhatsApp",
      "Bonus 1 à 5 inclus",
      "Accès à vie + mises à jour",
    ],
    cta: "Je me lance",
  },
  {
    id: "pro",
    name: "PRO",
    price: 497,
    originalPrice: 697,
    badge: "LE PLUS CHOISI",
    popular: true,
    description: "La formation complète, tout inclus",
    features: [
      "Tout le STARTER +",
      "10 bonus complets (valeur 1 497€)",
      "Session coaching 1-to-1 (30 min)",
      "Base de 200+ prestataires",
      "Accès prioritaire aux lives Q&A",
      "Certificat de fin de formation",
    ],
    cta: "Je choisis PRO",
  },
  {
    id: "vip",
    name: "VIP",
    price: 997,
    originalPrice: 1497,
    badge: "ACCOMPAGNEMENT",
    description: "Accompagnement intensif 3 mois",
    features: [
      "Tout le PRO +",
      "3 sessions coaching 1-to-1 (1h)",
      "Audit complet de ton site web",
      "Audit Instagram personnalisé",
      "Garantie : 1er client signé ou remboursé",
      "Accès prioritaire à vie",
    ],
    cta: "Je passe en VIP",
  },
];

const TESTIMONIALS = [
  { name: "Léa, 32 ans, Lyon", text: "J'ai signé mon premier mariage AVANT d'avoir fini la formation. Le module sur les scripts de vente m'a sauvée — j'avais toujours peur de parler d'argent.", initials: "LM", result: "1er contrat en 21 jours — 2 800€" },
  { name: "Sarah, 28 ans, Bordeaux", text: "Je cherchais une formation sérieuse, pas du bla-bla Instagram. Le module juridique et le contrat type m'ont évité de grosses erreurs. Je recommande à 200%.", initials: "SB", result: "3 mariages signés en 2 mois" },
  { name: "Camille, 41 ans, Rennes", text: "J'ai fait le CNED avant : 1800€ et aucun contact client après. Wedding Pro 30 m'a donné le BUSINESS qui manquait. Je suis passée à 4500€/mois.", initials: "CR", result: "4 500€/mois au bout de 6 mois" },
  { name: "Julie, 35 ans, Toulouse", text: "Le groupe WhatsApp vaut à lui seul le prix de la formation. Chaque jour des conseils, des retours, des opportunités. Je ne suis plus seule.", initials: "JT", result: "Reconversion réussie" },
];

const FAQ = [
  { q: "Je débute complètement, est-ce que c'est fait pour moi ?", a: "Oui ! La formation est pensée pour les débutantes. On part de zéro : statut juridique, tarification, premiers clients. Tu n'as besoin d'aucune expérience préalable." },
  { q: "Combien de temps par jour dois-je y consacrer ?", a: "Comptez 1h à 1h30 par jour pendant 30 jours pour suivre le rythme intensif. Mais tu as un accès à vie — tu peux aussi l'étaler sur 3 mois à ton rythme." },
  { q: "Est-ce que je vais vraiment signer un contrat à la fin ?", a: "C'est l'objectif. Dans l'offre VIP, si tu n'as pas signé ton 1er contrat après 3 mois d'application sérieuse, on te rembourse intégralement." },
  { q: "Quelle est la différence avec le CNED ou Les Bonnes Planneuses ?", a: "Le CNED (1 800€) est très théorique et sans accompagnement business. Les Bonnes Planneuses (3 900€) est excellent mais très cher. Wedding Pro 30 est 80% business / 20% technique, avec un accompagnement jusqu'au 1er contrat. Prix de 297€ à 997€." },
  { q: "Est-ce que je peux payer en plusieurs fois ?", a: "Oui, paiement en 3× sans frais disponible pour toutes les offres." },
  { q: "Y a-t-il un certificat à la fin ?", a: "Oui, un certificat de fin de formation WEDDING PRO 30 est délivré (offres PRO et VIP). Utile pour crédibiliser ton activité." },
  { q: "Et si je ne suis pas satisfaite ?", a: "Garantie satisfait ou remboursé pendant 14 jours sur toutes les offres. Zéro risque." },
  { q: "Les bonus sont-ils vraiment utilisables ?", a: "Oui, tous les templates sont prêts à l'emploi. Tu dupliques, tu adaptes à ta marque, tu vends. 0 effort de création pour toi." },
  { q: "Je travaille encore en salariée, c'est compatible ?", a: "Absolument. 95% de nos élèves démarrent en parallèle de leur job. Le module 2 (statut) explique comment cumuler légalement." },
  { q: "Les mises à jour sont-elles incluses ?", a: "Oui, tu as accès à vie + toutes les mises à jour gratuites (nouvelles tendances, lois, outils)." },
];

// =========================================================
// ANIMATIONS
// =========================================================

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =========================================================
// PAGE
// =========================================================

export default function FormationsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeWeek, setActiveWeek] = useState("SEMAINE 1 — FONDATIONS");

  const weeks = [...new Set(MODULES.map(m => m.week))];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[var(--cream)]">
      {/* Nav simple */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Evenmia" className="h-10" />
          </Link>
          <a href="#offres" className="btn-rose !py-2.5 !px-6 !text-xs">
            Je m&apos;inscris
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold-light)]/10 via-transparent to-transparent" />
        <motion.div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--gold)]/8 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-sm text-[var(--rose-dark)] mb-6 font-medium"
          >
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            Formation certifiante en ligne — 30 jours
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-[var(--text)] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Deviens <span className="text-rose-gradient">wedding planner</span>
            <br />et signe ton 1er contrat en 30 jours
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[var(--text-light)] max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            La seule formation française <strong className="text-[var(--text)]">80% business / 20% technique</strong> qui te donne le métier, les outils et les <strong className="text-[var(--rose-dark)]">clients</strong>. Pas de théorie. Que de l&apos;action.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <a href="#offres" className="btn-rose !py-4 !px-8 text-base inline-flex items-center gap-2">
              Je veux me former
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#modules" className="btn-outline !py-4 !px-8 inline-flex items-center gap-2">
              Voir le programme
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-[var(--border)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--rose)]">500+</p>
              <p className="text-xs text-[var(--text-lighter)] mt-1">Élèves formées</p>
            </div>
            <div className="w-px h-10 bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--rose)]">4,9/5</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" />)}
              </div>
            </div>
            <div className="w-px h-10 bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--rose)]">30j</p>
              <p className="text-xs text-[var(--text-lighter)] mt-1">Programme intensif</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="py-20 px-6 bg-white">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Tu te reconnais ?</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-10">
            Tu veux te lancer, mais...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              "Tu as peur de ne pas être légitime pour facturer",
              "Tu ne sais pas quel statut juridique choisir",
              "Tu ignores comment trouver tes premiers clients",
              "Tu trouves les formations trop chères ou trop théoriques",
              "Tu as peur de rater le jour-J d'un mariage",
              "Tu ne sais pas comment fixer tes tarifs sans te brader",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 bg-[var(--warm)] rounded-xl"
              >
                <X className="w-5 h-5 text-[var(--rose-dark)] shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--text)]">{item}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 text-lg text-[var(--text-light)]">
            <strong className="text-[var(--text)]">C&apos;est normal.</strong> Et c&apos;est exactement pour ça que cette formation existe.
          </p>
        </AnimatedSection>
      </section>

      {/* PROMESSE */}
      <section className="py-20 px-6 relative">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Ma promesse</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-[var(--text)] mb-8 leading-tight">
            En 30 jours, tu auras <span className="text-rose-gradient">tout ce qu&apos;il faut</span> pour signer ton 1er contrat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Award, title: "Le savoir-faire", desc: "De la rencontre client à la coordination jour-J, tu maîtrises chaque étape" },
              { icon: Briefcase, title: "Le business", desc: "Tarification, statut, assurance, marges — tu as une vraie entreprise" },
              { icon: TrendingUp, title: "Les clients", desc: "Instagram, SEO local, scripts de vente — tu sais les attirer et les fermer" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-light p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--gold-light)]/40 to-[var(--rose)]/20 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-[var(--rose-dark)]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text)]">{item.title}</h3>
                <p className="text-sm text-[var(--text-light)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* MODULES */}
      <section id="modules" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Programme détaillé</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              20 modules, <span className="text-rose-gradient">4 semaines intensives</span>
            </h2>
            <p className="text-[var(--text-light)] max-w-xl mx-auto">
              Chaque module = 1h30 de vidéos + exercices pratiques + livrables prêts à l&apos;emploi
            </p>
          </AnimatedSection>

          {/* Tabs semaines */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {weeks.map((w) => (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  activeWeek === w
                    ? "bg-[var(--rose)] text-white shadow-md"
                    : "bg-white border border-[var(--border)] text-[var(--text-light)] hover:border-[var(--rose)]"
                }`}
              >
                {w.split(" — ")[0]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODULES.filter(m => m.week === activeWeek).map((m, i) => (
              <motion.div
                key={m.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-light p-6 flex gap-4"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--rose)] flex items-center justify-center text-white font-bold">
                  {m.num}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text)] mb-1">{m.title}</h3>
                  <p className="text-sm text-[var(--text-light)]">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUS */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--gold)]/5 to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <AnimatedSection className="text-center mb-12">
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">En bonus avec la formation</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              10 bonus exclusifs <span className="text-rose-gradient">(valeur 1 497€)</span>
            </h2>
            <p className="text-[var(--text-light)] max-w-xl mx-auto">
              Templates, scripts, contrats, bases de données — tout ce que j&apos;aurais voulu avoir au démarrage
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BONUS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-light p-5 flex items-start gap-4"
              >
                <div className="shrink-0 w-11 h-11 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[var(--text)] text-sm">{b.title}</h3>
                    <span className="shrink-0 text-xs font-bold text-[var(--rose-dark)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full">{b.value}</span>
                  </div>
                  <p className="text-xs text-[var(--text-light)] leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Elles l&apos;ont fait</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Des résultats <span className="text-rose-gradient">concrets</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-light p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--rose)] flex items-center justify-center text-white font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text)]">{t.name}</p>
                    <p className="text-xs text-[var(--rose-dark)] font-medium">{t.result}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />)}
                </div>
                <p className="text-sm text-[var(--text-light)] leading-relaxed italic">&laquo; {t.text} &raquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section id="offres" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <AnimatedSection className="text-center mb-12">
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Tarifs</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Choisis ton <span className="text-rose-gradient">niveau d&apos;accompagnement</span>
            </h2>
            <p className="text-[var(--text-light)] max-w-xl mx-auto">
              Paiement en 3× sans frais. Garantie 14 jours. Accès à vie.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFERS.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card-light p-8 flex flex-col relative ${
                  o.popular ? "ring-2 ring-[var(--gold)] shadow-xl scale-105" : ""
                }`}
              >
                {o.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--gold)] to-[var(--rose)] text-white text-xs font-bold px-4 py-1 rounded-full">
                    {o.badge}
                  </div>
                )}
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">{o.name}</h3>
                <p className="text-sm text-[var(--text-light)] mb-4">{o.description}</p>
                <div className="mb-6">
                  {o.originalPrice && (
                    <span className="text-lg text-[var(--text-lighter)] line-through mr-2">{o.originalPrice}€</span>
                  )}
                  <span className="text-4xl font-bold text-[var(--rose-dark)]">{o.price}€</span>
                  <p className="text-xs text-[var(--text-lighter)] mt-1">ou 3× {Math.ceil(o.price / 3)}€ sans frais</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {o.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-light)]">
                      <Check className="w-4 h-4 text-[var(--sage)] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${"contact@evenmia.fr"}?subject=Inscription%20${o.name}&body=Bonjour,%20je%20souhaite%20m%27inscrire%20%C3%A0%20l%27offre%20${o.name}.`}
                  className={`text-center py-3.5 rounded-full font-semibold text-sm transition ${
                    o.popular ? "btn-rose" : "btn-outline"
                  }`}
                >
                  {o.cta}
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-10 text-sm text-[var(--text-lighter)]">
            <Shield className="w-4 h-4 inline mr-1" /> Garantie satisfait ou remboursé 14 jours
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Questions fréquentes</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">
              Tes <span className="text-rose-gradient">dernières questions</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="card-light overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-[var(--text)] pr-4">{item.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-[var(--rose)]" />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5 text-sm text-[var(--text-light)] leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--gold)]/10 to-transparent" />
        <AnimatedSection className="max-w-2xl mx-auto text-center relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--rose)] flex items-center justify-center shadow-xl"
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[var(--text)] mb-6">
            Prête à <span className="text-rose-gradient">changer de vie</span> ?
          </h2>
          <p className="text-lg text-[var(--text-light)] mb-10">
            Dans 30 jours tu auras toutes les clés. Dans 6 mois tu vivras de ta passion.
          </p>
          <a href="#offres" className="btn-rose !py-4 !px-10 text-base inline-flex items-center gap-2">
            Je démarre maintenant
            <ArrowRight className="w-5 h-5" />
          </a>
        </AnimatedSection>
      </section>

      {/* Footer simple */}
      <footer className="border-t border-[var(--border)] py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-lighter)]">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Evenmia" className="h-8" />
          </Link>
          <div className="flex gap-6">
            <a href="mailto:contact@evenmia.fr" className="hover:text-[var(--rose)] transition">
              contact@evenmia.fr
            </a>
            <Link href="/mentions-legales" className="hover:text-[var(--rose)] transition">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-[var(--rose)] transition">CGV</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
