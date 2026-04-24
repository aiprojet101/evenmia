import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from "@/lib/reservations";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reservations = await getAllReservations();
  return NextResponse.json({ reservations });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const reservation = await createReservation({
    clientName: body.clientName,
    clientEmail: body.clientEmail,
    clientPhone: body.clientPhone,
    eventType: body.eventType || "autre",
    eventDate: body.eventDate,
    timeSlot: body.timeSlot || "journee",
    prestations: body.prestations || [],
    lieu: body.lieu,
    notes: body.notes,
    totalPrice: body.totalPrice,
    depositAmount: body.depositAmount,
    status: body.status || "pending",
  });
  return NextResponse.json({ reservation });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, updates } = await request.json();
  const reservation = await updateReservation(id, updates);
  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reservation });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const ok = await deleteReservation(id);
  return NextResponse.json({ success: ok });
}
