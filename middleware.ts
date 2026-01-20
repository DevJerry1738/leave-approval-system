// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Validate environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables in middleware");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Create Supabase client with proper cookie handling
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            response.cookies.set(name, value, options);
          },
          remove(name: string, options) {
            response.cookies.delete(name);
          },
        },
      }
    );

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Not logged in → redirect to login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Query profiles table for actual role (not from user_metadata)
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || !profile) {
      console.error("Middleware - Profile fetch error:", error);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const role = profile.role;

    // Admin dashboard protection
    if (req.nextUrl.pathname.startsWith("/dashboard/admin") && role !== "admin") {
      console.log("Middleware - Non-admin user accessing admin, redirecting to staff");
      return NextResponse.redirect(new URL("/dashboard/staff", req.url));
    }

    // Staff dashboard protection
    if (req.nextUrl.pathname.startsWith("/dashboard/staff") && role !== "staff") {
      console.log("Middleware - Non-staff user accessing staff, redirecting to admin");
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
