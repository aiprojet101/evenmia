// Questionnaire intelligent par type d'événement
// Chaque type a son propre parcours de questions adaptatives

export interface QuestionOption {
  id: string;
  label: string;
  emoji?: string;
  price?: number; // impact prix direct (fixe)
  pricePerPerson?: number; // prix par personne (multiplie par nb invites)
  priceNote?: string;
  showIf?: string; // ne s'affiche que si cette reponse precedente est selectionnee
}

export interface QuestionStep {
  id: string;
  question: string;
  subtitle?: string;
  type: "single" | "multi" | "slider" | "date" | "text" | "boolean";
  options?: QuestionOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderUnit?: string;
  required?: boolean;
  showIf?: (answers: Record<string, unknown>) => boolean;
  autoAdvance?: boolean; // passe auto a la question suivante apres selection
  dynamicRange?: (answers: Record<string, unknown>) => { min: number; max: number };
}

// =============================================================================
// MARIAGE
// =============================================================================
export const MARIAGE_STEPS: QuestionStep[] = [
  {
    id: "cérémonie",
    question: "Quel type de cérémonie ?",
    subtitle: "Chaque cérémonie a ses specificites et son cout",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "civile", label: "Civile uniquement", emoji: "🏛️" },
      { id: "religieuse-civile", label: "Religieuse + civile", emoji: "⛪" },
      { id: "laique-civile", label: "Laique + civile", emoji: "🌿", price: 300, priceNote: "Officiant + decor cérémonie" },
      { id: "mixte", label: "Mixte (plusieurs rites)", emoji: "🕊️", price: 500 },
    ],
  },
  {
    id: "religion",
    question: "Quelle confession ?",
    subtitle: "Pour adapter la décoration et le deroulement",
    type: "single",
    autoAdvance: true,
    showIf: (a) => a.cérémonie === "religieuse-civile" || a.cérémonie === "mixte",
    options: [
      { id: "catholique", label: "Catholique", emoji: "✝️" },
      { id: "protestante", label: "Protestante", emoji: "✝️" },
      { id: "musulmane", label: "Musulmane", emoji: "☪️" },
      { id: "juive", label: "Juive", emoji: "✡️", price: 200, priceNote: "Houppa" },
      { id: "autre", label: "Autre", emoji: "🙏" },
    ],
  },
  {
    id: "invites",
    question: "Combien d'invites ?",
    subtitle: "Le facteur n°1 qui influence le budget",
    type: "slider",
    sliderMin: 10, sliderMax: 500, sliderStep: 10, sliderUnit: "invites",
  },
  {
    id: "lieu",
    question: "Avez-vous deja un lieu de reception ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui", label: "Oui, c'est réserve", emoji: "✅" },
      { id: "en-recherche", label: "Non, aidez-moi a trouver", emoji: "🔍", price: 200 },
      { id: "idee", label: "J'ai une idee mais pas réserve", emoji: "💭" },
    ],
  },
  {
    id: "lieu-type",
    question: "Quel type de lieu vous fait rever ?",
    subtitle: "On peut vous proposer les meilleures adresses de la region",
    type: "single",
    autoAdvance: true,
    showIf: (a) => a.lieu === "en-recherche" || a.lieu === "idee",
    options: [
      { id: "chateau", label: "Chateau / Domaine", emoji: "🏰" },
      { id: "salle", label: "Salle de reception", emoji: "🏢" },
      { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
      { id: "plein-air", label: "Plein air / Jardin", emoji: "🌳" },
      { id: "grange", label: "Grange / Ferme", emoji: "🌾" },
      { id: "insolite", label: "Lieu insolite", emoji: "✨" },
    ],
  },
  {
    id: "meme-lieu",
    question: "Cérémonie et reception au meme endroit ?",
    subtitle: "Deux lieux = navettes pour les invites",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui", label: "Oui, tout au meme endroit", emoji: "👍" },
      { id: "non", label: "Non, lieux differents", emoji: "🚗", price: 150, priceNote: "Coordination transport" },
    ],
  },
  {
    id: "repas",
    question: "Quel type de repas ?",
    subtitle: "Le repas represente 30-40% du budget total",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "assis", label: "Repas assis servi a table", emoji: "🍽️", pricePerPerson: 5, priceNote: "Coordination traiteur" },
      { id: "buffet", label: "Buffet", emoji: "🥗", pricePerPerson: 4 },
      { id: "cocktail", label: "Cocktail dinatoire", emoji: "🥂", pricePerPerson: 3 },
      { id: "food-truck", label: "Food trucks", emoji: "🚚", pricePerPerson: 2 },
      { id: "mixte", label: "Cocktail + repas assis", emoji: "✨", pricePerPerson: 6 },
      { id: "brunch", label: "Brunch du lendemain", emoji: "🥐", pricePerPerson: 3 },
    ],
  },
  {
    id: "boissons",
    question: "Quelle formule boissons ?",
    subtitle: "L'open bar est le poste le plus variable",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "open-bar", label: "Open bar toute la soiree", emoji: "🍾", pricePerPerson: 5 },
      { id: "open-limite", label: "Open bar limite (3-4h)", emoji: "🍷", pricePerPerson: 3 },
      { id: "repas-seul", label: "Boissons au repas uniquement", emoji: "🥂", pricePerPerson: 1 },
      { id: "soft", label: "Soft bar uniquement", emoji: "🥤" },
    ],
  },
  {
    id: "gateau",
    question: "Quel gateau de mariage ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "piece-montee", label: "Piece montee (choux)", emoji: "🎂", pricePerPerson: 1.5 },
      { id: "wedding-cake", label: "Wedding cake a l'americaine", emoji: "🎂", pricePerPerson: 2.5 },
      { id: "naked-cake", label: "Naked cake", emoji: "🍰", pricePerPerson: 2 },
      { id: "dessert-buffet", label: "Buffet de desserts", emoji: "🧁", pricePerPerson: 3 },
      { id: "non", label: "Pas de gateau special", emoji: "❌" },
    ],
  },
  {
    id: "deco-style",
    question: "Quel style de décoration ?",
    subtitle: "Pour creer l'ambiance qui vous ressemble",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "champetre", label: "Champetre / Nature", emoji: "🌾" },
      { id: "chic", label: "Chic & elegant", emoji: "✨" },
      { id: "boheme", label: "Boheme", emoji: "🌿" },
      { id: "romantique", label: "Romantique", emoji: "🌹" },
      { id: "moderne", label: "Moderne / Epure", emoji: "🖤" },
      { id: "vintage", label: "Vintage / Retro", emoji: "📷" },
    ],
  },
  {
    id: "deco-elements",
    question: "Quels elements de décoration ?",
    subtitle: "Selectionnez tout ce qui vous interesse",
    type: "multi",
    options: [
      { id: "centres-table", label: "Centres de table floraux", emoji: "💐", price: 150 },
      { id: "arche", label: "Arche de cérémonie", emoji: "🌸", price: 200 },
      { id: "guirlandes", label: "Guirlandes lumineuses", emoji: "💡", price: 80 },
      { id: "bougies", label: "Bougies / Photophores", emoji: "🕯️", price: 60 },
      { id: "drapes", label: "Drapes / Voilages", emoji: "🎀", price: 150 },
      { id: "neon", label: "Neon personnalise", emoji: "💫", price: 120 },
      { id: "panneau", label: "Panneau de bienvenue", emoji: "🪧", price: 50 },
      { id: "lounge", label: "Coins lounge", emoji: "🛋️", price: 200 },
    ],
  },
  {
    id: "fleurs",
    question: "Quelles compositions florales ?",
    subtitle: "Les fleurs representent 5-10% du budget",
    type: "multi",
    options: [
      { id: "bouquet-mariee", label: "Bouquet de la mariee", emoji: "💐", price: 80 },
      { id: "boutonnieres", label: "Boutonnieres", emoji: "🌹", price: 30 },
      { id: "arche-florale", label: "Arche florale", emoji: "🌺", price: 300 },
      { id: "compo-tables", label: "Compositions tables", emoji: "🌸", price: 200 },
      { id: "petales", label: "Petales allee", emoji: "🌷", price: 40 },
      { id: "voiture", label: "Decor voiture", emoji: "🚗", price: 60 },
      { id: "non", label: "Pas de fleurs", emoji: "❌" },
    ],
  },
  {
    id: "photo",
    question: "Photographe ?",
    subtitle: "Pour immortaliser chaque instant",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "journee", label: "Journee complete", emoji: "📸", price: 200, priceNote: "Coordination photographe" },
      { id: "demi", label: "Demi-journee", emoji: "📷", price: 100 },
      { id: "cérémonie", label: "Cérémonie uniquement", emoji: "📷", price: 50 },
      { id: "non", label: "Pas de photographe pro", emoji: "❌" },
    ],
  },
  {
    id: "video",
    question: "Videaste / Film du mariage ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "complet", label: "Film complet + drone", emoji: "🎬", price: 200 },
      { id: "teaser", label: "Teaser / Clip court", emoji: "🎥", price: 100 },
      { id: "non", label: "Non merci", emoji: "❌" },
    ],
  },
  {
    id: "musique",
    question: "Musique et ambiance ?",
    subtitle: "Pour faire danser vos invites toute la nuit",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "dj", label: "DJ", emoji: "🎧", price: 100 },
      { id: "orchestre", label: "Groupe / Orchestre live", emoji: "🎵", price: 300 },
      { id: "dj-live", label: "DJ + musicien cérémonie", emoji: "🎶", price: 200 },
      { id: "playlist", label: "Playlist perso", emoji: "📱" },
    ],
  },
  {
    id: "animations",
    question: "Des animations ?",
    subtitle: "Pour surprendre et divertir vos invites",
    type: "multi",
    options: [
      { id: "photobooth", label: "Photobooth", emoji: "📸", price: 80 },
      { id: "feu-artifice", label: "Feu d'artifice", emoji: "🎆", price: 250 },
      { id: "magicien", label: "Magicien", emoji: "🎩", price: 100 },
      { id: "candy-bar", label: "Candy bar", emoji: "🍬", price: 150 },
      { id: "fontaine-choco", label: "Fontaine a chocolat", emoji: "🍫", price: 80 },
      { id: "caricaturiste", label: "Caricaturiste", emoji: "🎨", price: 100 },
      { id: "non", label: "Pas d'animation", emoji: "❌" },
    ],
  },
  {
    id: "enfants",
    question: "Y aura-t-il des enfants ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui-babysitter", label: "Oui, avec baby-sitting", emoji: "👶", price: 150 },
      { id: "oui-animations", label: "Oui, avec animations enfants", emoji: "🎈", price: 200 },
      { id: "oui-simple", label: "Oui, mais rien de special", emoji: "👧" },
      { id: "non", label: "Non, adultes uniquement", emoji: "🚫" },
    ],
  },
  {
    id: "transport",
    question: "Transport pour les invites ?",
    subtitle: "Si le lieu est excentre ou pour la securite apres la fete",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "navette", label: "Navettes aller-retour", emoji: "🚌", price: 200 },
      { id: "voiture-maries", label: "Voiture de collection pour les maries", emoji: "🚗", price: 150 },
      { id: "les-deux", label: "Navettes + voiture maries", emoji: "✨", price: 300 },
      { id: "non", label: "Pas besoin", emoji: "❌" },
    ],
  },
  {
    id: "faire-part",
    question: "Faire-part et papeterie ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "papier-complet", label: "Papier complet (save the date + faire-part + menus)", emoji: "💌", price: 200 },
      { id: "papier-simple", label: "Faire-part papier simple", emoji: "✉️", price: 100 },
      { id: "digital", label: "Invitation digitale", emoji: "📱", price: 30 },
      { id: "deja-fait", label: "Deja gere", emoji: "✅" },
    ],
  },
];

