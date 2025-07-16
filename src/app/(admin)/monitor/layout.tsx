"use client"
import NotFoundPage from "@/app/not-found";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import NotFound from "@/components/notFound";
import { useAuth } from "@/providers/auth-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <NotFoundPage />;
  }

  return (
    <AdminPanelLayout>
      <ContentLayout title="Monitor">
        <div className="space-y-4">{isAdmin ? children : <NotFound />}</div>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
