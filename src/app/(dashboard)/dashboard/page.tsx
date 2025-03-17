"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DentalToothIcon,
  Doctor02Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useTeam } from "@/providers/team-provider";
import { CubeIcon } from "@radix-ui/react-icons";
import AnalyticsStatsCard from "@/components/analytics-card";
import StatsCard from "@/components/stats-card";
import RecentCases from "@/components/recent-cases";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

export default function DashboardPage() {
  // const { openModal } = useModalStore();
  const { currentTeam } = useTeam();
  const { data, isLoading } = useDashboardData();

  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <ContentLayout title="Dashboard">
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>

      <div className="py-4">
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Skeleton className="flex h-[150px] dark:bg-accent shadow-inner dark:shadow-white/15 shadow-neutral-400/75" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Cases"
                value={data?.casesCount ?? 0}
                icon={<HugeiconsIcon icon={DentalToothIcon} />}
              >
                {/* <Button size={"icon"} className="ml-auto cursor-pointer bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  <PlusCircleIcon />
                </Button> */}
              </StatsCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Doctors"
                value={data?.doctorsCount ?? 0}
                icon={<HugeiconsIcon icon={Doctor02Icon} />}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Materials"
                value={data?.materialsCount ?? 0}
                icon={<CubeIcon className="size-6" />}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Team Members"
                value={currentTeam?.total ?? 0}
                icon={<HugeiconsIcon icon={UserMultiple02Icon} />}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
      <RecentCases cases={data?.recentCases ?? []} />
    </ContentLayout>
  );
}
