"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateCaseForm } from "@/components/cases/create-case-form";

export default function CaseCreationPage() {

  return (
    <ContentLayout title="Cases Form">
      <div className="container flex items-center justify-center">
        <CreateCaseForm />
      </div>
    </ContentLayout>
  )
}