"use client";

import Link from "next/link";
import {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
  ArrowRight, Phone, Star, ChevronRight, Check,
  Mail, MapPin, Clock, Users, Palette,
} from "lucide-react";
import { config, EVENT_TYPES, FORMULAS, SERVICES } from "@/lib/config";

const TESTIMONIALS = [
  { name: "Sophie L.", text: "Anais a transforme notre mariage en un reve eveille. Chaque detail etait parfait, du premier rendez-vous jusqu'a la derniere danse.", stars: 5, tag: "Mariage" },
  { name: "Julie & Marc", text: "Un bapteme magnifique organise en un mois seulement. Decoration sublime, coordination impeccable. On recommande a 200% !", stars: 5, tag: "Bapteme" },
  { name: "Thomas R.", text: "Seminaire de 80 personnes gere sans stress. Nos collaborateurs en parlent encore. Merci Evenmia !", stars: 5, tag: "Seminaire CE" },
  { name: "Camille D.", text: "Ma baby shower etait absolument magique. Anais a su capter exactement l'ambiance que je voulais.", stars: 5, tag: "Baby Shower" },
];

const STEPS = [
  { num: "01", title: "Racontez-nous", desc: "Decrivez votre evenement ideal via notre formulaire de devis en ligne", icon: Heart },
  { num: "02", title: "On imagine ensemble", desc: "Rendez-vous pour affiner votre vision, budget et envies", icon: Palette },
  { num: "03", title: "On s'occupe de tout", desc: "Organisation, coordination, decoration — profitez de votre journee", icon: Sparkles },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Gem, Cake, Baby, Gift, Building2, Sparkles,
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--rose-dark)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--text)]">{config.brand}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href={`tel:${config.phoneIntl}`} className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-light)] hover:text-[var(--rose)] transition">
              <Phone className="w-4 h-4" />
              {config.phone}
            </a>
            <Link href="/devis" className="btn-rose !py-2.5 !px-6 !text-xs">
              Devis gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--rose)]/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--rose)]/8 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--rose)]/10 border border-[var(--rose)]/20 text-sm text-[var(--rose-dark)] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Organisation d'evenements — {config.city} & {config.region}
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] animate-fade-in-up animate-delay-1 text-[var(--text)]">
            Vos evenements
            <br />
            <span className="text-rose-gradient">sur-mesure</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-[var(--text-light)] max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-2">
            Mariages, fiancailles, anniversaires, baptemes, seminaires...
            <br className="hidden sm:block" />
            Chaque moment merite d'etre inoubliable. On s'occupe de tout.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-3">
            <Link href="/devis" className="btn-rose flex items-center gap-2 text-base !py-4 !px-8">
              Demander un devis gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={`tel:${config.phoneIntl}`} className="btn-outline flex items-center gap-2 !py-4 !px-8">
              <Phone className="w-4 h-4" />
              Appeler
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-6 sm:gap-10 animate-fade-in-up animate-delay-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--rose)]">5.0</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-[var(--rose)] fill-[var(--rose)]" />)}
              </div>
              <p className="text-xs text-[var(--text-lighter)] mt-1">Google</p>
            </div>
            <div className="w-px h-10 bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text)]">50+</p>
              <p className="text-xs text-[var(--text-lighter)] mt-1">Evenements</p>
            </div>
            <div className="w-px h-10 bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text)]">100%</p>
              <p className="text-xs text-[var(--text-lighter)] mt-1">Sur-mesure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Nos specialites</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--text)]">
            Chaque evenement est <span className="text-rose-gradient">unique</span>
          </h2>
          <p className="text-center text-[var(--text-light)] mb-16 max-w-lg mx-auto">
            Particuliers ou entreprises, nous donnons vie a vos projets.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENT_TYPES.slice(0, 8).map((evt) => {
              const Icon = ICON_MAP[evt.icon] || Sparkles;
              return (
                <Link
                  key={evt.id}
                  href={`/devis?type=${evt.id}`}
                  className="group card-light p-6 hover:bg-white transition-all duration-300"
                >
                  <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--rose)]/10 group-hover:bg-[var(--rose)]/20 flex items-center justify-center transition">
                    <Icon className="w-5 h-5 text-[var(--rose)]" />
                  </div>
                  <h3 className="font-semibold mb-1.5 text-[var(--text)]">{evt.label}</h3>
                  <p className="text-sm text-[var(--text-light)] leading-relaxed">{evt.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Comment ca marche</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[var(--text)]">
            Votre evenement en <span className="text-rose-gradient">3 etapes</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative group text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--rose)]/10 to-[var(--sage)]/10 flex items-center justify-center group-hover:from-[var(--rose)]/20 group-hover:to-[var(--sage)]/20 transition">
                  <s.icon className="w-7 h-7 text-[var(--rose)]" />
                </div>
                <div className="text-5xl font-black text-[var(--rose)]/10 absolute -top-2 left-1/2 -translate-x-1/2">{s.num}</div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text)]">{s.title}</h3>
                <p className="text-[var(--text-light)] text-sm leading-relaxed">{s.desc}</p>
                {i < 2 && <div className="hidden sm:block absolute top-8 -right-4 text-[var(--border)]"><ChevronRight className="w-6 h-6" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulas / Pricing */}
      <section id="tarifs" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Nos formules</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--text)]">
            Une formule pour chaque <span className="text-rose-gradient">besoin</span>
          </h2>
          <p className="text-center text-[var(--text-light)] mb-16 max-w-lg mx-auto">
            Du jour-J a l'organisation complete, choisissez votre niveau d'accompagnement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMULAS.map((f) => (
              <div
                key={f.id}
                className={`card-light p-8 flex flex-col relative ${
                  f.popular ? "ring-2 ring-[var(--rose)] shadow-lg" : ""
                }`}
              >
                {f.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--rose)] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                <h3 className="text-xl font-bold text-[var(--text)] mb-1">{f.name}</h3>
                <p className="text-sm text-[var(--text-light)] mb-4">{f.description}</p>
                <p className="text-2xl font-bold text-[var(--rose)] mb-6">{f.price}€</p>
                <ul className="space-y-3 flex-1">
                  {f.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-[var(--text-light)]">
                      <Check className="w-4 h-4 text-[var(--sage)] shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/devis?formule=${f.id}`}
                  className={`mt-8 text-center py-3 rounded-full font-semibold text-sm transition ${
                    f.popular
                      ? "btn-rose"
                      : "btn-outline"
                  }`}
                >
                  Demander un devis
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-[var(--text-lighter)]">
            Frais de deplacement : {config.pricePerKm}€/km au-dela de {config.freeKmRadius}km (calcul automatique dans le devis)
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Services</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[var(--text)]">
            Tout pour un evenement <span className="text-rose-gradient">parfait</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <div key={s.id} className="card-light p-5 flex items-center justify-between">
                <span className="font-medium text-sm text-[var(--text)]">{s.label}</span>
                <span className="text-xs text-[var(--rose-dark)] font-medium whitespace-nowrap ml-2">{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest text-center mb-3">Temoignages</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[var(--text)]">
            Ils nous font <span className="text-rose-gradient">confiance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-light p-6 flex flex-col">
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[var(--rose)] fill-[var(--rose)]" />
                  ))}
                </div>
                <span className="text-xs text-[var(--rose-dark)]/60 mb-3">{t.tag}</span>
                <p className="text-[var(--text-light)] text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-medium text-[var(--text-lighter)] mt-4">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--rose)]/5 to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--rose)] to-[var(--rose-dark)] flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-[var(--text)]">
            Pret a creer un moment <span className="text-rose-gradient">magique</span> ?
          </h2>
          <p className="text-[var(--text-light)] mb-10 text-lg">Devis gratuit en 2 minutes. Reponse sous 24h.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/devis" className="btn-rose flex items-center gap-2 text-base !py-4 !px-8">
              Commencer mon devis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={`tel:${config.phoneIntl}`} className="btn-outline flex items-center gap-2 !py-4 !px-8">
              <Phone className="w-4 h-4" />
              {config.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--rose-dark)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-[var(--text)]">{config.brand}</span>
                <p className="text-xs text-[var(--text-lighter)]">Organisation d'evenements — {config.city} & {config.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--text-light)]">
              <a href={`tel:${config.phoneIntl}`} className="hover:text-[var(--rose)] transition flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {config.phone}
              </a>
              <a href={`mailto:${config.email}`} className="hover:text-[var(--rose)] transition flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {config.email}
              </a>
              <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--rose)] transition text-sm">
                Instagram
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-lighter)]">
            <span>&copy; {new Date().getFullYear()} {config.brand} — Tous droits reserves</span>
            <div className="flex gap-4">
              <Link href="/mentions-legales" className="hover:text-[var(--text-light)] transition">Mentions legales</Link>
              <Link href="/cgv" className="hover:text-[var(--text-light)] transition">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
