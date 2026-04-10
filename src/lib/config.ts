// Configuration Evenmia — Organisation d'evenements

export const config = {
  // Identite
  brand: "Evenmia",
  brandShort: "EVENMIA",
  tagline: "Votre organisatrice d'evenements sur-mesure",
  city: "Arras",
  region: "Hauts-de-France",
  department: "Pas-de-Calais",
  postalCode: "62000",

  // Contact
  phone: process.env.NEXT_PUBLIC_PHONE || "06 00 00 00 00",
  phoneIntl: process.env.NEXT_PUBLIC_PHONE_INTL || "+33600000000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "33600000000",
  email: "contact@evenmia.fr",
  instagram: "https://instagram.com/evenmia",

  // Frais de deplacement
  pricePerKm: 0.55,
  freeKmRadius: 20,

  // Zones
  zones: ["Arras", "Lens", "Douai", "Bethune", "Cambrai", "Lille", "Valenciennes", "Henin-Beaumont"],

  // Domaine
  domain: "evenmia.fr",

  // Couleurs
  colorPrimary: "#D4A.574",
  colorAccent: "#8B7355",
  colorSage: "#9CAF88",
} as const;

// Types d'evenements
export const EVENT_TYPES = [
  { id: "mariage", label: "Mariage", icon: "Heart", description: "Le plus beau jour de votre vie, organise dans les moindres details" },
  { id: "fiancailles", label: "Fiancailles", icon: "Gem", description: "Une demande ou une fete de fiancailles inoubliable" },
  { id: "anniversaire", label: "Anniversaire", icon: "Cake", description: "Fetes d'anniversaire pour enfants et adultes" },
  { id: "bapteme", label: "Bapteme", icon: "Baby", description: "Un moment sacre celebre avec elegance" },
  { id: "baby-shower", label: "Baby Shower", icon: "Gift", description: "Celebrez l'arrivee de bebe avec style" },
  { id: "seminaire", label: "Seminaire / CE", icon: "Building2", description: "Evenements d'entreprise, team building, comites d'entreprise" },
  { id: "autre", label: "Autre evenement", icon: "Sparkles", description: "Retraite, pot de depart, garden party, soiree privee..." },
] as const;

// Forfaits / Formules
export const FORMULAS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: "A partir de 500",
    description: "Coordination jour-J",
    popular: false,
    features: [
      "Planification du retroplanning",
      "Coordination le jour-J (8h)",
      "Gestion des prestataires",
      "Reperage du lieu",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "A partir de 1 200",
    description: "Organisation partielle",
    features: [
      "Tout l'Essentiel +",
      "Recherche et selection des prestataires",
      "Decoration et mise en place",
      "2 rendez-vous de suivi",
      "Coordination jour-J (12h)",
    ],
    popular: true,
  },
  {
    id: "sur-mesure",
    name: "Sur-mesure",
    price: "Sur devis",
    description: "Organisation complete de A a Z",
    popular: false,
    features: [
      "Tout le Premium +",
      "Conception complete du theme et design",
      "Gestion du budget",
      "Rendez-vous illimites",
      "Coordination jour-J complete",
      "Gestion des invitations et RSVP",
      "Accompagnement de 6 a 12 mois",
    ],
  },
] as const;

// Services additionnels
export const SERVICES = [
  { id: "decoration", label: "Decoration & scenographie", price: "Sur devis" },
  { id: "traiteur", label: "Recherche traiteur", price: "Inclus Premium+" },
  { id: "photo", label: "Recherche photographe/videaste", price: "Inclus Premium+" },
  { id: "animation", label: "Animation & DJ", price: "Sur devis" },
  { id: "fleurs", label: "Compositions florales", price: "Sur devis" },
  { id: "faire-part", label: "Faire-part & papeterie", price: "Sur devis" },
  { id: "lieu", label: "Recherche de lieu", price: "Inclus Premium+" },
  { id: "candy-bar", label: "Candy bar & sweet table", price: "A partir de 150€" },
] as const;

export type EventType = typeof EVENT_TYPES[number]["id"];
export type FormulaId = typeof FORMULAS[number]["id"];
