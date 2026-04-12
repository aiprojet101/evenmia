"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, Gem, Cake, Baby, Gift, Sparkles } from "lucide-react";
import { config } from "@/lib/config";

const PORTFOLIO_ITEMS = [
  // ── PHOTOS PERSO D'ANAÏS ──
  { id: 101, title: "Anniversaire Louis", category: "anniversaire", description: "Décoration sur-mesure imaginée et réalisée par Anaïs.", guests: 25, image: "/anais-décorations/anniversaire-louis.png" },
  { id: 102, title: "Gâteau de Louna", category: "anniversaire", description: "Gâteau personnalisé pour l'anniversaire de Louna.", guests: 20, image: "/anais-décorations/anniversaire-louna-gateau.png" },
  { id: 103, title: "Déco nature & bois — Louna", category: "anniversaire", description: "Anniversaire aux tons naturels, bois et végétal.", guests: 20, image: "/anais-décorations/anniversaire-louna-nature.png" },
  { id: 104, title: "Baby Shower — Sophie & Hugues", category: "baby-shower", description: "Baby shower intimiste avec décoration entièrement faite main.", guests: 15, image: "/anais-décorations/baby-shower-sophie-hugue.png" },
  { id: 105, title: "Baptême de Louis", category: "baptême", description: "Baptême élégant avec décoration sur-mesure.", guests: 40, image: "/anais-décorations/baptême-louis.png" },
  { id: 106, title: "Confection de dragées — Baptême Louis", category: "baptême", description: "Dragées faites main, emballage personnalisé pour chaque invité.", guests: 40, image: "/anais-décorations/dragees-baptême-louis.png" },
  { id: 107, title: "Table aux bougies mauves", category: "mariage", description: "Décoration de table avec bougies et tons mauves pour un repas.", guests: 30, image: "/anais-décorations/table-bougies-mauve.png" },

  // ── MARIAGES ──
  { id: 1, title: "Table champêtre en plein air", category: "mariage", description: "Longue table en bois avec guirlandes lumineuses, fleurs des champs et bougies.", guests: 120, image: "https://ai-toolkit-generations.imgix.net/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__9/image-31b30a1a-1273-429f-8e53-3b256a9f5a41.png?auto=format%2Ccompress&cs=srgb&w=1440&fit=max&s=1a801ae694b005dc433f776392c52980" },
  { id: 2, title: "Arche florale de cérémonie", category: "mariage", description: "Arche de cérémonie ornée de roses et eucalyptus dans un jardin.", guests: 80, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=500&fit=crop" },
  { id: 3, title: "Réception au château", category: "mariage", description: "Salle de réception élégante dans un château du Nord.", guests: 150, image: "/portfolio/mariage-chateau.png" },
  { id: 4, title: "Décoration table de mariage", category: "mariage", description: "Centre de table avec compositions florales, bougies et touches dorées.", guests: 100, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&h=500&fit=crop" },
  { id: 5, title: "Mariage bohème en forêt", category: "mariage", description: "Cérémonie en pleine nature, drapés, macramé et pampa.", guests: 60, image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop" },
  { id: 6, title: "Pièce montée et desserts", category: "mariage", description: "Wedding cake élégant et buffet de desserts raffinés.", guests: 100, image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=500&fit=crop" },
  { id: 7, title: "Première danse des mariés", category: "mariage", description: "Piste de danse éclairée, moment magique sous les guirlandes.", guests: 130, image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&h=500&fit=crop" },
  { id: 8, title: "Bouquet de la mariée", category: "mariage", description: "Bouquet champêtre avec pivoines, roses et feuillage.", guests: 90, image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=500&fit=crop" },
  { id: 10, title: "Sortie de cérémonie — confettis", category: "mariage", description: "Les mariés sous une pluie de pétales et confettis.", guests: 80, image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=500&fit=crop" },

  // ── BAPTÊMES ──
  { id: 14, title: "Arche de ballons", category: "baptême", description: "Arche de ballons pastel à l'entrée de la salle.", guests: 45, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop" },
  { id: 16, title: "Réception jardin baptême", category: "baptême", description: "Réception en plein air avec nappes blanches et fleurs.", guests: 55, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop" },
  { id: 18, title: "Décoration florale douce", category: "baptême", description: "Compositions florales pastel avec pivoines et hortensias.", guests: 60, image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=500&fit=crop" },

  // ── FIANÇAILLES ──
  { id: 34, title: "Champagne et célébration", category: "fiançailles", description: "Toast au champagne entre amis pour célébrer la nouvelle.", guests: 20, image: "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=800&h=500&fit=crop" },
  { id: 37, title: "Photoshoot couple", category: "fiançailles", description: "Séance photo en couple pour immortaliser le moment.", guests: 2, image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=500&fit=crop" },
  { id: 40, title: "Décoration guirlandes lumineuses", category: "fiançailles", description: "Jardin illuminé de guirlandes pour une soirée magique.", guests: 35, image: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&h=500&fit=crop" },

  // ── ANNIVERSAIRES ──
  { id: 46, title: "Bar à cocktails animé", category: "anniversaire", description: "Barman professionnel préparant des cocktails personnalisés.", guests: 45, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=500&fit=crop" },
  { id: 50, title: "Fête surprise décoration", category: "anniversaire", description: "Salle décorée pour une fête surprise inoubliable.", guests: 40, image: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=800&h=500&fit=crop" },

  // ── BABY SHOWERS ──
  { id: 54, title: "Brunch baby shower", category: "baby-shower", description: "Brunch gourmand entre amies avec pâtisseries et jus frais.", guests: 12, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=500&fit=crop" },
  { id: 57, title: "Cadeaux et ouverture", category: "baby-shower", description: "Moment d'ouverture des cadeaux avec la future maman.", guests: 15, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=500&fit=crop" },
  { id: 59, title: "Décoration bohème bébé", category: "baby-shower", description: "Ambiance bohème avec pampa, macramé et tons neutres.", guests: 22, image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=500&fit=crop" },
];

const CATEGORIES = [
  { id: "tous", label: "Tous", icon: Sparkles },
  { id: "mariage", label: "Mariages", icon: Heart },
  { id: "fiançailles", label: "Fiançailles", icon: Gem },
  { id: "anniversaire", label: "Anniversaires", icon: Cake },
  { id: "baptême", label: "Baptêmes", icon: Baby },
  { id: "baby-shower", label: "Baby Showers", icon: Gift },
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
            Chaque événement est unique. découvrez quelques-unes de nos créations.
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
              <div className="h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
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
          <p className="text-[var(--text-light)] mb-6">Votre événement pourrait être le prochain !</p>
          <Link href="/devis" className="btn-rose inline-flex items-center gap-2">
            Demander un devis gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
