"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DoctorCreateModal } from "@/components/doctors/create-doctor-modal";
import { DoctorsDataTable } from "@/components/doctors/data-table";
import { Button } from "@/components/ui/button";
import { useGetDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { usePermission } from "@/hooks/use-permissions";
import { Modals, useModalStore } from "@/store/modal-store";
import { Add01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import useTeamStore from "@/store/team-store";
import { useDoctorsStore } from "@/store/doctors-store";

export default function DoctorsPage() {
  const {openModal} = useModalStore();
  const {userRole} = useTeamStore();
  const canCreate = usePermission(userRole).checkPermission('doctors', 'create');
  const {doctors} = useDoctorsStore();
  const showEmptyState = (!doctors || doctors.length === 0);

  return (
    <>
      <DoctorCreateModal />
      <ContentLayout title="Doctors">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Doctor Management</h2>
            <p className="text-sm text-muted-foreground">
              Add, edit, and manage your dental lab&apos;s doctors
            </p>
          </div>
          {canCreate && (
            <Button 
              className="transition" 
              onClick={() => openModal(Modals.CREATE_DOCTOR_MODAL)}
            >
              <HugeiconsIcon icon={Add01Icon} className="mr-2" /> 
              Add Doctor
            </Button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </motion.div> */}
            {showEmptyState ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="mx-auto w-fit p-4 rounded-full bg-muted mb-4">
                <HugeiconsIcon icon={UserIcon} className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Doctors Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Start by adding doctors to your dental lab to manage cases and workflows efficiently.
              </p>
              {canCreate && (
                <Button 
                  onClick={() => openModal(Modals.CREATE_DOCTOR_MODAL)}
                  className="transition-transform"
                >
                  <HugeiconsIcon icon={Add01Icon} className="mr-2" />
                  Add Your First Doctor
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DoctorsDataTable data={doctors || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </ContentLayout>
    </>
  );
}
