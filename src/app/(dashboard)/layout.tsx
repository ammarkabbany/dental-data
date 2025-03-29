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
import SimplePageLoader from "@/components/page-loader";
import TeamNotFound from "@/components/team-not-found";
import Header from "@/components/layout/Header";
import { useAuth } from "@/providers/auth-provider";
import { useGetMembership } from "@/features/team/hooks/use-get-membership";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const {
    isLoading: isUserLoading,
    isAuthenticated,
    user,
    handleLogin,
  } = useAuth();
  const {
    data: membership,
    isLoading: isMembershipLoading,
    isError,
  } = useGetMembership();
  const pathname = usePathname();

  // Handle real-time updates
  useRealtimeUpdates(CASES_COLLECTION_ID, (payload) => {
    const events = payload.events; // e.g., 'databases.*.collections.*.documents.*.create'
    const caseData: Case = payload.payload; // The updated/created/deleted case

    // Add the new case to the cached data
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    // queryClient.setQueryData(['cases'], (oldData: any[]) => [caseData, ...oldData].sort((a,b) => b.date.localeCompare(a.date)));
    queryClient.refetchQueries({ queryKey: ["cases"] });
    // if (caseData.userId !== user?.$id) {
    //   toast.success(`New case added by team`);
    // }
    // } else if (
    //   events.includes("databases.*.collections.*.documents.*.update")
    // ) {
    //   // Update the existing case in the cached data
    //   queryClient.setQueryData(["cases"], (oldData: any[]) =>
    //     oldData.map((c) => (c.$id === caseData.$id ? caseData : c))
    //   );
    // } else if (
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
  });
  useRealtimeUpdates(MATERIALS_COLLECTION_ID, () => {
    queryClient.invalidateQueries({ queryKey: ["materials"] });
  });
  useRealtimeUpdates(TEMPLATES_COLLECTION_ID, () => {
    queryClient.invalidateQueries({ queryKey: ["templates"] });
  });

  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      handleLogin(pathname);
    }
  }, [isUserLoading, isAuthenticated]);

  // Show loading state when user or membership is loading
  if (isUserLoading || (isAuthenticated && isMembershipLoading && !isError)) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <SimplePageLoader isLoading fullScreen />
        </div>
      </div>
    );
  }

  // Show TeamNotFound when user is authenticated but no membership is found
  if (isAuthenticated && user && !membership && !isMembershipLoading) {
    return (
      <div>
        <Header />
        <TeamNotFound />
      </div>
    );
  }

  // If user is authenticated and has membership, show the dashboard
  if (isAuthenticated && membership) {
    return (
      <AdminPanelLayout>
        <DataFetcher />
        {children}
      </AdminPanelLayout>
    );
  }

  // Fallback for any other case (should not normally happen)
  return (
    <div>
      <Header />
      <div className="container mx-auto p-8 text-center">
        <SimplePageLoader fullScreen isLoading />
      </div>
    </div>
  );
}
