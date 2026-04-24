// Questionnaire Evenmia — Prestations d'Anaïs (décoration, mise en place, faire-part, dragées, goodies)

export interface QuestionOption {
  id: string;
  label: string;
  emoji?: string;
  price?: number;
  pricePerPerson?: number;
  priceNote?: string;
  showIf?: string;
}

export interface QuestionStep {
  id: string;
  question: string;
  subtitle?: string;
  type: "single" | "multi" | "slider" | "date" | "text" | "boolean" | "textarea";
  options?: QuestionOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderUnit?: string;
  required?: boolean;
  showIf?: (answers: Record<string, unknown>) => boolean;
  autoAdvance?: boolean;
  dynamicRange?: (answers: Record<string, unknown>) => { min: number; max: number };
}

// Helper : est-ce qu'une prestation est cochée ?
const hasPresta = (answers: Record<string, unknown>, id: string) =>
  Array.isArray(answers.prestations) && (answers.prestations as string[]).includes(id);

// =============================================================================
// QUESTIONS COMMUNES (début du parcours)
// =============================================================================

const COMMON_START: QuestionStep[] = [
  {
    id: "prestations",
    question: "Quelles prestations souhaitez-vous ?",
    subtitle: "Cochez tout ce qui vous intéresse (plusieurs choix possibles)",
    type: "multi",
    required: true,
    options: [
      { id: "decoration", label: "Décoration complète", emoji: "🎨" },
      { id: "mise-en-place", label: "Mise en place le jour-J", emoji: "✨" },
      { id: "vaisselle", label: "Vaisselle jetable décorative", emoji: "🍽️" },
      { id: "faire-part", label: "Faire-part & papeterie", emoji: "💌" },
      { id: "dragees", label: "Dragées", emoji: "🍬" },
      { id: "goodies", label: "Goodies & cadeaux invités", emoji: "🎁" },
    ],
  },
  {
    id: "invites",
    question: "Combien d'invités ?",
    subtitle: "Une estimation suffit",
    type: "slider",
    sliderMin: 10,
    sliderMax: 300,
    sliderStep: 5,
    sliderUnit: "invités",
  },
];

// =============================================================================
// DÉCORATION
// =============================================================================

const DECO_STEPS: QuestionStep[] = [
  {
    id: "deco_style",
    question: "Quel style de décoration ?",
    subtitle: "L'ambiance qui vous fait rêver",
    type: "single",
    autoAdvance: true,
    showIf: (a) => hasPresta(a, "decoration"),
    options: [
      { id: "romantique", label: "Romantique", emoji: "🌸" },
      { id: "boheme", label: "Bohème", emoji: "🌾" },
      { id: "champetre", label: "Champêtre", emoji: "🌻" },
      { id: "chic", label: "Chic & élégant", emoji: "✨" },
      { id: "moderne", label: "Moderne / Minimaliste", emoji: "🖤" },
      { id: "pastel", label: "Pastel / Candy", emoji: "🎀" },
      { id: "festif", label: "Festif & paillettes", emoji: "🎉" },
      { id: "theme", label: "Thème spécifique", emoji: "🎭" },
    ],
  },
  {
    id: "deco_arches",
    question: "Quel type d'arche souhaitez-vous ?",
    subtitle: "Plusieurs choix possibles",
    type: "multi",
    showIf: (a) => hasPresta(a, "decoration"),
    options: [
      { id: "ballons-classique", label: "Arche de ballons classique", emoji: "🎈" },
      { id: "ballons-organique", label: "Arche de ballons organique", emoji: "🎈" },
      { id: "ballons-halo", label: "Arche halo / cercle", emoji: "⭕" },
      { id: "colonnes", label: "Colonnes de ballons", emoji: "🎋" },
      { id: "florale", label: "Arche florale (fraîche ou séchée)", emoji: "🌺" },
      { id: "vegetale", label: "Arche végétale (eucalyptus, olivier)", emoji: "🌿" },
      { id: "bois", label: "Arche en bois / bambou", emoji: "🪵" },
      { id: "tulle", label: "Arche drapée (tulle, voile)", emoji: "🎐" },
      { id: "non", label: "Pas d'arche", emoji: "❌" },
    ],
  },
  {
    id: "deco_elements",
    question: "Éléments de décoration souhaités",
    subtitle: "Cochez ce qui vous intéresse",
    type: "multi",
    showIf: (a) => hasPresta(a, "decoration"),
    options: [
      { id: "centres-table", label: "Centres de table", emoji: "🕯️" },
      { id: "chemin-table", label: "Chemin de table (végétal ou tissu)", emoji: "🌿" },
      { id: "back-drop", label: "Back-drop / mur photo", emoji: "📸" },
      { id: "mur-fleurs", label: "Mur de fleurs", emoji: "🌸" },
      { id: "neon", label: "Néon personnalisé (prénom, citation)", emoji: "💡" },
      { id: "lettres", label: "Lettres géantes (prénom, âge, MR & MRS)", emoji: "🔤" },
      { id: "sweet-table", label: "Sweet table / Candy bar", emoji: "🍭" },
      { id: "guirlandes", label: "Guirlandes lumineuses", emoji: "✨" },
      { id: "lanternes", label: "Lanternes / bougies", emoji: "🏮" },
      { id: "photobooth", label: "Coin photobooth", emoji: "📷" },
      { id: "coin-enfants", label: "Coin enfants", emoji: "🧸" },
      { id: "signaletique", label: "Signalétique / panneaux bienvenue", emoji: "🪧" },
      { id: "plan-table", label: "Plan de table décoratif", emoji: "📋" },
      { id: "chaises", label: "Habillage des chaises (housses, nœuds)", emoji: "🪑" },
      { id: "petales", label: "Pétales / allée florale", emoji: "🌷" },
      { id: "pampa", label: "Pampa XXL / fleurs séchées", emoji: "🌾" },
    ],
  },
  {
    id: "deco_budget",
    question: "Niveau de décoration ?",
    subtitle: "Pour orienter mes propositions",
    type: "single",
    autoAdvance: true,
    showIf: (a) => hasPresta(a, "decoration"),
    options: [
      { id: "essentiel", label: "Essentiel — quelques pièces clés", emoji: "✨" },
      { id: "complet", label: "Complet — décoration soignée partout", emoji: "🌟" },
      { id: "luxe", label: "Luxe — mise en scène spectaculaire", emoji: "💫" },
    ],
  },
  {
    id: "deco_couleurs",
    question: "Palette de couleurs (optionnel)",
    subtitle: "Dites-moi les couleurs que vous aimez",
    type: "textarea",
    showIf: (a) => hasPresta(a, "decoration"),
  },
];

