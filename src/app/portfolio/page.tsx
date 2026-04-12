"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, Gem, Cake, Baby, Building2, Sparkles } from "lucide-react";
import { config } from "@/lib/config";

const PORTFOLIO_ITEMS = [
  // ── MARIAGES ──
  { id: 1, title: "Table champetre en plein air", category: "mariage", description: "Longue table en bois avec guirlandes lumineuses, fleurs des champs et bougies.", guests: 120, image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&h=500&fit=crop" },
  { id: 2, title: "Arche florale ceremonie", category: "mariage", description: "Arche de ceremonie ornee de roses et eucalyptus dans un jardin.", guests: 80, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=500&fit=crop" },
  { id: 3, title: "Reception au chateau", category: "mariage", description: "Salle de reception elegante dans un chateau du Nord.", guests: 150, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=500&fit=crop" },
  { id: 4, title: "Decoration table de mariage", category: "mariage", description: "Centre de table avec compositions florales, bougies et touches dorees.", guests: 100, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&h=500&fit=crop" },
  { id: 5, title: "Mariage boheme en foret", category: "mariage", description: "Ceremonie en pleine nature, drapes, macrame et pampa.", guests: 60, image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop" },
  { id: 6, title: "Piece montee et desserts", category: "mariage", description: "Wedding cake elegant et buffet de desserts raffines.", guests: 100, image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=500&fit=crop" },
  { id: 7, title: "Premiere danse des maries", category: "mariage", description: "Piste de danse eclairee, moment magique sous les guirlandes.", guests: 130, image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&h=500&fit=crop" },
  { id: 8, title: "Bouquet de la mariee", category: "mariage", description: "Bouquet champetre avec pivoines, roses et feuillage.", guests: 90, image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=500&fit=crop" },
  { id: 9, title: "Cocktail au coucher de soleil", category: "mariage", description: "Vin d'honneur en exterieur avec vue panoramique.", guests: 110, image: "https://images.unsplash.com/photo-1470290378698-263fa7ca60ab?w=800&h=500&fit=crop" },
  { id: 10, title: "Sortie de ceremonie confettis", category: "mariage", description: "Les maries sous une pluie de petales et confettis.", guests: 80, image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=500&fit=crop" },

  // ── BAPTEMES ──
  { id: 11, title: "Sweet table bapteme pastel", category: "bapteme", description: "Table de douceurs en tons rose et blanc avec dragees.", guests: 40, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop" },
  { id: 12, title: "Decoration table boheme", category: "bapteme", description: "Table decoree avec eucalyptus, bougies et tons neutres.", guests: 35, image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=500&fit=crop" },
  { id: 13, title: "Gateau bapteme personnalise", category: "bapteme", description: "Gateau cake design aux couleurs du theme avec le prenom.", guests: 50, image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&h=500&fit=crop" },
  { id: 14, title: "Arche de ballons", category: "bapteme", description: "Arche de ballons pastel a l'entree de la salle.", guests: 45, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop" },
  { id: 15, title: "Candy bar elegant", category: "bapteme", description: "Bar a bonbons et patisseries coordonnees au theme.", guests: 30, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=500&fit=crop" },
  { id: 16, title: "Reception jardin bapteme", category: "bapteme", description: "Reception en plein air avec nappes blanches et fleurs.", guests: 55, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop" },
  { id: 17, title: "Dragees et cadeaux invites", category: "bapteme", description: "Petites boites de dragees personnalisees pour chaque invite.", guests: 40, image: "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800&h=500&fit=crop" },
  { id: 18, title: "Decoration florale douce", category: "bapteme", description: "Compositions florales pastel avec pivoines et hortensias.", guests: 60, image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=500&fit=crop" },
  { id: 19, title: "Photobooth bapteme", category: "bapteme", description: "Coin photo avec cadre personnalise et accessoires.", guests: 35, image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=500&fit=crop" },
  { id: 20, title: "Buffet brunch bapteme", category: "bapteme", description: "Brunch gourmand avec viennoiseries, fruits et jus frais.", guests: 45, image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=500&fit=crop" },

  // ── SEMINAIRES ──
  { id: 21, title: "Team building equipe", category: "seminaire", description: "Activite de cohesion en equipe, ambiance decontractee.", guests: 50, image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=500&fit=crop" },
  { id: 22, title: "Conference presentation", category: "seminaire", description: "Salle de conference avec ecran et eclairage professionnel.", guests: 100, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop" },
  { id: 23, title: "Cocktail networking", category: "seminaire", description: "Cocktail dinatoire dans un lieu atypique pour le networking.", guests: 80, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop" },
  { id: 24, title: "Atelier cuisine equipe", category: "seminaire", description: "Team building culinaire, preparation d'un repas en equipe.", guests: 30, image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=500&fit=crop" },
  { id: 25, title: "Soiree gala entreprise", category: "seminaire", description: "Soiree de gala avec diner assis, discours et animations.", guests: 150, image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=500&fit=crop" },
  { id: 26, title: "Workshop creatif", category: "seminaire", description: "Atelier creatif collaboratif pour stimuler l'innovation.", guests: 25, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop" },
  { id: 27, title: "Olympiades en exterieur", category: "seminaire", description: "Jeux sportifs et defis en equipe en plein air.", guests: 60, image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800&h=500&fit=crop" },
  { id: 28, title: "Salle amenagee branding", category: "seminaire", description: "Espace personnalise aux couleurs de l'entreprise.", guests: 40, image: "https://images.unsplash.com/photo-1431540015159-0f9673be7106?w=800&h=500&fit=crop" },
  { id: 29, title: "Buffet traiteur seminaire", category: "seminaire", description: "Buffet gastronomique pour la pause dejeuner.", guests: 70, image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=500&fit=crop" },
  { id: 30, title: "Photo de groupe equipe", category: "seminaire", description: "Souvenir d'equipe apres une journee de seminaire reussie.", guests: 45, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop" },

  // ── FIANCAILLES ──
  { id: 31, title: "Diner romantique aux bougies", category: "fiancailles", description: "Table intime decoree de bougies et petales de rose.", guests: 2, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop" },
  { id: 32, title: "Demande avec ballons", category: "fiancailles", description: "Mise en scene surprise avec ballons et lettres geantes.", guests: 2, image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=500&fit=crop" },
  { id: 33, title: "Fete de fiancailles chic", category: "fiancailles", description: "Soiree entre proches avec decoration elegante et champagne.", guests: 30, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop" },
  { id: 34, title: "Champagne et celebration", category: "fiancailles", description: "Toast au champagne entre amis pour celebrer la nouvelle.", guests: 20, image: "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=800&h=500&fit=crop" },
  { id: 35, title: "Decoration florale romantique", category: "fiancailles", description: "Compositions de roses rouges et bougies pour l'ambiance.", guests: 25, image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=500&fit=crop" },
  { id: 36, title: "Brunch de fiancailles", category: "fiancailles", description: "Brunch convivial du lendemain avec les familles.", guests: 15, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=500&fit=crop" },
  { id: 37, title: "Photoshoot couple", category: "fiancailles", description: "Seance photo en couple pour immortaliser le moment.", guests: 2, image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=500&fit=crop" },
  { id: 38, title: "Soiree surprise rooftop", category: "fiancailles", description: "Fete surprise sur un rooftop avec vue panoramique.", guests: 40, image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=500&fit=crop" },
  { id: 39, title: "Gateau de fiancailles", category: "fiancailles", description: "Gateau personnalise avec les prenoms des fiances.", guests: 25, image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=500&fit=crop" },
  { id: 40, title: "Decoration guirlandes lumineuses", category: "fiancailles", description: "Jardin illumine de guirlandes pour une soiree magique.", guests: 35, image: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&h=500&fit=crop" },

  // ── ANNIVERSAIRES ──
  { id: 41, title: "Fete 30 ans doree", category: "anniversaire", description: "Decoration doree et noire pour un anniversaire chic.", guests: 60, image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop" },
  { id: 42, title: "Gateau d'anniversaire", category: "anniversaire", description: "Gateau spectaculaire avec bougies et decoration sur-mesure.", guests: 40, image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&h=500&fit=crop" },
  { id: 43, title: "Fete enfant chateau gonflable", category: "anniversaire", description: "Anniversaire enfant avec jeux, ballons et animations.", guests: 20, image: "https://images.unsplash.com/photo-1587736908048-5ecdff0c15a9?w=800&h=500&fit=crop" },
  { id: 44, title: "Soiree DJ et dancefloor", category: "anniversaire", description: "Piste de danse avec DJ et jeux de lumieres.", guests: 80, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop" },
  { id: 45, title: "Garden party anniversaire", category: "anniversaire", description: "Fete en plein air avec buffet, guirlandes et jeux.", guests: 50, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop" },
  { id: 46, title: "Bar a cocktails anime", category: "anniversaire", description: "Barman professionnel preparant des cocktails personnalises.", guests: 45, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=500&fit=crop" },
  { id: 47, title: "Photobooth anniversaire", category: "anniversaire", description: "Coin photo avec accessoires fun et tirage instantane.", guests: 55, image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=500&fit=crop" },
  { id: 48, title: "Decoration ballons luxe", category: "anniversaire", description: "Arche de ballons metalliques dores et blancs.", guests: 35, image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=500&fit=crop" },
  { id: 49, title: "Sweet table anniversaire", category: "anniversaire", description: "Table de desserts avec cupcakes, macarons et cake pops.", guests: 30, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=500&fit=crop" },
  { id: 50, title: "Fete surprise decoration", category: "anniversaire", description: "Salle decoree pour une fete surprise inoubliable.", guests: 40, image: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=800&h=500&fit=crop" },

  // ── BABY SHOWERS ──
  { id: 51, title: "Sweet table rose et doree", category: "baby-shower", description: "Bar a douceurs en rose et or avec cupcakes et cookies.", guests: 20, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop" },
  { id: 52, title: "Ballons gender reveal", category: "baby-shower", description: "Ballons roses et bleus pour la revelation du sexe de bebe.", guests: 25, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop" },
  { id: 53, title: "Decoration nuages et etoiles", category: "baby-shower", description: "Theme celeste avec nuages en coton et etoiles dorees.", guests: 15, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=500&fit=crop" },
  { id: 54, title: "Brunch baby shower", category: "baby-shower", description: "Brunch gourmand entre amies avec patisseries et jus frais.", guests: 12, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=500&fit=crop" },
  { id: 55, title: "Arbre a voeux bebe", category: "baby-shower", description: "Arbre ou chaque invitee accroche un voeu pour bebe.", guests: 20, image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=500&fit=crop" },
  { id: 56, title: "Jeux baby shower", category: "baby-shower", description: "Animations et jeux entre amies pour celebrer la future maman.", guests: 18, image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=500&fit=crop" },
  { id: 57, title: "Cadeaux et ouverture", category: "baby-shower", description: "Moment d'ouverture des cadeaux avec la future maman.", guests: 15, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=500&fit=crop" },
  { id: 58, title: "Gateau baby shower", category: "baby-shower", description: "Gateau pastel decore avec des motifs bebe.", guests: 20, image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&h=500&fit=crop" },
  { id: 59, title: "Decoration boheme bebe", category: "baby-shower", description: "Ambiance boheme avec pampa, macrame et tons neutres.", guests: 22, image: "https://images.unsplash.com/photo-1464349153159-4e5e1927e836?w=800&h=500&fit=crop" },
  { id: 60, title: "Coin photo baby shower", category: "baby-shower", description: "Backdrop decore pour des photos souvenirs entre amies.", guests: 16, image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=500&fit=crop" },
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
          <p className="text-[var(--text-light)] mb-6">Votre evenement pourrait etre le prochain !</p>
          <Link href="/devis" className="btn-rose inline-flex items-center gap-2">
            Demander un devis gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