// =============================================================================
// ANNIVERSAIRE
// =============================================================================
export const ANNIVERSAIRE_STEPS: QuestionStep[] = [
  {
    id: "qui",
    question: "C'est un anniversaire pour qui ?",
    subtitle: "On adapte tout en fonction de l'age",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "enfant", label: "Enfant (1-12 ans)", emoji: "🧒" },
      { id: "ado", label: "Adolescent (13-17 ans)", emoji: "🎮" },
      { id: "adulte", label: "Adulte (18 ans et +)", emoji: "🥂" },
    ],
  },
  {
    id: "age-exact",
    question: "Quel age exactement ?",
    subtitle: "Certains ages ont des traditions speciales (1 an, 18 ans, 30 ans, 50 ans...)",
    type: "slider",
    sliderMin: 1, sliderMax: 100, sliderStep: 1, sliderUnit: "ans",
    dynamicRange: (answers: Record<string, unknown>) => {
      switch (answers.qui) {
        case "enfant": return { min: 1, max: 12 };
        case "ado": return { min: 13, max: 17 };
        case "adulte": return { min: 18, max: 101 };
        default: return { min: 1, max: 101 };
      }
    },
  },
  {
    id: "invites",
    question: "Combien d'invites ?",
    type: "slider",
    sliderMin: 5, sliderMax: 200, sliderStep: 5, sliderUnit: "invites",
  },
  {
    id: "theme",
    question: "Un theme en tete ?",
    subtitle: "On peut aussi vous en proposer",
    type: "single",
    autoAdvance: true,
    showIf: (a) => a.qui === "enfant" || a.qui === "ado",
    options: [
      { id: "super-heros", label: "Super-heros", emoji: "🦸" },
      { id: "princesse", label: "Princesse / Fee", emoji: "👸" },
      { id: "pirates", label: "Pirates / Aventure", emoji: "🏴‍☠️" },
      { id: "animaux", label: "Animaux / Jungle", emoji: "🦁" },
      { id: "sport", label: "Sport", emoji: "⚽" },
      { id: "gaming", label: "Gaming / E-sport", emoji: "🎮" },
      { id: "science", label: "Science / Espace", emoji: "🚀" },
      { id: "personnalise", label: "Theme personnalise", emoji: "✨" },
    ],
  },
  {
    id: "theme-adulte",
    question: "Quelle ambiance ?",
    type: "single",
    autoAdvance: true,
    showIf: (a) => a.qui === "adulte",
    options: [
      { id: "chic", label: "Soiree chic & cocktail", emoji: "🥂" },
      { id: "festif", label: "Fete festive & dansante", emoji: "🎉" },
      { id: "intime", label: "Diner intime", emoji: "🕯️" },
      { id: "surprise", label: "Soiree surprise", emoji: "🤫", price: 100, priceNote: "Coordination surprise" },
      { id: "brunch", label: "Brunch / Garden party", emoji: "🌿" },
      { id: "theme", label: "Soiree a theme (deguisee, annees 80...)", emoji: "🎭" },
    ],
  },
  {
    id: "lieu",
    question: "Ou se deroule la fete ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "domicile", label: "A domicile", emoji: "🏠" },
      { id: "salle", label: "Salle louee", emoji: "🏢" },
      { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
      { id: "exterieur", label: "Plein air / Jardin", emoji: "🌳" },
      { id: "lieu-insolite", label: "Lieu insolite (bowling, karting...)", emoji: "🎯" },
      { id: "recherche", label: "Aidez-moi a trouver", emoji: "🔍", price: 150 },
    ],
  },
  {
    id: "gateau",
    question: "Le gateau d'anniversaire ?",
    subtitle: "L'element central de la fete",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "sur-mesure", label: "Gateau sur-mesure (cake design)", emoji: "🎂", pricePerPerson: 2.5 },
      { id: "piece-montee", label: "Piece montee", emoji: "🍰", pricePerPerson: 2 },
      { id: "cupcakes", label: "Tower de cupcakes", emoji: "🧁", pricePerPerson: 1.5 },
      { id: "simple", label: "Gateau classique", emoji: "🎂", pricePerPerson: 0.5 },
      { id: "aucun", label: "Pas de gateau", emoji: "❌" },
    ],
  },
  {
    id: "activites-enfant",
    question: "Quelles activites ?",
    subtitle: "Pour que les enfants s'eclatent",
    type: "multi",
    showIf: (a) => a.qui === "enfant",
    options: [
      { id: "chateau-gonflable", label: "Chateau gonflable", emoji: "🏰", price: 150 },
      { id: "clown-magicien", label: "Clown / Magicien", emoji: "🤡", price: 120 },
      { id: "maquillage", label: "Maquillage artistique", emoji: "🎨", price: 80 },
      { id: "chasse-tresor", label: "Chasse au tresor", emoji: "🗺️", price: 60 },
      { id: "atelier-creatif", label: "Atelier creatif", emoji: "✂️", price: 80 },
      { id: "sculpture-ballons", label: "Sculpture de ballons", emoji: "🎈", price: 60 },
      { id: "spectacle", label: "Spectacle de marionnettes", emoji: "🎭", price: 120 },
      { id: "pinata", label: "Pinata", emoji: "🪅", price: 30 },
    ],
  },
  {
    id: "activites-adulte",
    question: "Des animations ?",
    type: "multi",
    showIf: (a) => a.qui === "adulte" || a.qui === "ado",
    options: [
      { id: "dj", label: "DJ / Musique", emoji: "🎧", price: 100 },
      { id: "photobooth", label: "Photobooth", emoji: "📸", price: 80 },
      { id: "karaoke", label: "Karaoke", emoji: "🎤", price: 60 },
      { id: "cocktail-bar", label: "Bar a cocktails / Barman", emoji: "🍹", price: 150 },
      { id: "casino", label: "Casino ephemere", emoji: "🎰", price: 200 },
      { id: "quiz", label: "Quiz / Jeux", emoji: "🎲", price: 50 },
      { id: "diaporama", label: "Diaporama souvenir", emoji: "📽️", price: 40 },
    ],
  },
  {
    id: "repas",
    question: "Comment on mange ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "traiteur", label: "Traiteur / Repas complet", emoji: "🍽️", pricePerPerson: 5, priceNote: "Coordination traiteur" },
      { id: "buffet", label: "Buffet", emoji: "🥗", pricePerPerson: 4 },
      { id: "aperitif", label: "Aperitif dinatoire", emoji: "🥂", pricePerPerson: 3 },
      { id: "gouter", label: "Gouter (enfants)", emoji: "🧃", pricePerPerson: 1 },
      { id: "gere", label: "Je gere moi-meme", emoji: "👨‍🍳" },
    ],
  },
  {
    id: "deco",
    question: "Niveau de décoration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "basique", label: "Basique (ballons, guirlandes)", emoji: "🎈", price: 50 },
      { id: "soigne", label: "Soigne (theme complet)", emoji: "🎀", price: 150 },
      { id: "wow", label: "Spectaculaire (scenographie)", emoji: "🤩", price: 350 },
      { id: "non", label: "Minimal / Rien", emoji: "✨" },
    ],
  },
  {
    id: "surprise",
    question: "C'est une fete surprise ?",
    subtitle: "On sait garder un secret !",
    type: "boolean",
    showIf: (a) => a.qui === "adulte",
  },
];

