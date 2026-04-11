// Moteur de calcul de devis base sur les reponses du questionnaire adaptatif

import { config } from "./config";
import { EVENT_STEPS, type QuestionStep } from "./questions";

// Prix de base par formule Evenmia (coordination/organisation)
const BASE_COORDINATION = 500;

// Calculer le prix a partir des reponses
export function calculateFromAnswers(
  eventType: string,
  answers: Record<string, unknown>,
  formula: string
): { total: number; breakdown: { label: string; amount: number }[]; deposit: number } {
  const steps = EVENT_STEPS[eventType] || [];
  const breakdown: { label: string; amount: number }[] = [];

  // 1. Prix de base formule
  let base = BASE_COORDINATION;
  if (formula === "premium") base = 1200;
  if (formula === "sur-mesure") base = 2500;
  breakdown.push({ label: `Formule ${formula === "essentiel" ? "Essentiel" : formula === "premium" ? "Premium" : "Sur-mesure"}`, amount: base });

  // 2. Supplement invites
  const invitesKeys = ["invites", "participants"];
  let invites = 0;
  for (const key of invitesKeys) {
    if (typeof answers[key] === "number") {
      invites = answers[key] as number;
      break;
    }
  }
  if (invites > 50) {
    const perGuest = formula === "sur-mesure" ? 8 : formula === "premium" ? 5 : 3;
    const supp = Math.round((invites - 50) * perGuest);
    breakdown.push({ label: `Supplement ${invites} invites`, amount: supp });
  }

  // 3. Parcourir toutes les reponses et additionner les prix des options
  for (const step of steps) {
    const answer = answers[step.id];
    if (!answer) continue;

    if (step.type === "single" && step.options) {
      const opt = step.options.find(o => o.id === answer);
      if (opt?.price && opt.price > 0) {
        breakdown.push({ label: opt.label, amount: opt.price });
      }
    }

    if (step.type === "multi" && Array.isArray(answer) && step.options) {
      for (const val of answer) {
        const opt = step.options.find(o => o.id === val);
        if (opt?.price && opt.price > 0) {
          breakdown.push({ label: opt.label, amount: opt.price });
        }
      }
    }

    if (step.type === "boolean" && answer === true) {
      // Some booleans have associated costs handled via pricing note
    }
  }

  // 4. Frais de deplacement
  const distKm = typeof answers._distanceKm === "number" ? answers._distanceKm as number : 0;
  if (distKm > config.freeKmRadius) {
    const travel = Math.round((distKm - config.freeKmRadius) * config.pricePerKm * 4); // ~4 deplacements
    breakdown.push({ label: `Deplacement (${distKm} km)`, amount: travel });
  }

  // 5. Haute saison
  const dateStr = answers._date as string;
  if (dateStr) {
    const month = new Date(dateStr).getMonth() + 1;
    if (month >= 5 && month <= 9) {
      const seasonSupp = Math.round(base * 0.15);
      breakdown.push({ label: "Haute saison (mai-sept)", amount: seasonSupp });
    }
  }

  const total = breakdown.reduce((sum, b) => sum + b.amount, 0);
  return {
    total: Math.round(total),
    breakdown,
    deposit: Math.round(total * 0.3),
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price);
}
