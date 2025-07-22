"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateTemplateForm } from "@/components/templates/create-template-form";

const CreateTemplatePage = () => {
  return (
    <ContentLayout title="Create Template">
      <CreateTemplateForm />
    </ContentLayout>
  );
};

export default CreateTemplatePage;