// =============================================================================
// BAPTEME
// =============================================================================
export const BAPTEME_STEPS: QuestionStep[] = [
  {
    id: "type-baptême",
    question: "Quel type de baptême ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "religieux", label: "Baptême religieux", emoji: "⛪" },
      { id: "civil", label: "Baptême civil (republicain)", emoji: "🏛️" },
      { id: "les-deux", label: "Les deux", emoji: "🕊️", price: 100 },
    ],
  },
  {
    id: "religion-baptême",
    question: "Quelle confession ?",
    type: "single",
    autoAdvance: true,
    showIf: (a) => a["type-baptême"] === "religieux" || a["type-baptême"] === "les-deux",
    options: [
      { id: "catholique", label: "Catholique", emoji: "✝️" },
      { id: "protestante", label: "Protestante", emoji: "✝️" },
      { id: "orthodoxe", label: "Orthodoxe", emoji: "☦️" },
      { id: "autre", label: "Autre", emoji: "🙏" },
    ],
  },
  {
    id: "age-enfant",
    question: "Quel age a l'enfant ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "bebe", label: "Bebe (0-2 ans)", emoji: "👶" },
      { id: "petit", label: "Petit enfant (3-6 ans)", emoji: "🧒" },
      { id: "grand", label: "Enfant (7+ ans)", emoji: "👦" },
      { id: "adulte", label: "Adulte", emoji: "🧑" },
    ],
  },
  {
    id: "invites",
    question: "Combien d'invites ?",
    type: "slider",
    sliderMin: 10, sliderMax: 150, sliderStep: 5, sliderUnit: "invites",
  },
  {
    id: "reception",
    question: "Quel type de reception apres la cérémonie ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "repas", label: "Repas assis complet", emoji: "🍽️", pricePerPerson: 5 },
      { id: "buffet", label: "Buffet", emoji: "🥗", pricePerPerson: 4 },
      { id: "cocktail", label: "Vin d'honneur / Cocktail", emoji: "🥂", pricePerPerson: 2.5 },
      { id: "gouter", label: "Gouter / Brunch", emoji: "🧁", pricePerPerson: 1.5 },
      { id: "domicile", label: "Reception a la maison", emoji: "🏠" },
    ],
  },
  {
    id: "lieu-baptême",
    question: "Ou se fait la reception ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "domicile", label: "A la maison", emoji: "🏠" },
      { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
      { id: "salle", label: "Salle de reception", emoji: "🏢" },
      { id: "jardin", label: "Jardin / Plein air", emoji: "🌿" },
      { id: "recherche", label: "Aidez-moi a trouver", emoji: "🔍", price: 150 },
    ],
  },
  {
    id: "deco-baptême",
    question: "Quel style de décoration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "doux", label: "Doux & pastel", emoji: "🌸" },
      { id: "boheme", label: "Boheme / Nature", emoji: "🌿" },
      { id: "elegant", label: "Chic & elegant", emoji: "✨" },
      { id: "theme", label: "A theme (animaux, etoiles...)", emoji: "🐰" },
      { id: "minimal", label: "Simple & epure", emoji: "🤍" },
    ],
  },
  {
    id: "deco-level",
    question: "Niveau de décoration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "simple", label: "Quelques elements cles", emoji: "🎈" },
      { id: "complet", label: "Décoration complete", emoji: "🎀", price: 200 },
      { id: "luxe", label: "Scenographie elaboree", emoji: "🤩", price: 500 },
    ],
  },
  {
    id: "dragees",
    question: "Des dragees / cadeaux invites ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "dragees-classique", label: "Dragees traditionnelles", emoji: "🤍", pricePerPerson: 1 },
      { id: "dragees-originales", label: "Dragees originales / Boites personnalisees", emoji: "🎁", pricePerPerson: 2 },
      { id: "cadeaux", label: "Petits cadeaux (savons, bougies...)", emoji: "🕯️", pricePerPerson: 1.5 },
      { id: "non", label: "Non merci", emoji: "❌" },
    ],
  },
  {
    id: "gateau-baptême",
    question: "Le gateau de baptême ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "cake-design", label: "Gateau personnalise (cake design)", emoji: "🎂", pricePerPerson: 2.5 },
      { id: "piece-montee", label: "Piece montee", emoji: "🍰", pricePerPerson: 2 },
      { id: "sweet-table", label: "Sweet table complete", emoji: "🧁", pricePerPerson: 3.5, priceNote: "Cupcakes, cake pops, sables decores..." },
      { id: "simple", label: "Gateau classique", emoji: "🎂", pricePerPerson: 0.5 },
    ],
  },
  {
    id: "photo-baptême",
    question: "Photographe pour le baptême ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui", label: "Oui, photographe pro", emoji: "📸", price: 100 },
      { id: "cérémonie", label: "Juste la cérémonie", emoji: "📷", price: 50 },
      { id: "non", label: "Non", emoji: "❌" },
    ],
  },
  {
    id: "espace-enfants",
    question: "Espace / animations enfants ?",
    subtitle: "Il y aura surement d'autres enfants parmi les invites",
    type: "single",
    autoAdvance: true,
    showIf: (a) => a["age-enfant"] === "bebe" || a["age-enfant"] === "petit",
    options: [
      { id: "espace-jeux", label: "Coin jeux / Eveil", emoji: "🧸", price: 80 },
      { id: "animations", label: "Animations (maquillage, ballons)", emoji: "🎨", price: 120 },
      { id: "babysitter", label: "Baby-sitter sur place", emoji: "👩‍🍼", price: 100 },
      { id: "non", label: "Pas necessaire", emoji: "❌" },
    ],
  },
];

