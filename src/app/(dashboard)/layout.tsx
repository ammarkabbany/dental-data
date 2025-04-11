"use client";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { useQueryClient } from "@tanstack/react-query";
import { Case, Doctor } from "@/types";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import {
  CASES_COLLECTION_ID,
  DOCTORS_COLLECTION_ID,
  MATERIALS_COLLECTION_ID,
  TEMPLATES_COLLECTION_ID,
} from "@/lib/constants";
import DataFetcher from "@/components/data-fetcher";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import RedirectToAuth from "@/components/auth/custom-auth-redirect";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useTeam } from "@/providers/team-provider";
import RedirectToOnboarding from "@/components/auth/custom-onboard-redirect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const {currentTeam, isLoading, isAuthenticated} = useTeam();

  // Handle real-time updates
  useRealtimeUpdates(CASES_COLLECTION_ID, (payload) => {
    const events = payload.events; // e.g., 'databases.*.collections.*.documents.*.create'
    const caseData: Case = payload.payload; // The updated/created/deleted case

    // Add the new case to the cached data
    // queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    // queryClient.setQueryData(['cases'], (oldData: any[]) => [caseData, ...oldData].sort((a,b) => b.date.localeCompare(a.date)));
    // queryClient.refetchQueries({ queryKey: ["cases"] });
    // if (caseData.userId !== user?.$id) {
    //   toast.success(`New case added by team`);
    if (events.includes("databases.*.collections.*.documents.*.create")) {
      queryClient.setQueryData(['cases'], (oldData: any[]) => [caseData, ...oldData]);
    }
      else if (
      events.includes("databases.*.collections.*.documents.*.update")
    ) {
      // Update the existing case in the cached data
      queryClient.setQueryData(["cases"], (oldData: any[]) =>
        oldData.map((c) => (c.$id === caseData.$id ? caseData : c))
      );
    }
    // else if (
    //   events.includes("databases.*.collections.*.documents.*.delete")
    // ) {
    //   // Remove the deleted case from the cached data
    //   queryClient.setQueryData(["cases"], (oldData: any[]) =>
    //     oldData.filter((c) => c.$id !== caseData.$id)
    //   );
    //   // if (caseData.userId !== user?.$id) {
    //   //   toast.success(`case deleted by team`);
    //   // }
    //   queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    // }
  });
  useRealtimeUpdates(MATERIALS_COLLECTION_ID, () => {
    queryClient.invalidateQueries({ queryKey: ["materials"] });
  });
  useRealtimeUpdates(TEMPLATES_COLLECTION_ID, () => {
    queryClient.invalidateQueries({ queryKey: ["templates"] });
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    ); 
  }
  if (!currentTeam && isAuthenticated) {
    return <RedirectToOnboarding />;
  }

  return (
    <>
      <SignedIn>
        <AdminPanelLayout>
          <DataFetcher />
          {children}
        </AdminPanelLayout>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
          <RedirectToAuth />
        </div>
      </SignedOut>
    </>
  );
}
