"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { FileIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLogTable } from "@/components/audit-logs/AuditLogTable";
import { useGetLogs } from "@/features/logs/hooks/use-get-logs";
import { UpgradePrompt } from "@/components/upgrade-prompt";
import { useTeam } from "@/providers/team-provider";

export default function AuditLogsPage() {
  // const canCreate = usePermission(userRole).checkPermission('cases', 'create');
  const { data: logs, isLoading } = useGetLogs();
  const {currentTeam} = useTeam();
  const showEmptyState = !isLoading && (!logs || logs.total === 0);

  return (
    <ContentLayout title="Logs">
      {currentTeam?.planId === 'free' && (
        <UpgradePrompt featureName="Logs" />
      )}
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
            <AuditLogTable />
          </motion.div>
        )}
      </AnimatePresence>
    </ContentLayout>
  );
}
