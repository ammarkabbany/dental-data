"use client";

import { useParams } from "next/navigation";
import NotFound from "@/components/notFound";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display
import { Terminal } from "lucide-react"; // For error display
import { useGetTemplateById } from "@/features/templates/hooks/use-get-template-by-id";
import { EditTemplateFormSkeleton } from "@/components/templates/edit-template-form-skeleton";
import { UpdateTemplateForm } from "@/components/templates/update-template-form";

export default function EditTemplatePage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const { data: templateData, isFetching: isLoading, isError } = useGetTemplateById(templateId);

  const pageTitle = isLoading
    ? "Loading Template..."
    : isError
      ? "Error"
      : !templateData
        ? "Template Not Found"
        : `Edit Template: ${templateData.name}`;

  if (isLoading) {
    return (
      <ContentLayout title={pageTitle}>
        <div className="container mx-auto">
          <EditTemplateFormSkeleton />
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
            <AlertTitle>Error Fetching Template Data</AlertTitle>
            <AlertDescription>
              There was a problem retrieving the template details. Please ensure the
              Template ID is correct or try again later. If the problem persists,
              contact support.
            </AlertDescription>
          </Alert>
        </div>
      </ContentLayout>
    );
  }

  if (!templateData) {
    return (
      <ContentLayout title={pageTitle}>
        <div className="container mx-auto py-10">
          {/* Assuming NotFound component is styled appropriately.
              If not, wrap it or style it here for better presentation. */}
          <NotFound
            title="Template Not Found"
            href="/dashboard/templates"
            message="The template you are looking for could not be found or you do not have permission to view it."
          />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={pageTitle}>
      <div className="container mx-auto">
        <UpdateTemplateForm template={templateData} />
      </div>
    </ContentLayout>
  );
}
