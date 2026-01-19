"use server";

import { createSupabaseServerClient } from "./server"; // Adjust path if needed
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createSupabaseServerClient(); // Await, no arg

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: error?.message || "Login failed" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return { error: profileError?.message || "Profile not found" };
  }

  const target = profile.role === "admin" ? "/dashboard/admin" : "/dashboard/staff";
  redirect(target);
}