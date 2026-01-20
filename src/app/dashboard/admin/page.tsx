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

  if (profile.role !== "admin") {
    // Redirect non-admin users to staff dashboard
    redirect("/dashboard/staff");
  }

  return <AdminDashboardClient />;
}
