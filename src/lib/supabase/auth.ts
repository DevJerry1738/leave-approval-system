"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return { error: "Failed to initialize Supabase client - check your environment variables" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Auth error:", error);
      return { error: error.message || "Invalid email or password" };
    }

    if (!data.user) {
      return { error: "Login failed - no user returned" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      return { error: profileError.message || "Could not fetch user profile" };
    }

    if (!profile) {
      return { error: "Profile not found" };
    }

    const target = profile.role === "admin" ? "/dashboard/admin" : "/dashboard/staff";
    redirect(target);
  } catch (err) {
    // Re-throw redirect errors so they propagate properly
    if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
      throw err;
    }
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("Login action error:", err);
    return { error: errorMessage };
  }
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  redirect("/auth/login");
}