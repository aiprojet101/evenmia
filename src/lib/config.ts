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

// Types d'événements (première question du devis)
export const EVENT_TYPES = [
  { id: "mariage", label: "Mariage", icon: "Heart", description: "Le plus beau jour de votre vie, sublimé par une décoration sur-mesure" },
  { id: "fiancailles", label: "Fiançailles", icon: "Gem", description: "Une demande ou une fête de fiançailles inoubliable" },
  { id: "anniversaire", label: "Anniversaire", icon: "Cake", description: "Fêtes d'anniversaire pour enfants et adultes" },
  { id: "bapteme", label: "Baptême", icon: "Baby", description: "Un moment sacré célébré avec élégance" },
  { id: "baby-shower", label: "Baby Shower", icon: "Gift", description: "Célébrez l'arrivée de bébé avec style" },
  { id: "autre", label: "Autre événement", icon: "Sparkles", description: "Retraite, pot de départ, garden party, soirée privée..." },
] as const;

// Prestations d'Anaïs (section page d'accueil)
export const PRESTATIONS = [
  { id: "decoration", label: "Décoration", icon: "Palette", description: "Arches de ballons, centres de table, back-drop, sweet table, mur de fleurs... Je conçois votre décoration sur-mesure." },
  { id: "mise-en-place", label: "Mise en place le jour-J", icon: "Sparkles", description: "Je viens, j'installe tout ce que vous avez choisi, je repars. Vous profitez pleinement de votre événement." },
  { id: "vaisselle", label: "Vaisselle jetable décorative", icon: "UtensilsCrossed", description: "Assiettes, serviettes, gobelets, couverts assortis au thème : princesse, safari, baptême, mariage, baby..." },
  { id: "faire-part", label: "Faire-part & papeterie", icon: "Mail", description: "Save the date, faire-part, menus, marque-places... créés à la main avec finitions dorure, gaufrage, cire." },
  { id: "dragees", label: "Dragées", icon: "Gift", description: "Dragées parfumées dans des emballages personnalisés : boîtes, sachets organza, pots en verre, cornets en tissu." },
  { id: "goodies", label: "Goodies invités", icon: "Heart", description: "Bougies, savons, chocolats, mini bouteilles, photos polaroïd... des cadeaux personnalisés pour vos invités." },
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
