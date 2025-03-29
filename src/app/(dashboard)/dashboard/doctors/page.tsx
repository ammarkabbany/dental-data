"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DoctorCreateModal } from "@/components/doctors/create-doctor-modal";
import { DoctorsDataTable } from "@/components/doctors/data-table";
import NotFoundPage from "@/components/notFound";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useGetDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { useGetMembership } from "@/features/team/hooks/use-get-membership";
import { usePermission } from "@/hooks/use-permissions";
import { Modals, useModalStore } from "@/store/modal-store";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function CasesPage() {
  const {data: membership, isLoading} = useGetMembership();

  const {openModal} = useModalStore();

  const canCreate = usePermission(membership?.roles[0] || null).checkPermission('doctors', 'create');

  const { data: doctors, isLoading: isDoctorsLoading } = useGetDoctors();

  if (!isLoading && !membership) {
    return (
      <ContentLayout title="Doctors">
        <NotFoundPage className="h-[80vh]" href="/dashboard" />
      </ContentLayout>
    );
  }

  if (isDoctorsLoading || isLoading) return (
    <ContentLayout title="Doctors">
      <div className="h-full min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </ContentLayout>
  );

  return (
    <>
      <DoctorCreateModal />
      <ContentLayout title="Doctors">
        <div className="flex justify-between items-center">
          <p>
            Manage your doctors
          </p>
          {canCreate &&
          <Button className="transition" onClick={() => openModal(Modals.CREATE_DOCTOR_MODAL)}>
            <HugeiconsIcon icon={Add01Icon} /> Add Doctor
          </Button>}
        </div>
        <DoctorsDataTable data={doctors || []} />
      </ContentLayout>
    </>
  )
}
