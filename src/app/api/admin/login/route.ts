import { NextRequest, NextResponse } from "next/server";
import { setAdminSession, clearAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
