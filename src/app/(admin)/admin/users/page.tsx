"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";

import NotFoundPage from "@/app/not-found";
import { useAuth } from "@/providers/auth-provider";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import AdminUsersDashboard from "./users-admin";

export default function AdminUsersPage() {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <NotFoundPage />;
  }

  return (
    <AdminPanelLayout>
      <ContentLayout title="Admin | Users">
        <AdminUsersDashboard />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
