"use client";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { useQueryClient } from "@tanstack/react-query";
import { AuditLogEntry, Case } from "@/types";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import {
  AUDIT_LOGS_COLLECTION_ID,
  CASES_COLLECTION_ID,
  TEMPLATES_COLLECTION_ID,
} from "@/lib/constants";
import DataFetcher from "@/components/data-fetcher";
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
  const { currentTeam, isLoading, isAuthenticated } = useTeam();

  // Handle real-time updates
  useRealtimeUpdates(CASES_COLLECTION_ID, (payload) => {
    const events = payload.events; // e.g., 'databases.*.collections.*.documents.*.create'
    const caseData: Case = payload.payload; // The updated/created/deleted case

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
    else if (
      events.includes("databases.*.collections.*.documents.*.delete")
    ) {
      //   // Remove the deleted case from the cached data
      queryClient.setQueryData(["cases"], (oldData: any[]) =>
        oldData.filter((c) => c.$id !== caseData.$id)
      );
    }
    // queryClient.refetchQueries({ queryKey: ["dashboard"] });
  });
  // useRealtimeUpdates(AUDIT_LOGS_COLLECTION_ID, (payload) => {
  //   const events = payload.events;
  //   const entryData: AuditLogEntry = payload.payload;

  //   if (events.includes("databases.*.collections.*.documents.*.create")) {
  //     queryClient.setQueryData(['logs'], (oldData: any[]) => [entryData, ...oldData]);
  //   }
  //   else if (
  //     events.includes("databases.*.collections.*.documents.*.update")
  //   ) {
  //     queryClient.setQueryData(["logs"], (oldData: any[]) =>
  //       oldData.map((c) => (c.$id === entryData.$id ? entryData : c))
  //     );
  //   }
  //   else if (
  //     events.includes("databases.*.collections.*.documents.*.delete")
  //   ) {
  //     queryClient.setQueryData(["logs"], (oldData: any[]) =>
  //       oldData.filter((c) => c.$id !== entryData.$id)
  //     );
  //   }
  // });
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
      {isAuthenticated ? (
        <AdminPanelLayout>
          <DataFetcher />
          {children}
        </AdminPanelLayout>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
          <RedirectToAuth />
        </div>
      )
      }
    </>
  );
}
