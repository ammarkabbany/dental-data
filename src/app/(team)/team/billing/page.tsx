"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import PlanBillingPage from "./billing-tab";
import Header from "@/components/layout/Header";
import RedirectToAuth from "@/components/auth/custom-auth-redirect";
import RedirectToOnboarding from "@/components/auth/custom-onboard-redirect";
import { useTeam } from "@/providers/team-provider";

export default function BillingPage() {
  const {isLoading, isAuthenticated, currentTeam} = useTeam();
  if (isLoading) {
    return (
      <main className="bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <RedirectToAuth />;
  }

  if (!currentTeam) {
    return (
      <main className="bg-gradient-to-b from-background to-muted/30 min-h-screen">
        <Header />
        <RedirectToOnboarding />
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-8">
        <PlanBillingPage />
      </div>
    </main>
  );
}