// =============================================================================
// FIANCAILLES
// =============================================================================
export const FIANCAILLES_STEPS: QuestionStep[] = [
  {
    id: "type-fete",
    question: "Quel type de fete ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "surprise", label: "Demande en mariage surprise", emoji: "💍", price: 200, priceNote: "Scenographie surprise" },
      { id: "fete", label: "Fete de fiançailles (apres la demande)", emoji: "🥂" },
      { id: "intime", label: "Diner intime en couple", emoji: "🕯️" },
    ],
  },
  {
    id: "invites",
    question: "Combien d'invites ?",
    type: "slider",
    sliderMin: 2, sliderMax: 100, sliderStep: 5, sliderUnit: "invites",
    showIf: (a) => a["type-fete"] !== "intime",
  },
  {
    id: "lieu-fianc",
    question: "Ou organiser ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
      { id: "domicile", label: "A domicile", emoji: "🏠" },
      { id: "lieu-special", label: "Lieu special (rooftop, jardin...)", emoji: "✨", price: 100 },
      { id: "recherche", label: "Proposez-moi un lieu", emoji: "🔍", price: 150 },
    ],
  },
  {
    id: "ambiance-fianc",
    question: "Quelle ambiance ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "romantique", label: "Romantique & intime", emoji: "🌹" },
      { id: "festif", label: "Festif & joyeux", emoji: "🎉" },
      { id: "chic", label: "Chic & raffine", emoji: "✨" },
      { id: "decontracte", label: "Decontracte & convivial", emoji: "😊" },
    ],
  },
  {
    id: "deco-fianc",
    question: "Niveau de décoration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "simple", label: "Quelques touches (ballons, fleurs)", emoji: "🎈", price: 50 },
      { id: "soigne", label: "Décoration soignee", emoji: "💐", price: 150 },
      { id: "scenographie", label: "Scenographie complete (pour la demande)", emoji: "🤩", price: 400 },
      { id: "non", label: "Pas de décoration", emoji: "❌" },
    ],
  },
  {
    id: "repas-fianc",
    question: "Comment on mange ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "repas", label: "Diner / Repas", emoji: "🍽️", pricePerPerson: 5 },
      { id: "cocktail", label: "Cocktail / Aperitif", emoji: "🥂", pricePerPerson: 3 },
      { id: "brunch", label: "Brunch", emoji: "🥐", pricePerPerson: 3 },
      { id: "gere", label: "Je gere", emoji: "👨‍🍳" },
    ],
  },
  {
    id: "photo-fianc",
    question: "Photographe ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui", label: "Oui (surtout pour la demande !)", emoji: "📸", price: 100 },
      { id: "non", label: "Non", emoji: "❌" },
    ],
  },
];

