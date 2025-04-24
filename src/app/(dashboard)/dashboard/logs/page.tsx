"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { FileIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import useTeamStore from "@/store/team-store";
import { AuditLogTable } from "@/components/audit-logs/AuditLogTable";
import { AUDIT_LOGS_COLLECTION_ID, DATABASE_ID } from "@/lib/constants";
import { AuditLogEntry } from "@/types";
import { useGetLogs } from "@/features/logs/hooks/use-get-logs";

export default function AuditLogsPage() {
  const {userRole} = useTeamStore();
  // const canCreate = usePermission(userRole).checkPermission('cases', 'create');
  const { data: logs, isLoading } = useGetLogs();
  const showEmptyState = !isLoading && (!logs || logs.length === 0);

  const mockLogs: AuditLogEntry[] = [
    {
      $id: '1',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $collectionId: AUDIT_LOGS_COLLECTION_ID,
      $databaseId: DATABASE_ID,
      $permissions: [],
      action: 'CREATE',
      resource: 'DOCTOR',
      resourceId: '69123851291dasd0',
      userId: 'randomUserId',
      timestamp: new Date().toISOString(),
    },
    {
      $id: '2',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $collectionId: AUDIT_LOGS_COLLECTION_ID,
      $databaseId: DATABASE_ID,
      $permissions: [],
      action: 'UPDATE',
      resource: 'MATERIAL',
      resourceId: '1234567890abcdef',
      userId: 'anotherUserId',
      timestamp: new Date().toISOString(),
    },
    {
      $id: '3',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $collectionId: AUDIT_LOGS_COLLECTION_ID,
      $databaseId: DATABASE_ID,
      $permissions: [],
      action: 'DELETE',
      resource: 'CASE',
      resourceId: 'abcdef1234567890',
      userId: 'thirdUserId',
      timestamp: new Date().toISOString(),
    }
  ]

  return (
    <ContentLayout title="Logs">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Logs Overview</h2>
          <p className="text-muted-foreground text-sm">
            Track the history of actions performed on your lab.
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
              <HugeiconsIcon icon={FileIcon} className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No actions have been performed yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              It seems like no actions have been performed on your lab yet. Once you start using the system, you will see a history of actions here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuditLogTable data={logs} />
          </motion.div>
        )}
      </AnimatePresence>
    </ContentLayout>
  );
}
