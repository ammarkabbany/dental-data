"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DoctorCreateModal } from "@/components/doctors/create-doctor-modal";
import { DoctorsDataTable } from "@/components/doctors/data-table";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useGetDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { usePermission } from "@/hooks/use-permissions";
import { useTeam } from "@/providers/team-provider";
import { Modals, useModalStore } from "@/store/modal-store";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function CasesPage() {
  const { userRole, isLoading: isTeamLoading } = useTeam();

  const {openModal} = useModalStore();

  const canCreate = usePermission(userRole).checkPermission('doctors', 'create');

  const { data: doctors, isLoading: isDocotrsLoading } = useGetDoctors();

  if (isTeamLoading || isDocotrsLoading) return (
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