// =============================================================================
// BABY SHOWER
// =============================================================================
export const BABY_SHOWER_STEPS: QuestionStep[] = [
  {
    id: "gender-reveal",
    question: "C'est aussi un gender reveal ?",
    subtitle: "La revelation du sexe de bebe",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui", label: "Oui, gender reveal inclus", emoji: "💙💗", price: 80, priceNote: "Mise en scene revelation" },
      { id: "non", label: "Non, baby shower classique", emoji: "🎀" },
      { id: "sexe-connu", label: "Le sexe est deja connu", emoji: "👶" },
    ],
  },
  {
    id: "invites",
    question: "Combien d'invites ?",
    type: "slider",
    sliderMin: 5, sliderMax: 50, sliderStep: 5, sliderUnit: "invites",
  },
  {
    id: "lieu-baby",
    question: "Ou organiser ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "domicile", label: "A la maison", emoji: "🏠" },
      { id: "salon-the", label: "Salon de the / Cafe", emoji: "☕" },
      { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
      { id: "jardin", label: "Jardin / Plein air", emoji: "🌸" },
      { id: "recherche", label: "Proposez-moi", emoji: "🔍", price: 100 },
    ],
  },
  {
    id: "theme-baby",
    question: "Un theme ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "classique", label: "Rose & bleu classique", emoji: "🎀" },
      { id: "neutre", label: "Tons neutres / Nature", emoji: "🌿" },
      { id: "animaux", label: "Animaux mignons", emoji: "🐻" },
      { id: "nuages", label: "Nuages & etoiles", emoji: "☁️" },
      { id: "tropical", label: "Tropical / Colore", emoji: "🌺" },
      { id: "personnalise", label: "Personnalise (prenom bebe)", emoji: "✨" },
    ],
  },
  {
    id: "gouter-baby",
    question: "Quel gouter ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "sweet-table", label: "Sweet table complete", emoji: "🧁", pricePerPerson: 4 },
      { id: "brunch", label: "Brunch", emoji: "🥐", pricePerPerson: 3 },
      { id: "the-cafe", label: "The / Cafe + patisseries", emoji: "☕", pricePerPerson: 1.5 },
      { id: "gere", label: "Je gere moi-meme", emoji: "👩‍🍳" },
    ],
  },
  {
    id: "jeux-baby",
    question: "Des jeux baby shower ?",
    subtitle: "Les classiques qui font rire",
    type: "multi",
    options: [
      { id: "deviner-prenom", label: "Deviner le prenom", emoji: "📝", price: 0 },
      { id: "biberon", label: "Course au biberon", emoji: "🍼", price: 0 },
      { id: "mesurer-ventre", label: "Mesurer le ventre", emoji: "📏", price: 0 },
      { id: "arbre-voeux", label: "Arbre a voeux", emoji: "🌳", price: 30 },
      { id: "livre-or", label: "Livre d'or bebe", emoji: "📖", price: 25 },
    ],
  },
  {
    id: "deco-baby",
    question: "Décoration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "simple", label: "Quelques ballons & guirlandes", emoji: "🎈", price: 40 },
      { id: "soigne", label: "Décoration soignee au theme", emoji: "🎀", price: 100 },
      { id: "wow", label: "Scenographie complete", emoji: "🤩", price: 250 },
    ],
  },
  {
    id: "cadeaux-baby",
    question: "Des cadeaux pour les invites ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui", label: "Oui (bougies, savons, bonbons...)", emoji: "🎁", pricePerPerson: 1.5 },
      { id: "non", label: "Non", emoji: "❌" },
    ],
  },
];

