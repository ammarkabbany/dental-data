"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { useAuth } from "@/providers/auth-provider";
import AdminDashboard from "./admin-dashboard";
import NotFound from "@/components/notFound";
import NotFoundPage from "@/app/not-found";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

const AdminDashboardPage = () => {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <NotFoundPage />;
  }

  return (
    <AdminPanelLayout>
      <ContentLayout title="Admin">
        <div className="space-y-4">
          {isAdmin ? <AdminDashboard /> : <NotFound />}
        </div>
      </ContentLayout>
    </AdminPanelLayout>
  );
};

export default AdminDashboardPage;
