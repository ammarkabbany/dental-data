"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CasesDataTable } from "@/components/cases/data-table";
import { Button } from "@/components/ui/button";
import { useGetCases } from "@/features/cases/hooks/use-get-cases";
import { usePermission } from "@/hooks/use-permissions";
import { Add01Icon, FileIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import useTeamStore from "@/store/team-store";

export default function CasesPage() {
  const {userRole} = useTeamStore();
  const canCreate = usePermission(userRole).checkPermission('cases', 'create');
  const { data: cases, isLoading } = useGetCases();
  const showEmptyState = !isLoading && (!cases || cases.length === 0);

  return (
    <ContentLayout title="Cases">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Cases Overview</h2>
          <p className="text-muted-foreground text-sm">
            Track and manage your dental cases in one place
          </p>
        </div>
        {canCreate && (
          <Button className="transition" size={"lg"} asChild>
            <Link href="/dashboard/cases/new">
              {/* <HugeiconsIcon icon={Add01Icon} className="mr-2" />  */}
              Add Case
            </Link>
          </Button>
        )}
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
            <h3 className="text-lg font-semibold mb-2">No Cases Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start managing your dental cases by creating your first case.
            </p>
            {canCreate && (
              <Button asChild>
                <Link href="/dashboard/cases/new">
                  <HugeiconsIcon icon={Add01Icon} className="mr-2" />
                  Create Your First Case
                </Link>
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
            <CasesDataTable data={cases || []} />
          </motion.div>
        )}
      </AnimatePresence>
    </ContentLayout>
  );
}
