"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";

import NotFoundPage from "@/app/not-found";
import { useAuth } from "@/providers/auth-provider";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import AdminCasesDashboard from "./cases-admin";

export default function AdminTeamsPage() {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <NotFoundPage />;
  }

  return (
    <AdminPanelLayout>
      <ContentLayout title="Admin | Cases">
        <AdminCasesDashboard />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
