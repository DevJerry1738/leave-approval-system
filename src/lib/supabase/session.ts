// src/lib/supabase/session.ts
import { supabase } from "./client";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }
  return session;
}