// =============================================================================
// MISE EN PLACE
// =============================================================================

const MISE_EN_PLACE_STEPS: QuestionStep[] = [
  {
    id: "mep_details",
    question: "Mise en place le jour-J",
    subtitle: "Ce que vous attendez de moi",
    type: "multi",
    showIf: (a) => hasPresta(a, "mise-en-place"),
    options: [
      { id: "livraison", label: "Livraison du matériel", emoji: "🚚" },
      { id: "montage", label: "Montage des arches / structures", emoji: "🔧" },
      { id: "dressage", label: "Dressage des tables (nappage, centres)", emoji: "🍽️" },
      { id: "eclairage", label: "Installation de l'éclairage", emoji: "💡" },
      { id: "photobooth", label: "Installation photobooth / sweet table", emoji: "📸" },
      { id: "demontage", label: "Démontage et rangement", emoji: "📦" },
    ],
  },
];

// =============================================================================
// FAIRE-PART & PAPETERIE
// =============================================================================

const FAIRE_PART_STEPS: QuestionStep[] = [
  {
    id: "fp_types",
    question: "Quels éléments de papeterie ?",
    subtitle: "Cochez ce dont vous avez besoin",
    type: "multi",
    showIf: (a) => hasPresta(a, "faire-part"),
    options: [
      { id: "save-the-date", label: "Save the date", emoji: "📅" },
      { id: "faire-part", label: "Faire-part principal", emoji: "💌" },
      { id: "rsvp", label: "Carton réponse / RSVP", emoji: "✉️" },
      { id: "plan-acces", label: "Plan d'accès / info pratiques", emoji: "🗺️" },
      { id: "programme", label: "Programme / livret de cérémonie", emoji: "📜" },
      { id: "menu", label: "Menus", emoji: "🍽️" },
      { id: "marque-place", label: "Marque-places", emoji: "🪧" },
      { id: "livre-or", label: "Livre d'or", emoji: "📖" },
      { id: "remerciements", label: "Cartes de remerciements", emoji: "💝" },
    ],
  },
  {
    id: "fp_quantite",
    question: "Combien d'exemplaires pour le faire-part ?",
    subtitle: "Estimation — les autres se calculent ensuite",
    type: "slider",
    sliderMin: 10,
    sliderMax: 200,
    sliderStep: 5,
    sliderUnit: "exemplaires",
    showIf: (a) => hasPresta(a, "faire-part"),
  },
  {
    id: "fp_style",
    question: "Style graphique souhaité",
    subtitle: "L'esthétique qui vous correspond",
    type: "single",
    autoAdvance: true,
    showIf: (a) => hasPresta(a, "faire-part"),
    options: [
      { id: "aquarelle", label: "Aquarelle / illustré", emoji: "🎨" },
      { id: "typographique", label: "Typographique moderne", emoji: "🔤" },
      { id: "vegetal", label: "Végétal / nature", emoji: "🌿" },
      { id: "vintage", label: "Vintage / rétro", emoji: "📜" },
      { id: "minimaliste", label: "Minimaliste épuré", emoji: "⚪" },
      { id: "luxe", label: "Luxe (dorure, gaufrage)", emoji: "✨" },
    ],
  },
  {
    id: "fp_finitions",
    question: "Finitions souhaitées",
    subtitle: "Les détails qui font la différence",
    type: "multi",
    showIf: (a) => hasPresta(a, "faire-part"),
    options: [
      { id: "dorure", label: "Dorure à chaud", emoji: "✨" },
      { id: "gaufrage", label: "Gaufrage (relief)", emoji: "🎴" },
      { id: "decoupe", label: "Découpe laser", emoji: "✂️" },
      { id: "enveloppes", label: "Enveloppes doublées", emoji: "💌" },
      { id: "ruban", label: "Ruban / ficelle", emoji: "🎀" },
      { id: "cire", label: "Cachet en cire", emoji: "🔴" },
      { id: "standard", label: "Standard (sans finition spéciale)", emoji: "📄" },
    ],
  },
];

