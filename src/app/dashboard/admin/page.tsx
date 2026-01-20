// src/app/dashboard/admin/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminDashboardClient from "./client";

export default async function AdminDashboard() {
  // Server-side role verification
  const supabase = await createSupabaseServerClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user?.user_metadata?.role;

  if (role !== "admin") {
    // Redirect non-admin users to staff dashboard
    redirect("/dashboard/staff");
  }

  return <AdminDashboardClient />;
}
