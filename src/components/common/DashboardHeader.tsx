"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/supabase/auth";
import * as React from "react";

export default function DashboardHeader({ title }: { title: string }) {
  const router = useRouter();

   const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login"); // redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div>
        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
}


