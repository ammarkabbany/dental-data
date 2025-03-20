"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { TemplateCreateModal } from "@/components/templates/create-template-modal";
import { TemplateCard } from "@/components/templates/template-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetTemplates } from "@/features/templates/hooks/use-get-templates";
import { Modals, useModalStore } from "@/store/modal-store";
import { PlusIcon } from "@radix-ui/react-icons";
import * as React from "react";

export default function TemplatesPage() {
  const {data, isLoading} = useGetTemplates();
  const [searchTerm, setSearchTerm] = React.useState('');
  const {openModal} = useModalStore();
  return (
    <>
    <TemplateCreateModal />
    <ContentLayout title="Templates">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          variant={"default"}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="w-full sm:max-w-sm rounded-md px-3 py-2"
        />
        <div className="ml-auto">
          <Button onClick={() => openModal(Modals.CREATE_TEMPLATE_MODAL)} variant="default" className="py-2">
            <PlusIcon />
            Add Template
          </Button>
          {/* <CreateCaseTemplateDialog /> */}
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {data && data.filter(t => {
          return searchTerm ? t.name.toLowerCase().includes(searchTerm) : true;
        }).map((template) => (
            <TemplateCard
              key={template.$id}
              template={template}
            />
          ))}
        </div>
      )}
    </ContentLayout>
    </>
  )
}