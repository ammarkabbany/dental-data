"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { HugeiconsIcon } from "@hugeicons/react";
import { Doctor02Icon } from "@hugeicons/core-free-icons";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { CubeIcon, FileTextIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import RecentCases from "@/components/recent-cases";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Sparkles,
} from "lucide-react";
import { Action, Resource, usePermission } from "@/hooks/use-permissions";
import { StatsCardProps, StatsGrid } from "@/components/stats-grid";
import { formatNumbers } from "@/lib/format-utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { Modals, useModalStore } from "@/store/modal-store";
import { MaterialCreateModal } from "@/components/materials/create-material-modal";
import { DoctorCreateModal } from "@/components/doctors/create-doctor-modal";
import useTeamStore from "@/store/team-store";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const { userRole } = useTeamStore();
  const { data, isLoading } = useDashboardData();
  const { checkPermission } = usePermission(userRole);
  const { openModal } = useModalStore();

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
      href: "/dashboard/materials",
      icon: <CubeIcon className="size-6" />,
    },
    // {
    //   title: "N/A",
    //   value: formatNumbers(0),
    //   // change: {
    //   //   value: "0%",
    //   //   trend: "down",
    //   // },
    //   href: "#",
    //   icon: <QuestionMarkIcon className="size-6" />,
    // },
  ];

  const actionCards = [
    {
      title: "New Case",
      description: "Create and manage cases",
      isPrimary: true,
      icon: <FileTextIcon className="size-5" />,
      href: "/dashboard/cases/new",
      permission: ["cases", "create"] as [Resource, Action],
    },
    {
      title: "New Doctor",
      description: "Add doctors to your lab",
      isPrimary: false,
      icon: <HugeiconsIcon icon={Doctor02Icon} className="size-5" />,
      onClick: () => openModal(Modals.CREATE_DOCTOR_MODAL),
      permission: ["doctors", "create"] as [Resource, Action],
    },
    {
      title: "New Material",
      description: "Add materials to your lab",
      isPrimary: false,
      icon: <CubeIcon className="size-5" />,
      onClick: () => openModal(Modals.CREATE_MATERIAL_MODAL),
      permission: ["materials", "create"] as [Resource, Action],
    },
  ].filter((card) => checkPermission(...card.permission));

  return (
    <ContentLayout title="Overview">
      <MaterialCreateModal />
      <DoctorCreateModal />
      <div className="space-y-4">
        {/* Welcome Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-lime-600 to-emerald-700 p-7 text-white shadow-xl shadow-lime-900/20">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-blue-200" />
                <h1 className="text-xl font-bold">
                  Welcome back, {user?.name}
                </h1>
              </div>
              <p className="mt-2 text-blue-100">
                Here&apos;s what&apos;s happening in your lab
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          {isLoading ? (
            <motion.div
              className="grid grid-cols-2 min-[1200px]:grid-cols-4 gap-6 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar" // added gap-6
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="relative p-4 lg:p-5 group"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <StatsGrid stats={stats} />
            </motion.div>
          )}
        </div>

        {/* Action Cards */}
        <motion.div
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Skeleton className="h-48 w-full" />
                </motion.div>
              ))}
            </>
          ) : (
            actionCards.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover="hover"
                className="w-full"
              >
                {card.href ? (
                  <Link href={card.href} className="block w-full">
                    <Card className={`group border-border ${card.isPrimary ? "bg-primary" : "hover:border-primary/50"} transition-all hover:shadow-md h-full`}>
                      <CardContent className="flex flex-col items-center justify-center gap-4">
                        <div className="p-3 rounded-full bg-secondary/20 group-hover:bg-secondary/40 transition-colors">
                          {card.icon}
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="font-semibold text-foreground">{card.title}</h3>
                          <p className="text-sm text-foreground/75">{card.description}</p>
                        </div>
                        {/* <Button variant="ghost" size="sm" className="mt-2">
                          <Plus className="mr-2 size-4" />
                          {card.buttonText}
                        </Button> */}
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card 
                    className="group border-border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer h-full"
                    onClick={card.onClick}
                  >
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                      <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        {card.icon}
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold text-foreground">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                      </div>
                      {/* <Button variant="ghost" size="sm" className="mt-2">
                        <Plus className="mr-2 size-4" />
                        {card.buttonText}
                      </Button> */}
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Recent Cases */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-2" // added margin top
        >
          <RecentCases cases={data?.recentCases ?? []} />
        </motion.div>
      </div>
    </ContentLayout>
  );
}