// =============================================================================
// SEMINAIRE / CE
// =============================================================================
export const SEMINAIRE_STEPS: QuestionStep[] = [
  {
    id: "type-event",
    question: "Quel type d'événement professionnel ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "séminaire", label: "Séminaire / Journee d'equipe", emoji: "👔" },
      { id: "team-building", label: "Team building", emoji: "🤝" },
      { id: "soiree-entreprise", label: "Soiree d'entreprise", emoji: "🎉" },
      { id: "noel-ce", label: "Arbre de Noel / Fete CE", emoji: "🎄" },
      { id: "lancement", label: "Lancement produit / Conference", emoji: "🎤" },
      { id: "journee-famille", label: "Journee famille", emoji: "👨‍👩‍👧‍👦" },
    ],
  },
  {
    id: "participants",
    question: "Combien de participants ?",
    type: "slider",
    sliderMin: 10, sliderMax: 500, sliderStep: 10, sliderUnit: "personnes",
  },
  {
    id: "duree",
    question: "Quelle duree ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "demi", label: "Demi-journee", emoji: "🕐" },
      { id: "journee", label: "Journee complete", emoji: "📅" },
      { id: "soiree", label: "Soiree uniquement", emoji: "🌙" },
      { id: "weekend", label: "Plusieurs jours", emoji: "📆", price: 500 },
    ],
  },
  {
    id: "objectif",
    question: "L'objectif principal ?",
    subtitle: "On adapte le programme en consequence",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "cohesion", label: "Cohesion d'equipe", emoji: "🤝" },
      { id: "celebration", label: "Celebrer une reussite", emoji: "🏆" },
      { id: "formation", label: "Formation / Workshop", emoji: "📚" },
      { id: "detente", label: "Detente / Recompense", emoji: "🌴" },
      { id: "networking", label: "Networking", emoji: "🔗" },
    ],
  },
  {
    id: "lieu-semi",
    question: "Quel type de lieu ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "entreprise", label: "Dans vos locaux", emoji: "🏢" },
      { id: "hotel", label: "Hotel / Centre de séminaire", emoji: "🏨" },
      { id: "domaine", label: "Domaine / Chateau", emoji: "🏰" },
      { id: "insolite", label: "Lieu atypique", emoji: "✨" },
      { id: "recherche", label: "Proposez-nous", emoji: "🔍", price: 200 },
    ],
  },
  {
    id: "activites-semi",
    question: "Quelles activites ?",
    type: "multi",
    options: [
      { id: "escape-game", label: "Escape game", emoji: "🔐", price: 100 },
      { id: "olympiades", label: "Olympiades", emoji: "🏅", price: 150 },
      { id: "cuisine", label: "Atelier cuisine / Cocktail", emoji: "👨‍🍳", price: 120 },
      { id: "creatif", label: "Atelier creatif", emoji: "🎨", price: 100 },
      { id: "sportif", label: "Activite sportive", emoji: "⚽", price: 120 },
      { id: "conference", label: "Conference / Intervenant", emoji: "🎤", price: 200 },
      { id: "rallye", label: "Rallye / Chasse au tresor", emoji: "🗺️", price: 150 },
    ],
  },
  {
    id: "repas-semi",
    question: "Restauration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "traiteur", label: "Traiteur complet", emoji: "🍽️", pricePerPerson: 5 },
      { id: "buffet", label: "Buffet", emoji: "🥗", pricePerPerson: 4 },
      { id: "cocktail", label: "Cocktail dinatoire", emoji: "🥂", pricePerPerson: 3 },
      { id: "food-truck", label: "Food truck", emoji: "🚚", pricePerPerson: 2.5 },
      { id: "gere", label: "Deja gere", emoji: "✅" },
    ],
  },
  {
    id: "materiel-semi",
    question: "Besoin de materiel technique ?",
    type: "multi",
    options: [
      { id: "sono", label: "Sonorisation / Micro", emoji: "🎤", price: 80 },
      { id: "video-proj", label: "Vidéoprojecteur / Ecran", emoji: "📽️", price: 60 },
      { id: "eclairage", label: "Eclairage d'ambiance", emoji: "💡", price: 100 },
      { id: "scene", label: "Scene / Estrade", emoji: "🎭", price: 150 },
      { id: "non", label: "Rien de special", emoji: "❌" },
    ],
  },
  {
    id: "branding",
    question: "Personnalisation aux couleurs de l'entreprise ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "oui", label: "Oui (goodies, signalétique, kakemonos)", emoji: "🏢", price: 150 },
      { id: "leger", label: "Leger (quelques elements)", emoji: "🎨", price: 50 },
      { id: "non", label: "Non", emoji: "❌" },
    ],
  },
];

