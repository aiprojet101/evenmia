// Configuration Evenmia — Organisation d'événements

export const config = {
  // Identite
  brand: "Evenmia",
  brandShort: "EVENMIA",
  tagline: "Décoration, faire-part & goodies sur-mesure",
  city: "Arras",
  region: "Hauts-de-France",
  department: "Pas-de-Calais",
  postalCode: "62000",

  // Contact
  phone: "07 82 40 09 39",
  phoneIntl: "+33782400939",
  whatsapp: "33782400939",
  email: "contact@evenmia.fr",
  instagram: "https://instagram.com/evenmia",

  // Frais de déplacement
  pricePerKm: 0.55,
  freeKmRadius: 20,

  // Zones
  zones: ["Arras", "Lens", "Douai", "Béthune", "Cambrai", "Lille", "Valenciennes", "Hénin-Beaumont"],

  // Domaine
  domain: "evenmia.fr",

  // Couleurs
  colorPrimary: "#D4A.574",
  colorAccent: "#8B7355",
  colorSage: "#9CAF88",
} as const;

// Prestations d'Anaïs
export const EVENT_TYPES = [
  { id: "decoration", label: "Décoration", icon: "Palette", description: "Conception et réalisation de décorations sur-mesure pour votre événement" },
  { id: "mise-en-place", label: "Mise en place", icon: "Sparkles", description: "Installation complète de votre décoration le jour-J" },
  { id: "faire-part", label: "Faire-part", icon: "Mail", description: "Faire-part, menus, marque-places et papeterie personnalisée" },
  { id: "dragees", label: "Dragées", icon: "Gift", description: "Dragées faites main dans des emballages personnalisés" },
  { id: "goodies", label: "Goodies & cadeaux invités", icon: "Heart", description: "Petits cadeaux personnalisés pour remercier vos invités" },
] as const;

// Forfaits / Formules
export const FORMULAS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: "À partir de 500",
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
    price: "À partir de 1 200",
    description: "Organisation partielle",
    features: [
      "Tout l'Essentiel +",
      "Recherche et sélection des prestataires",
      "Décoration et mise en place",
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
      "Accompagnement de 6 à 12 mois",
    ],
  },
] as const;

// Services additionnels
export const SERVICES = [
  { id: "decoration", label: "Décoration & scénographie", price: "Sur devis" },
  { id: "traiteur", label: "Recherche traiteur", price: "Inclus Premium+" },
  { id: "photo", label: "Recherche photographe/vidéaste", price: "Inclus Premium+" },
  { id: "animation", label: "Animation & DJ", price: "Sur devis" },
  { id: "fleurs", label: "Compositions florales", price: "Sur devis" },
  { id: "faire-part", label: "Faire-part & papeterie", price: "Sur devis" },
  { id: "lieu", label: "Recherche de lieu", price: "Inclus Premium+" },
  { id: "candy-bar", label: "Candy bar & sweet table", price: "À partir de 150€" },
] as const;

export type EventType = typeof EVENT_TYPES[number]["id"];
export type FormulaId = typeof FORMULAS[number]["id"];
