import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllBlockedDates, addBlockedDate, removeBlockedDate } from "@/lib/reservations";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const blocked = await getAllBlockedDates();
  return NextResponse.json({ blocked });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { date, reason } = await request.json();
  if (!date) return NextResponse.json({ error: "Date requise" }, { status: 400 });
  const blocked = await addBlockedDate(date, reason);
  return NextResponse.json({ blocked });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const ok = await removeBlockedDate(id);
  return NextResponse.json({ success: ok });
}
