"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";

import { useGetAdminTeams } from "@/features/admin/hooks/use-get-all-teams";
import NotFoundPage from "@/app/not-found";
import { useAuth } from "@/providers/auth-provider";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import TeamsAdminDashboard from "./teams-admin";

export default function AdminTeamsPage() {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <NotFoundPage />;
  }

  return (
    <AdminPanelLayout>
      <ContentLayout title="Admin | Teams">
        <TeamsAdminDashboard />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
