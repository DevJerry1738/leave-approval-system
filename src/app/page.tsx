import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const features = [
    "Request Leave",
    "Approve Requests",
    "Track Leave History",
  ];

  return (
    <main className="min-h-screen flex flex-col font-sans">
      {/* ... Header ... */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-lg font-semibold tracking-tight">
          Leave Request System
        </h1>
        <nav className="text-sm text-muted-foreground transition-colors hover:text-primary">
          <Link href="#">Help & Support</Link>
        </nav>
      </header>

      {/* ... Hero Section ... */}
      <section className="relative flex flex-col items-center justify-center text-center flex-1 px-6 py-12 sm:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-bg.png"
            alt="Office background"
            fill
            priority
            className="object-cover"
            // REMOVED: quality={85} (This caused the error)
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl text-white space-y-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Simplify Your <br className="hidden sm:block" />
            <span className="text-primary-foreground/90">Leave Management</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            The streamlined platform for employees to submit requests and for managers 
            to track and approve time off effortlessly.
          </p>
          <div className="pt-4">
            <Button size="lg" className="h-12 px-8 text-base shadow-lg" asChild>
              <Link href="/auth/login">Login to Continue</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-4xl">
          {features.map((feature, index) => (
            <FeatureCard key={index} text={feature} />
          ))}
        </div>
      </section>

      {/* ... Footer ... */}
      <footer className="border-t px-8 py-6 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between bg-background gap-4">
        {/* Added suppressHydrationWarning to prevent Date mismatches */}
        <span suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Company Name. All rights reserved.
        </span>
        <div className="flex gap-6">
          <Link href="#" className="hover:underline hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="hover:underline hover:text-foreground">Support</Link>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ text }: { text: string }) {
  return (
    <Card className="bg-background/95 backdrop-blur-sm border-none shadow-md transition-transform hover:-translate-y-1 duration-300">
      <CardContent className="flex items-center justify-center sm:justify-start gap-3 py-6 px-6">
        <CheckCircle className="text-primary shrink-0" size={20} />
        <span className="text-sm font-semibold">{text}</span>
      </CardContent>
    </Card>
  );
}