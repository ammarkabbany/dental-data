"use client";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { useQueryClient } from "@tanstack/react-query";
import DataFetcher from "@/components/data-fetcher";
import { Case, Doctor } from "@/types";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { CASES_COLLECTION_ID, DOCTORS_COLLECTION_ID, MATERIALS_COLLECTION_ID } from "@/lib/constants";
import { useTeam } from "@/providers/team-provider";
import { redirect, RedirectType } from "next/navigation";
import RouteChangeLoader from "@/components/route-change-loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {currentTeam, isLoading} = useTeam();
  if (!isLoading && !currentTeam) redirect('/', RedirectType.replace)

  DataFetcher();

  const queryClient = useQueryClient();

  // Handle real-time updates
  useRealtimeUpdates(CASES_COLLECTION_ID, (payload) => {
    const events = payload.events; // e.g., 'databases.*.collections.*.documents.*.create'
    const caseData: Case = payload.payload; // The updated/created/deleted case

    if (events.includes("databases.*.collections.*.documents.*.create")) {
      // Add the new case to the cached data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // queryClient.setQueryData(['cases'], (oldData: any[]) => [caseData, ...oldData].sort((a,b) => b.date.localeCompare(a.date)));
      queryClient.refetchQueries({ queryKey: ["cases"] });
      // if (caseData.userId !== user?.$id) {
      //   toast.success(`New case added by team`);
      // }
    } else if (
      events.includes("databases.*.collections.*.documents.*.update")
    ) {
      // Update the existing case in the cached data
      queryClient.setQueryData(["cases"], (oldData: any[]) =>
        oldData.map((c) => (c.$id === caseData.$id ? caseData : c))
      );
    } else if (
      events.includes("databases.*.collections.*.documents.*.delete")
    ) {
      // Remove the deleted case from the cached data
      queryClient.setQueryData(["cases"], (oldData: any[]) =>
        oldData.filter((c) => c.$id !== caseData.$id)
      );
      // if (caseData.userId !== user?.$id) {
      //   toast.success(`case deleted by team`);
      // }
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
  useRealtimeUpdates(DOCTORS_COLLECTION_ID, (payload) => {
    const events = payload.events; // e.g., 'databases.*.collections.*.documents.*.create'
    const doctor: Doctor = payload.payload; // The updated/created/deleted doctor
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
    // if (events.includes("databases.*.collections.*.documents.*.create")) {
    //   queryClient.invalidateQueries({ queryKey: ["doctors"] });
    // }
    // if (events.includes("databases.*.collections.*.documents.*.update")) {
    //   queryClient.invalidateQueries({ queryKey: ["doctors"] });
    // }
    // if (events.includes("databases.*.collections.*.documents.*.delete")) {
    //   queryClient.invalidateQueries({ queryKey: ["doctors"] });
    // }
  })
  useRealtimeUpdates(MATERIALS_COLLECTION_ID, () => {
    queryClient.invalidateQueries({ queryKey: ["materials"] });
  })

  return (
    <AdminPanelLayout>
      {/* Content */}
      {isLoading && <RouteChangeLoader />}
      {children}
    </AdminPanelLayout>
  );
}
