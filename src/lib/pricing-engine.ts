// Moteur de calcul de devis evenementiel
// Base sur les tarifs reels du marche France 2026

import { config } from "./config";

export interface DevisData {
  eventType: string;
  formula: string;
  guests: number;
  duration: string; // "demi-journee" | "journee" | "weekend"
  season: string; // "haute" | "basse"
  hasVenue: string; // "oui" | "non" | "recherche"
  venueType: string; // "salle" | "domaine" | "restaurant" | "exterieur" | "maison"
  decorLevel: string; // "simple" | "elabore" | "luxe"
  cateringHelp: string; // "oui" | "non" | "deja"
  entertainmentNeeds: string[]; // ["dj", "photo", "video", "animation"]
  floralBudget: string; // "petit" | "moyen" | "grand" | "non"
  stationery: boolean;
  sweetTable: boolean;
  setupTeardown: string; // "nous" | "client" | "partage"
  timeline: string; // "< 3 mois" | "3-6 mois" | "6-12 mois" | "> 12 mois"
  distanceKm: number;
  complexity: string; // auto-calculated
}

interface PriceBreakdown {
  basePrice: number;
  guestSupplement: number;
  durationSupplement: number;
  seasonSupplement: number;
  decorSupplement: number;
  venueSearchFee: number;
  cateringSearchFee: number;
  entertainmentFees: number;
  floralFee: number;
  stationeryFee: number;
  sweetTableFee: number;
  setupFee: number;
  urgencyFee: number;
  travelFee: number;
  total: number;
  depositAmount: number;
}

// Prix de base par formule
const BASE_PRICES: Record<string, number> = {
  "essentiel": 500,    // Coordination jour-J
  "premium": 1200,     // Organisation partielle
  "sur-mesure": 2500,  // Organisation complete
};

// Supplement par tranche d'invites (au-dela de 50)
function guestSupplement(guests: number, formula: string): number {
  if (guests <= 50) return 0;
  const extra = guests - 50;
  const perGuest = formula === "sur-mesure" ? 8 : formula === "premium" ? 5 : 3;
  return Math.round(extra * perGuest);
}

// Supplement duree
function durationSupplement(duration: string, basePrice: number): number {
  switch (duration) {
    case "weekend": return Math.round(basePrice * 0.6);
    case "journee": return 0;
    case "demi-journee": return Math.round(-basePrice * 0.2);
    default: return 0;
  }
}

// Supplement haute saison (mai-septembre)
function seasonSupplement(season: string, basePrice: number): number {
  return season === "haute" ? Math.round(basePrice * 0.15) : 0;
}

// Supplement decoration
function decorSupplement(level: string): number {
  switch (level) {
    case "luxe": return 800;
    case "elabore": return 350;
    case "simple": return 0;
    default: return 0;
  }
}

// Recherche de lieu
function venueSearchFee(hasVenue: string): number {
  return hasVenue === "recherche" ? 200 : 0;
}

// Recherche traiteur
function cateringSearchFee(help: string): number {
  return help === "oui" ? 150 : 0;
}

// Prestataires divertissement
function entertainmentFees(needs: string[]): number {
  let total = 0;
  if (needs.includes("dj")) total += 100;
  if (needs.includes("photo")) total += 80;
  if (needs.includes("video")) total += 80;
  if (needs.includes("animation")) total += 120;
  return total;
}

// Budget floral
function floralFee(budget: string): number {
  switch (budget) {
    case "grand": return 500;
    case "moyen": return 250;
    case "petit": return 100;
    default: return 0;
  }
}

// Installation/desinstallation
function setupFee(setup: string): number {
  return setup === "nous" ? 200 : setup === "partage" ? 100 : 0;
}

// Urgence (moins de 3 mois)
function urgencyFee(timeline: string, basePrice: number): number {
  return timeline === "< 3 mois" ? Math.round(basePrice * 0.25) : 0;
}

// Frais de deplacement
function travelFee(km: number): number {
  if (km <= config.freeKmRadius) return 0;
  return Math.round((km - config.freeKmRadius) * config.pricePerKm * 2); // aller-retour x nb visites estime
}

export function calculateDevis(data: DevisData): PriceBreakdown {
  const base = BASE_PRICES[data.formula] || 1200;
  const guestSupp = guestSupplement(data.guests, data.formula);
  const durationSupp = durationSupplement(data.duration, base);
  const seasonSupp = seasonSupplement(data.season, base);
  const decorSupp = decorSupplement(data.decorLevel);
  const venueSearch = venueSearchFee(data.hasVenue);
  const cateringSearch = cateringSearchFee(data.cateringHelp);
  const entertainment = entertainmentFees(data.entertainmentNeeds);
  const floral = floralFee(data.floralBudget);
  const stationery = data.stationery ? 150 : 0;
  const sweetTable = data.sweetTable ? 180 : 0;
  const setup = setupFee(data.setupTeardown);
  const urgency = urgencyFee(data.timeline, base);
  const travel = travelFee(data.distanceKm);

  const total = base + guestSupp + durationSupp + seasonSupp + decorSupp +
    venueSearch + cateringSearch + entertainment + floral + stationery +
    sweetTable + setup + urgency + travel;

  return {
    basePrice: base,
    guestSupplement: guestSupp,
    durationSupplement: durationSupp,
    seasonSupplement: seasonSupp,
    decorSupplement: decorSupp,
    venueSearchFee: venueSearch,
    cateringSearchFee: cateringSearch,
    entertainmentFees: entertainment,
    floralFee: floral,
    stationeryFee: stationery,
    sweetTableFee: sweetTable,
    setupFee: setup,
    urgencyFee: urgency,
    travelFee: travel,
    total: Math.round(total),
    depositAmount: Math.round(total * 0.3),
  };
}

export function getSeasonFromDate(dateStr: string): string {
  if (!dateStr) return "basse";
  const month = new Date(dateStr).getMonth() + 1;
  return (month >= 5 && month <= 9) ? "haute" : "basse";
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price);
}
