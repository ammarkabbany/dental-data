"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DentalToothIcon,
  Doctor02Icon,
} from "@hugeicons/core-free-icons";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useTeam } from "@/providers/team-provider";
import { CubeIcon, FileTextIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import StatsCard from "@/components/stats-card";
import RecentCases from "@/components/recent-cases";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { QuickActionButton } from "@/components/quick-action-button";
import { useRouter } from "next/navigation";
import { Modals, useModalStore } from "@/store/modal-store";
import { usePermission } from "@/hooks/use-permissions";
import { useUser } from "@clerk/nextjs";
import { StatsCardProps, StatsGrid } from "@/components/stats-grid";

export default function DashboardPage() {
  const { openModal } = useModalStore();
  const router = useRouter();
  const { userRole } = useTeam();
  const { user } = useUser();
  const { data, isLoading } = useDashboardData();
  const permission = usePermission(userRole)

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

  const stats: StatsCardProps[] = [
    {
      title: "Cases",
      value: data?.casesCount.toString() ?? "0",
      // change: {
      //   value: "+12%",
      //   trend: "up",
      // },
      // href: "/dashboard/cases",
      icon: (
        <FileTextIcon className="size-6" />
      ),
    },
    {
      title: "Doctors",
      value: data?.doctorsCount.toString() ?? "0",
      // change: {
      //   value: "+42%",
      //   trend: "up",
      // },
      icon: (
        <HugeiconsIcon icon={Doctor02Icon} />
      ),
    },
    {
      title: "Materials",
      value: data?.materialsCount.toString() ?? "0",
      // change: {
      //   value: "0%",
      //   trend: "down",
      // },
      icon: (
        <CubeIcon className="size-6" />
      ),
    },
    {
      title: "Referrals",
      value: "3,497",
      // change: {
      //   value: "-17%",
      //   trend: "down",
      // },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={21}
          height={21}
          fill="currentColor"
        >
          <path d="m14.142.147 6.347 6.346a.5.5 0 0 1-.277.848l-1.474.23-5.656-5.657.212-1.485a.5.5 0 0 1 .848-.282ZM2.141 19.257c3.722-3.33 7.995-4.327 12.643-5.52l.446-4.017-4.297-4.298-4.018.447c-1.192 4.648-2.189 8.92-5.52 12.643L0 17.117c2.828-3.3 3.89-6.953 5.303-13.081l6.364-.708 5.657 5.657-.707 6.364c-6.128 1.415-9.782 2.475-13.081 5.304L2.14 19.258Zm5.284-6.029a2 2 0 1 1 2.828-2.828 2 2 0 0 1-2.828 2.828Z" />
        </svg>
      ),
    },
  ]

  return (
    <ContentLayout title="Overview">
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-lime-600 to-emerald-700 p-6 text-white shadow-xl shadow-lime-900/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-200" />
              <h1 className="text-lg font-bold">Welcome back, {user?.fullName}</h1>
            </div>
            <p className="mt-1 text-blue-100">Here&apos;s what&apos;s happening in your lab</p>
          </div>
          {/* <div className="mt-4 flex items-center gap-3 md:mt-0">
            <div className="rounded-lg bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="font-semibold">42</span> Active Cases
            </div>
            <div className="rounded-lg bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="font-semibold">18</span> Doctors
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div> */}

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
            className=""
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <StatsGrid stats={stats} />
            {/* <motion.div variants={itemVariants}>
              <StatsCard
                title="Cases"
                value={data?.casesCount ?? 0}
                icon={<HugeiconsIcon icon={DentalToothIcon} />}
              >

                {permission.checkPermission('cases', 'create') && <QuickActionButton onClick={() => router.push('/dashboard/cases/new')} icon={PlusCircledIcon} label="Add Case" />}
              </StatsCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Doctors"
                value={data?.doctorsCount ?? 0}
                icon={<HugeiconsIcon icon={Doctor02Icon} />}
              >
                {permission.checkPermission('doctors', 'create') && 
                  <QuickActionButton onClick={() => openModal(Modals.CREATE_DOCTOR_MODAL)} icon={PlusCircledIcon} label="Add Doctor" />}
              </StatsCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Materials"
                value={data?.materialsCount ?? 0}
                icon={<CubeIcon className="size-6" />}
              >
                {permission.checkPermission('materials', 'create') && <QuickActionButton onClick={() => openModal(Modals.CREATE_MATERIAL_MODAL)} icon={PlusCircledIcon} label="Add Material" />}
              </StatsCard>
            </motion.div> */}
            {/* <motion.div variants={itemVariants}>
              <StatsCard
                title="Team Members"
                value={currentTeam?.total ?? 0}
                icon={<HugeiconsIcon icon={UserMultiple02Icon} />}
              />
            </motion.div> */}
          </motion.div>
        )}
      </div>
      <RecentCases cases={data?.recentCases ?? []} />
    </ContentLayout>
  );
}
