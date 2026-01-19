import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { requireAuth } from "@/lib/supabase/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leave Request System",
  description: "Employee leave request portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  await requireAuth(); // Ensure user is authenticated for all pages
  
  return (
    <html lang="en">
      {/* suppressHydrationWarning={true} tells React to ignore 
        attributes added by browser extensions (like ColorZilla) 
        to the body tag.
      */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}