// =============================================================================
// DRAGÉES
// =============================================================================

const DRAGEES_STEPS: QuestionStep[] = [
  {
    id: "dragees_parfum",
    question: "Quel parfum de dragées ?",
    subtitle: "Plusieurs choix possibles",
    type: "multi",
    showIf: (a) => hasPresta(a, "dragees"),
    options: [
      { id: "amande", label: "Amande (classique)", emoji: "🌰" },
      { id: "chocolat", label: "Chocolat", emoji: "🍫" },
      { id: "praline", label: "Praline", emoji: "🥜" },
      { id: "fruits", label: "Fruits (cranberry, framboise...)", emoji: "🍓" },
      { id: "mixte", label: "Mixte (plusieurs parfums)", emoji: "🎨" },
      { id: "conseil", label: "À définir ensemble", emoji: "💬" },
    ],
  },
  {
    id: "dragees_contenant",
    question: "Quel type de contenant ?",
    subtitle: "L'emballage de vos dragées",
    type: "single",
    autoAdvance: true,
    showIf: (a) => hasPresta(a, "dragees"),
    options: [
      { id: "boite", label: "Boîte personnalisée", emoji: "📦" },
      { id: "sachet-organza", label: "Sachet en organza", emoji: "🎁" },
      { id: "cornet-tissu", label: "Cornet en tissu", emoji: "🎀" },
      { id: "pot-verre", label: "Pot en verre", emoji: "🫙" },
      { id: "tube", label: "Tube / éprouvette", emoji: "🧪" },
      { id: "drageoir", label: "Dragéoir individuel", emoji: "🥣" },
    ],
  },
  {
    id: "dragees_decoration",
    question: "Décoration de l'emballage",
    subtitle: "Les petits plus qui font la différence",
    type: "multi",
    showIf: (a) => hasPresta(a, "dragees"),
    options: [
      { id: "etiquette", label: "Étiquette personnalisée (prénom)", emoji: "🏷️" },
      { id: "ruban", label: "Ruban / ficelle", emoji: "🎀" },
      { id: "fleurs-sechees", label: "Fleurs séchées", emoji: "🌾" },
      { id: "cire", label: "Cachet en cire", emoji: "🔴" },
      { id: "medaille", label: "Médaille / breloque", emoji: "🏅" },
    ],
  },
];

// =============================================================================
// GOODIES / CADEAUX INVITÉS
// =============================================================================

