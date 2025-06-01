// src/app/(dashboard)/dashboard/cases/[caseId]/edit/page.tsx
"use client";

import { useParams, notFound } from 'next/navigation';
import { useGetCaseById } from "@/features/cases/hooks/use-get-case-by-id";
import PageLoader from "@/components/page-loader";
import NotFound from "@/components/notFound"; // Assuming you have a more generic NotFound component
import { EditCaseForm } from "@/components/cases/edit-case-form";

export default function EditCasePage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const { data: caseData, isLoading, isError } = useGetCaseById(caseId);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    // You might want a more user-friendly error display here
    return <div className="container mx-auto py-8 text-center">Error fetching case data. Please try again later.</div>;
  }

  if (!caseData) {
    // Using the imported NotFound component or next/navigation's notFound
    return <NotFound />;
  }

  return (
    <div className="container mx-auto py-8">
      {/* The EditCaseForm will contain its own title like "Edit Case Details" */}
      <EditCaseForm selectedCase={caseData} />
    </div>
  );
}
