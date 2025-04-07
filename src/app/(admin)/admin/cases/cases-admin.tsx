"use client";
import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminCases } from "@/features/admin/hooks/use-get-admin-cases";
import { AdminCasesDataTable } from "@/components/admin/cases/data-table";

export default function AdminCasesDashboard() {
  const { data: cases, isLoading } = useGetAdminCases();
  const showEmptyState = !isLoading && (!cases || cases.length === 0);

  return (
    <>
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Cases Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage cases and their details.
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
              Start by adding cases.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminCasesDataTable data={cases || []} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