const GOODIES_STEPS: QuestionStep[] = [
  {
    id: "goodies_type",
    question: "Quel type de cadeau invité ?",
    subtitle: "Plusieurs choix possibles",
    type: "multi",
    showIf: (a) => hasPresta(a, "goodies"),
    options: [
      { id: "bougie", label: "Bougie personnalisée", emoji: "🕯️" },
      { id: "savon", label: "Savon artisanal", emoji: "🧼" },
      { id: "confiture", label: "Confiture / miel", emoji: "🍯" },
      { id: "chocolat", label: "Chocolats", emoji: "🍫" },
      { id: "lavande", label: "Sachet de lavande", emoji: "💜" },
      { id: "mini-bouteille", label: "Mini bouteille (champagne, liqueur)", emoji: "🍾" },
      { id: "photo", label: "Photo polaroid / porte-clés", emoji: "📷" },
      { id: "bonbons", label: "Bonbons / sucettes", emoji: "🍬" },
      { id: "cosmetique", label: "Mini cosmétique (baume, parfum)", emoji: "💄" },
      { id: "sac-surprise", label: "Sac surprise (enfant)", emoji: "🎁" },
      { id: "autre", label: "Autre idée (à discuter)", emoji: "💭" },
    ],
  },
  {
    id: "goodies_personnalisation",
    question: "Personnalisation souhaitée",
    subtitle: "Les détails qui font plaisir",
    type: "multi",
    showIf: (a) => hasPresta(a, "goodies"),
    options: [
      { id: "etiquette-prenom", label: "Étiquette avec prénom des invités", emoji: "🏷️" },
      { id: "date", label: "Date de l'événement", emoji: "📅" },
      { id: "theme", label: "Aux couleurs du thème", emoji: "🎨" },
      { id: "remerciement", label: "Message de remerciement", emoji: "💝" },
      { id: "standard", label: "Standard (sans personnalisation)", emoji: "📦" },
    ],
  },
];

// =============================================================================
// VAISSELLE JETABLE DÉCORATIVE
// =============================================================================

const VAISSELLE_STEPS: QuestionStep[] = [
  {
    id: "vaisselle_elements",
    question: "Quels éléments de vaisselle ?",
    subtitle: "Cochez ce qui vous intéresse",
    type: "multi",
    showIf: (a) => hasPresta(a, "vaisselle"),
    options: [
      { id: "assiettes", label: "Assiettes (plates + creuses)", emoji: "🍽️" },
      { id: "serviettes", label: "Serviettes en papier", emoji: "🧻" },
      { id: "gobelets", label: "Gobelets / verres", emoji: "🥤" },
      { id: "couverts", label: "Couverts (fourchettes, couteaux, cuillères)", emoji: "🍴" },
      { id: "nappe", label: "Nappe jetable", emoji: "📋" },
      { id: "pailles", label: "Pailles décoratives", emoji: "🥤" },
      { id: "ballons-gonflables", label: "Ballons gonflables", emoji: "🎈" },
      { id: "pack-complet", label: "Pack complet (tout inclus)", emoji: "📦" },
    ],
  },
  {
    id: "vaisselle_theme",
    question: "Quel thème de vaisselle ?",
    subtitle: "Pour harmoniser avec votre événement",
    type: "single",
    autoAdvance: true,
    showIf: (a) => hasPresta(a, "vaisselle"),
    options: [
      { id: "princesse", label: "Princesse / Fée", emoji: "👸" },
      { id: "super-heros", label: "Super-héros", emoji: "🦸" },
      { id: "safari", label: "Safari / Jungle", emoji: "🦁" },
      { id: "licorne", label: "Licorne / Arc-en-ciel", emoji: "🦄" },
      { id: "pirate", label: "Pirates / Aventure", emoji: "🏴‍☠️" },
      { id: "bapteme", label: "Baptême (doux, pastel)", emoji: "👶" },
      { id: "mariage", label: "Mariage (chic, doré)", emoji: "💍" },
      { id: "baby-bleu", label: "Baby shower bleu", emoji: "💙" },
      { id: "baby-rose", label: "Baby shower rose", emoji: "💗" },
      { id: "noir-dore", label: "Noir & doré (chic)", emoji: "🖤" },
      { id: "blanc-or", label: "Blanc & or (élégant)", emoji: "✨" },
      { id: "autre-theme", label: "Autre thème (à définir)", emoji: "🎨" },
    ],
  },
];

// =============================================================================
// EVENT_STEPS : même parcours pour tous les types (les showIf filtrent)
// =============================================================================

const ALL_STEPS = [
  ...COMMON_START,
  ...DECO_STEPS,
  ...MISE_EN_PLACE_STEPS,
  ...VAISSELLE_STEPS,
  ...FAIRE_PART_STEPS,
  ...DRAGEES_STEPS,
  ...GOODIES_STEPS,
];

export const EVENT_STEPS: Record<string, QuestionStep[]> = {
  mariage: ALL_STEPS,
  bapteme: ALL_STEPS,
  anniversaire: ALL_STEPS,
  fiancailles: ALL_STEPS,
  "baby-shower": ALL_STEPS,
  autre: ALL_STEPS,
};
