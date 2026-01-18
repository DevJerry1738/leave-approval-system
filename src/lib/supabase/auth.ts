// src/lib/supabase/auth.ts
import { supabase } from "../supabase/client";

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // Clear local storage session if used
  if (typeof window !== "undefined") localStorage.removeItem("auth");
}
