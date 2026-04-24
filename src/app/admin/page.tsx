import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllReservations, getAllBlockedDates } from "@/lib/reservations";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const reservations = await getAllReservations();
  const blocked = await getAllBlockedDates();
  return <AdminDashboard initialReservations={reservations} initialBlocked={blocked} />;
}
