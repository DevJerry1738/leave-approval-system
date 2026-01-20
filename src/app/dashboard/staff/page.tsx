import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import StaffDashboardClient from "./client";

export default async function StaffDashboard() {
  // Server-side role verification
  const supabase = await createSupabaseServerClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user?.user_metadata?.role;

  if (role !== "staff") {
    // Redirect non-staff users to admin dashboard
    redirect("/dashboard/admin");
  }

  return <StaffDashboardClient />;
}

