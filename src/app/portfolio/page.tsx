"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, Gem, Cake, Baby, Building2, Sparkles } from "lucide-react";
import { config } from "@/lib/config";

// Placeholder portfolio items — will be replaced with real photos
const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Mariage champetre — Lea & Thomas",
    category: "mariage",
    description: "Un mariage en plein air dans un domaine du Pas-de-Calais. 120 invites, decoration florale, tons pastel et bois naturel.",
    guests: 120,
    color: "from-[var(--rose)]/20 to-[var(--sage)]/20",
  },
  {
    id: 2,
    title: "Bapteme boheme — Petit Louis",
    category: "bapteme",
    description: "Bapteme intimiste de 40 personnes. Arche fleurie, sweet table, tons beige et eucalyptus.",
    guests: 40,
    color: "from-[var(--sage)]/20 to-[var(--cream)]",
  },
  {
    id: 3,
    title: "Seminaire team building — TechCorp",
    category: "seminaire",
    description: "Journee seminaire pour 80 collaborateurs. Ateliers, cocktail, soiree de gala.",
    guests: 80,
    color: "from-[var(--rose-dark)]/10 to-[var(--rose)]/10",
  },
  {
    id: 4,
    title: "Fiancailles surprise — Clara & Hugo",
    category: "fiancailles",
    description: "Soiree surprise pour 30 proches. Decoration elegante, photobooth, gateau personnalise.",
    guests: 30,
    color: "from-[var(--rose)]/15 to-[var(--rose-light)]/15",
  },
  {
    id: 5,
    title: "Anniversaire 30 ans — Sophie",
    category: "anniversaire",
    description: "Fete d'anniversaire festive pour 60 invites. Theme dore, DJ, animations.",
    guests: 60,
    color: "from-[var(--rose-light)]/20 to-[var(--sage-light)]/20",
  },
  {
    id: 6,
    title: "Baby shower — Bienvenue bebe Emma",
    category: "baby-shower",
    description: "Apres-midi douceur entre amies. Candy bar, jeux, decoration rose et dore.",
    guests: 25,
    color: "from-[var(--rose)]/10 to-[var(--cream)]",
  },
];

const CATEGORIES = [
  { id: "tous", label: "Tous", icon: Sparkles },
  { id: "mariage", label: "Mariages", icon: Heart },
  { id: "fiancailles", label: "Fiancailles", icon: Gem },
  { id: "anniversaire", label: "Anniversaires", icon: Cake },
  { id: "bapteme", label: "Baptemes", icon: Baby },
  { id: "seminaire", label: "Seminaires", icon: Building2 },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("tous");

  const filtered = activeCategory === "tous"
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--text)] transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <span className="text-rose-gradient font-bold">{config.brand}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
            Nos <span className="text-rose-gradient">realisations</span>
          </h1>
          <p className="text-[var(--text-light)] max-w-lg mx-auto">
            Chaque evenement est unique. Decouvrez quelques-unes de nos creations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat.id
                  ? "bg-[var(--rose)] text-white"
                  : "bg-white border border-[var(--border)] text-[var(--text-light)] hover:border-[var(--rose)]"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="card-light overflow-hidden group">
              {/* Placeholder image */}
              <div className={`h-56 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <div className="text-center">
                  <Sparkles className="w-10 h-10 text-[var(--rose)]/40 mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-lighter)]">Photo a venir</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-[var(--rose)]/10 text-[var(--rose-dark)] px-3 py-1 rounded-full capitalize">
                    {item.category}
                  </span>
                  <span className="text-xs text-[var(--text-lighter)]">{item.guests} invites</span>
                </div>
                <h3 className="font-bold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-light)] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-[var(--text-light)] mb-6">Votre evenement pourrait etre le prochain !</p>
          <Link href="/devis" className="btn-rose inline-flex items-center gap-2">
            Demander un devis gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
