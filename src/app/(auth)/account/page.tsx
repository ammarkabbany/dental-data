"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useAuth } from "@/providers/auth-provider"

export default function AccountPage() {
  const {user} = useAuth();

  return (
    <ContentLayout title="Account">
      <h1>Account Page</h1>
      <p>Welcome, {user?.email}</p>
    </ContentLayout>
  )
}