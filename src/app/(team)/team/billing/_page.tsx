"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import PlanBillingPage from "./billing-tab";
import Header from "@/components/layout/Header";
import RedirectToAuth from "@/components/auth/custom-auth-redirect";
import RedirectToOnboarding from "@/components/auth/custom-onboard-redirect";
import { useTeam } from "@/providers/team-provider";
import { usePermission } from "@/hooks/use-permissions";
import ForbiddenPage from "@/components/forbidden";

export default function BillingPage() {
  const { isLoading, isAuthenticated, currentTeam, userRole } = useTeam();
  const hasFinancialAccess = usePermission(userRole).checkPermission('financials', 'has')
  if (isLoading) {
    return (
      <main className="">
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
      <main className="">
        <Header />
        <RedirectToOnboarding />
      </main>
    );
  }

  if (!hasFinancialAccess) {
    return (
      <main className="">
        <Header />
        <div className="flex items-center justify-center min-h-[90vh]">
          <ForbiddenPage />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-8">
        <PlanBillingPage />
      </div>
    </main>
  );
}
