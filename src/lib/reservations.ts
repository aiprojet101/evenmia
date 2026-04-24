// Gestion des reservations et indisponibilites — stockage JSON local
import { promises as fs } from "fs";
import path from "path";

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string; // ISO date (YYYY-MM-DD)
  timeSlot?: "matin" | "midi" | "soir" | "journee";
  prestations: string[];
  lieu?: string;
  notes?: string;
  totalPrice?: number;
  depositAmount?: number;
  status: ReservationStatus;
  stripeSessionId?: string;
  stripePaymentLinkId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedDate {
  id: string;
  date: string; // ISO date
  reason?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const RES_FILE = path.join(DATA_DIR, "reservations.json");
const BLOCKED_FILE = path.join(DATA_DIR, "blocked-dates.json");

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// =============================================================================
// Reservations
// =============================================================================

export async function getAllReservations(): Promise<Reservation[]> {
  return readJson<Reservation>(RES_FILE);
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  const all = await getAllReservations();
  return all.find((r) => r.id === id) || null;
}

export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  const all = await getAllReservations();
  return all.filter((r) => r.eventDate === date && r.status !== "cancelled");
}

export async function createReservation(
  input: Omit<Reservation, "id" | "createdAt" | "updatedAt">,
): Promise<Reservation> {
  const all = await getAllReservations();
  const now = new Date().toISOString();
  const reservation: Reservation = {
    ...input,
    id: `EVM-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  all.push(reservation);
  await writeJson(RES_FILE, all);
  return reservation;
}

export async function updateReservation(
  id: string,
  updates: Partial<Reservation>,
): Promise<Reservation | null> {
  const all = await getAllReservations();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJson(RES_FILE, all);
  return all[idx];
}

export async function deleteReservation(id: string): Promise<boolean> {
  const all = await getAllReservations();
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === all.length) return false;
  await writeJson(RES_FILE, filtered);
  return true;
}

// =============================================================================
// Blocked dates
// =============================================================================

export async function getAllBlockedDates(): Promise<BlockedDate[]> {
  return readJson<BlockedDate>(BLOCKED_FILE);
}

export async function addBlockedDate(date: string, reason?: string): Promise<BlockedDate> {
  const all = await getAllBlockedDates();
  const existing = all.find((b) => b.date === date);
  if (existing) return existing;
  const blocked: BlockedDate = {
    id: `BLK-${Date.now()}`,
    date,
    reason,
    createdAt: new Date().toISOString(),
  };
  all.push(blocked);
  await writeJson(BLOCKED_FILE, all);
  return blocked;
}

export async function removeBlockedDate(id: string): Promise<boolean> {
  const all = await getAllBlockedDates();
  const filtered = all.filter((b) => b.id !== id);
  if (filtered.length === all.length) return false;
  await writeJson(BLOCKED_FILE, filtered);
  return true;
}

// =============================================================================
// Disponibilite
// =============================================================================

export async function isDateAvailable(date: string): Promise<boolean> {
  const blocked = await getAllBlockedDates();
  if (blocked.some((b) => b.date === date)) return false;
  const reservations = await getReservationsByDate(date);
  // Si 3 reservations ou plus ce jour-la → complet (Anais peut enchainer jusqu'a 3 evenements)
  return reservations.length < 3;
}

export async function getAvailabilityForMonth(
  year: number,
  month: number,
): Promise<Record<string, "free" | "partial" | "full" | "blocked">> {
  const blocked = await getAllBlockedDates();
  const reservations = await getAllReservations();
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<string, "free" | "partial" | "full" | "blocked"> = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (blocked.some((b) => b.date === date)) {
      result[date] = "blocked";
      continue;
    }
    const count = reservations.filter(
      (r) => r.eventDate === date && r.status !== "cancelled",
    ).length;
    if (count === 0) result[date] = "free";
    else if (count < 3) result[date] = "partial";
    else result[date] = "full";
  }
  return result;
}
