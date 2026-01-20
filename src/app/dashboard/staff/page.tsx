//src/app/dashboard/staff/page.tsx
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

  // Query profiles table for role (role is stored in DB, not user_metadata)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    console.error("Profile fetch error:", error);
    redirect("/auth/login");
  }

  if (profile.role !== "staff") {
    // Redirect non-staff users to admin dashboard
    redirect("/dashboard/admin");
  }

  return <StaffDashboardClient />;
}

