"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/use-permissions";
import { Modals, useModalStore } from "@/store/modal-store";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import useTeamStore from "@/store/team-store";
import { useMaterialsStore } from "@/store/material-store";
import { MaterialCreateModal } from "@/components/materials/create-material-modal";
import { CubeIcon } from "@radix-ui/react-icons";
import { MaterialsDataTable } from "@/components/materials/DataTable/materials-data-table";

export default function MaterialsPage() {
  const {openModal} = useModalStore();
  const {userRole} = useTeamStore();
  const canCreate = usePermission(userRole).checkPermission('materials', 'create');
  const {materials} = useMaterialsStore();
  const showEmptyState = (!materials || materials.length === 0);

  return (
    <>
      <MaterialCreateModal />
      <ContentLayout title="Materials">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Material Management</h2>
            <p className="text-sm text-muted-foreground">
              Add, edit, and manage your dental lab&apos;s materials
            </p>
          </div>
          {canCreate && (
            <Button 
              className="transition" 
              onClick={() => openModal(Modals.CREATE_MATERIAL_MODAL)}
            >
              <HugeiconsIcon icon={Add01Icon} className="mr-2" /> 
              Add Material
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
                <CubeIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Materials Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Start by adding materials to your dental lab to manage cases and workflows efficiently.
              </p>
              {canCreate && (
                <Button 
                  onClick={() => openModal(Modals.CREATE_MATERIAL_MODAL)}
                  className="transition-transform"
                >
                  <HugeiconsIcon icon={Add01Icon} className="mr-2" />
                  Add Your First Material
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
              <MaterialsDataTable data={materials || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </ContentLayout>
    </>
  );
}
