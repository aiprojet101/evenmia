import { NextRequest, NextResponse } from "next/server";
import { getAvailabilityForMonth } from "@/lib/reservations";

// Endpoint public : retourne les disponibilites pour un mois donne
// Format : { "2026-04-25": "free" | "partial" | "full" | "blocked", ... }
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()), 10);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1), 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Annee/mois invalide" }, { status: 400 });
  }

  const availability = await getAvailabilityForMonth(year, month);
  return NextResponse.json({ year, month, availability });
}
