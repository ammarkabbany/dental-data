// src/app/(dashboard)/dashboard/cases/[caseId]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useGetCaseById } from "@/features/cases/hooks/use-get-case-by-id";
// PageLoader is removed as EditCaseFormSkeleton replaces it for this page
import NotFound from "@/components/notFound";
import { EditCaseForm } from "@/components/cases/edit-case-form";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { EditCaseFormSkeleton } from "@/components/cases/edit-case-form-skeleton"; // Import Skeleton
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display
import { Terminal } from "lucide-react"; // For error display

export default function EditCasePage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const { data: caseData, isLoading, isError } = useGetCaseById(caseId);

  const pageTitle = isLoading
    ? "Loading Case..."
    : isError
      ? "Error"
      : !caseData
        ? "Case Not Found"
        : `Edit Case: ${caseData.patient || caseId}`;

  if (isLoading) {
    return (
      <ContentLayout title={pageTitle}>
        <div className="container mx-auto">
          <EditCaseFormSkeleton />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout title={pageTitle}>
        <div className="container mx-auto py-10 flex justify-center">
          <Alert variant="destructive" className="w-full max-w-lg">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Fetching Case Data</AlertTitle>
            <AlertDescription>
              There was a problem retrieving the case details. Please ensure the
              Case ID is correct or try again later. If the problem persists,
              contact support.
            </AlertDescription>
          </Alert>
        </div>
      </ContentLayout>
    );
  }

  if (!caseData) {
    return (
      <ContentLayout title={pageTitle}>
        <div className="container mx-auto py-10">
          {/* Assuming NotFound component is styled appropriately.
              If not, wrap it or style it here for better presentation. */}
          <NotFound
            title="Case Not Found"
            href="/dashboard/cases"
            message="The case you are looking for could not be found or you do not have permission to view it."
          />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={pageTitle}>
      <div className="container mx-auto">
        <EditCaseForm selectedCase={caseData} />
      </div>
    </ContentLayout>
  );
}
