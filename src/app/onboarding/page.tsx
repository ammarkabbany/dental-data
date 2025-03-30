"use client";
import { CreateTeamOnboarding } from "@/components/onboarding/CreateTeamOnboarding";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useTeam } from "@/providers/team-provider";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import RedirectToAuth from "@/components/auth/custom-auth-redirect";

export default function OnboardingPage() {
  const { currentTeam, isLoading } = useTeam();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (currentTeam) {
    redirect("/dashboard");
  }

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen relative">
          {/* Back to Home Button */}
          <Link href="/" className="absolute top-4 left-4 z-10">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Go back
            </Button>
          </Link>

          {/* Left side - Onboarding Content */}
          <div className="flex-1 w-full bg-gradient-to-br from-background to-accent">
            <CreateTeamOnboarding />
          </div>

          {/* Right side - Image */}
          <div className="hidden lg:flex flex-1 relative bg-muted">
            <Image
              src="/dental-data.png"
              alt="Dental Data"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
        <RedirectToAuth />
      </SignedOut>
    </>
  );
}
