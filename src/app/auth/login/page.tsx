"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Home, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAction } from "@/lib/supabase/auth";

export default function LoginPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setAuthError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setAuthError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Link href="/" className="absolute top-6 left-6">
        <Home size={22} />
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Login to access the leave request system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={handleSubmit} className="space-y-5">
            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required minLength={6}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}