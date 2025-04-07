"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Modals, useModalStore } from "@/store/modal-store";
import { Add01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamsDataTable } from "@/components/admin/teams/data-table";
import { useGetAdminTeams } from "@/features/admin/hooks/use-get-all-teams";

export default function AdminTeamsPage() {
  const { data: teams, isLoading } = useGetAdminTeams();
  const showEmptyState = !isLoading && (!teams || teams.length === 0);

  return (
    <>
      <ContentLayout title="Admin | Teams">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Teams Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage teams and their details.
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </motion.div>
          ) : showEmptyState ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="mx-auto w-fit p-4 rounded-full bg-muted mb-4">
                <HugeiconsIcon
                  icon={UserIcon}
                  className="w-8 h-8 text-muted-foreground"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Users Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Start by adding teams.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TeamsDataTable data={teams || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </ContentLayout>
    </>
  );
}
