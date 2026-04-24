// Auth admin simple : mot de passe env + cookie signe
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "evenmia_admin";
const SECRET = process.env.ADMIN_SECRET || "dev-secret-change-me";

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSessionToken(): string {
  const timestamp = Date.now();
  const payload = String(timestamp);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (expected !== signature) return false;
  const timestamp = parseInt(payload, 10);
  const age = Date.now() - timestamp;
  return age < 7 * 24 * 3600 * 1000; // 7 jours
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 3600,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "evenmia2026";
  return password === expected;
}
