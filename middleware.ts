// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: Object.fromEntries(req.headers.entries()) as Record<
        string,
        string
      >,
    },
  });

  // Parse access token from cookies
  const access_token = req.cookies.get("sb-access-token")?.value;

  if (!access_token) {
    // Not logged in → redirect to login
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Verify session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(access_token);

  if (error || !user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const role = user.user_metadata.role;

  // Admin dashboard protection
  if (req.nextUrl.pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/staff", req.url));
  }

  // Staff dashboard protection
  if (req.nextUrl.pathname.startsWith("/dashboard/staff") && role !== "staff") {
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
