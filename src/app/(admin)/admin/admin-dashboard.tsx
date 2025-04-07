"use client";
import React from "react";
import { StatsCardProps, StatsGrid } from "@/components/stats-grid";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumbers } from "@/lib/format-utils";
import { FileTextIcon, Users } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Doctor02Icon, UserGroup03Icon } from "@hugeicons/core-free-icons";
import { CubeIcon } from "@radix-ui/react-icons";
import { useGetAdminStats } from "@/features/admin/hooks/use-get-admin-stats";

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStats();

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
    hover: { y: -4, transition: { duration: 0.2 } },
  };

  const stats: StatsCardProps[] = [
    {
      title: "Cases",
      value: formatNumbers(data?.cases ?? 0),
      // change: {
      //   value: data?.caseDifference ? (data.caseDifference).toFixed(0).concat('%') : "0",
      //   trend: data?.caseDifference ? data.caseDifference > 1 ? "up" : "down" : "up",
      // },
      href: "/admin/cases",
      icon: <FileTextIcon className="size-6" />,
    },
    {
      title: "Doctors",
      value: formatNumbers(data?.doctors ?? 0),
      // change: {
      //   value: "+42%",
      //   trend: "up",
      // },
      href: "/admin/doctors",
      icon: <HugeiconsIcon icon={Doctor02Icon} />,
    },
    {
      title: "Materials",
      value: formatNumbers(data?.materials ?? 0),
      // change: {
      //   value: "0%",
      //   trend: "down",
      // },
      href: "/admin/materials",
      icon: <CubeIcon className="size-6" />,
    },
    {
      title: "Users",
      value: formatNumbers(data?.users ?? 0),
      // change: {
      //   value: "0%",
      //   trend: "down",
      // },
      href: "/admin/users",
      icon: <Users className="size-6" />,
    },
    {
      title: "Teams",
      value: formatNumbers(data?.teams ?? 0),
      // change: {
      //   value: "0%",
      //   trend: "down",
      // },
      href: "/admin/teams",
      icon: <HugeiconsIcon icon={UserGroup03Icon} />,
    },
  ];

  return (
      <div className="space-y-4">
        {isLoading ? (
          <motion.div
            className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar"
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
        {/* until logs are made */}
      </div>
  );
};

export default AdminDashboard;