// =============================================================================
// AUTRE (Retraite, Pot de depart, Garden party, Communion...)
// =============================================================================
export const AUTRE_STEPS: QuestionStep[] = [
  {
    id: "type-autre",
    question: "Quel événement ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "retraite", label: "Depart en retraite", emoji: "🎉" },
      { id: "communion", label: "Communion", emoji: "✝️" },
      { id: "diplome", label: "Remise de diplome", emoji: "🎓" },
      { id: "garden-party", label: "Garden party", emoji: "🌿" },
      { id: "pot-depart", label: "Pot de depart", emoji: "🥂" },
      { id: "pendaison", label: "Pendaison de cremaillere", emoji: "🏠" },
      { id: "autre", label: "Autre", emoji: "✨" },
    ],
  },
  {
    id: "invites",
    question: "Combien d'invites ?",
    type: "slider",
    sliderMin: 5, sliderMax: 200, sliderStep: 5, sliderUnit: "invites",
  },
  {
    id: "lieu-autre",
    question: "Ou organiser ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "domicile", label: "A domicile", emoji: "🏠" },
      { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
      { id: "salle", label: "Salle", emoji: "🏢" },
      { id: "exterieur", label: "Plein air", emoji: "🌳" },
      { id: "recherche", label: "Aidez-moi", emoji: "🔍", price: 150 },
    ],
  },
  {
    id: "repas-autre",
    question: "Restauration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "traiteur", label: "Traiteur", emoji: "🍽️", pricePerPerson: 5 },
      { id: "buffet", label: "Buffet", emoji: "🥗", pricePerPerson: 4 },
      { id: "cocktail", label: "Cocktail", emoji: "🥂", pricePerPerson: 2.5 },
      { id: "gere", label: "Je gere", emoji: "👨‍🍳" },
    ],
  },
  {
    id: "deco-autre",
    question: "Décoration ?",
    type: "single",
    autoAdvance: true,
    options: [
      { id: "simple", label: "Simple", emoji: "🎈", price: 50 },
      { id: "soigne", label: "Soigne", emoji: "🎀", price: 150 },
      { id: "wow", label: "Spectaculaire", emoji: "🤩", price: 350 },
      { id: "non", label: "Pas de décoration", emoji: "❌" },
    ],
  },
  {
    id: "animations-autre",
    question: "Des animations ?",
    type: "multi",
    options: [
      { id: "musique", label: "DJ / Musique", emoji: "🎧", price: 100 },
      { id: "photo", label: "Photographe", emoji: "📸", price: 100 },
      { id: "diaporama", label: "Diaporama / Video souvenir", emoji: "📽️", price: 50 },
      { id: "discours", label: "Organisation des discours", emoji: "🎤", price: 30 },
      { id: "non", label: "Pas d'animation", emoji: "❌" },
    ],
  },
];

// =============================================================================
// Map type -> steps
// =============================================================================
export const EVENT_STEPS: Record<string, QuestionStep[]> = {
  mariage: MARIAGE_STEPS,
  anniversaire: ANNIVERSAIRE_STEPS,
  baptême: BAPTEME_STEPS,
  fiançailles: FIANCAILLES_STEPS,
  "baby-shower": BABY_SHOWER_STEPS,
  séminaire: SEMINAIRE_STEPS,
  autre: AUTRE_STEPS,
};
