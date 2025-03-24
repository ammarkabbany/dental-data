"use client";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { DoctorCreateModal } from "@/components/doctors/create-doctor-modal";
import { MaterialCreateModal } from "@/components/materials/create-material-modal";
import { useQueryClient } from "@tanstack/react-query";
import DataFetcher from "@/components/data-fetcher";
import { Case } from "@/types";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { CASES_COLLECTION_ID } from "@/lib/constants";
import { useTeam } from "@/providers/team-provider";
import { redirect, RedirectType } from "next/navigation";
// import { CASES_COLLECTION_ID } from "@/lib/constants";
// import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
// import { Case } from "@/types";
// import { useAuth } from "@/providers/auth-provider";
// import { toast } from "sonner";
// import { useTeam } from "@/providers/team-provider";
// import SimplePageLoader from "@/components/page-loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {currentTeam, isLoading} = useTeam();
  if (!isLoading && !currentTeam) redirect('/team', RedirectType.replace)

  const { } = DataFetcher();

  const queryClient = useQueryClient();

  // Handle real-time updates
  useRealtimeUpdates(CASES_COLLECTION_ID, (payload) => {
    const events = payload.events; // e.g., 'databases.*.collections.*.documents.*.create'
    const caseData: Case = payload.payload; // The updated/created/deleted case

    if (events.includes("databases.*.collections.*.documents.*.create")) {
      // Add the new case to the cached data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // queryClient.setQueryData(['cases'], (oldData: any[]) => [caseData, ...oldData].sort((a,b) => b.date.localeCompare(a.date)));
      queryClient.invalidateQueries({ queryKey: ["cases"] });
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

  return (
    <AdminPanelLayout>
      {/* Modals */}
      {/*  */}
      <DoctorCreateModal />
      <MaterialCreateModal />
      {/*  */}
      {/* Content */}
      {children}
    </AdminPanelLayout>
  );
}
