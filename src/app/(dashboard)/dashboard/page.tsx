"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { HugeiconsIcon } from "@hugeicons/react";
import { DentalToothIcon, Doctor02Icon } from "@hugeicons/core-free-icons";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useTeam } from "@/providers/team-provider";
import { CubeIcon, FileTextIcon } from "@radix-ui/react-icons";
import RecentCases from "@/components/recent-cases";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  FilePlus,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { Action, Resource, usePermission } from "@/hooks/use-permissions";
import { useUser } from "@clerk/nextjs";
import { StatsCardProps, StatsGrid } from "@/components/stats-grid";
import { formatNumbers } from "@/lib/format-utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Modals, useModalStore } from "@/store/modal-store";
import { MaterialCreateModal } from "@/components/materials/create-material-modal";
import { DoctorCreateModal } from "@/components/doctors/create-doctor-modal";

export default function DashboardPage() {
  const { userRole, appwriteTeam, isLoading: isTeamLoading } = useTeam();
  const { user } = useUser();
  const { data, isLoading } = useDashboardData();
  const { checkPermission } = usePermission(userRole);
  const {openModal} = useModalStore();

  // const sidebar = useStore(useSidebar, (x) => x);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -4, transition: { duration: 0.2 } }
  };

  const stats: StatsCardProps[] = [
    {
      title: "Cases",
      value: formatNumbers(data?.casesCount ?? 0),
      // change: {
      //   value: data?.caseDifference ? (data.caseDifference).toFixed(0).concat('%') : "0",
      //   trend: data?.caseDifference ? data.caseDifference > 1 ? "up" : "down" : "up",
      // },
      href: "/dashboard/cases",
      icon: <FileTextIcon className="size-6" />,
    },
    {
      title: "Doctors",
      value: formatNumbers(data?.doctorsCount ?? 0),
      // change: {
      //   value: "+42%",
      //   trend: "up",
      // },
      href: "/dashboard/doctors",
      icon: <HugeiconsIcon icon={Doctor02Icon} />,
    },
    {
      title: "Materials",
      value: formatNumbers(data?.materialsCount ?? 0),
      // change: {
      //   value: "0%",
      //   trend: "down",
      // },
      href: "#",
      icon: <CubeIcon className="size-6" />,
    },
    {
      title: "Team",
      value: formatNumbers(appwriteTeam?.total ?? 0),
      // change: {
      //   value: "-17%",
      //   trend: "down",
      // },
      href: "/team",
      icon: <Users />,
    },
  ];

  const actionCards = [
    {
      title: "Create Case",
      description: "Create a new case for your team",
      icon: <FileTextIcon className="size-5" />,
      href: "/dashboard/cases/new",
      buttonText: "Create",
      isPrimary: true,
      permission: ["cases", "create"] as [Resource, Action],
    },
    {
      title: "Add Doctor",
      description: "Register a new doctor to your lab",
      icon: <HugeiconsIcon icon={Doctor02Icon} className="size-5" />,
      onClick: () => openModal(Modals.CREATE_DOCTOR_MODAL),
      buttonText: "Add Doctor",
      permission: ["doctors", "create"] as [Resource, Action],
    },
    {
      title: "Add Material",
      description: "Add new materials to inventory",
      icon: <CubeIcon className="size-5" />,
      onClick: () => openModal(Modals.CREATE_MATERIAL_MODAL),
      buttonText: "Add Material",
      permission: ["materials", "create"] as [Resource, Action],
    },
  ].filter((card) => checkPermission(...card.permission));

  return (
    <ContentLayout title="Overview">
      <MaterialCreateModal />
      <DoctorCreateModal />
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-lime-600 to-emerald-700 p-6 text-white shadow-xl shadow-lime-900/20">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="relative flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-200" />
                <h1 className="text-lg font-bold">
                  Welcome back, {user?.fullName}
                </h1>
              </div>
              <p className="mt-1 text-blue-100">
                Here&apos;s what&apos;s happening in your lab
              </p>
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

        <div className="">
          {isLoading || isTeamLoading ? (
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
            </motion.div>
          )}
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
          {actionCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover="hover"
              className="h-[200px]"
            >
              <Card
                className={cn(
                  "border border-muted h-full",
                  card.isPrimary && "bg-primary text-primary-foreground"
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {card.icon}
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className={cn(
                    "text-sm",
                    card.isPrimary ? "opacity-90" : "text-muted-foreground"
                  )}>
                    {card.description}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    variant={card.isPrimary ? "secondary" : "outline"}
                    size="sm"
                    className="w-full transition cursor-pointer"
                    onClick={card.onClick}
                    asChild={card.href !== undefined}
                  >
                    {card.href ? <Link href={card.href}>
                      <Plus className="mr-1 h-4 w-4" />
                      {card.buttonText}
                    </Link> : (
                      <>
                        <Plus className="mr-1 h-4 w-4" />
                        {card.buttonText}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        <RecentCases cases={data?.recentCases ?? []} />
      </div>
    </ContentLayout>
  );
}
