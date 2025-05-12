"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, FileTextIcon, LineChart, PieChart, TrendingUp } from "lucide-react";
import AnalyticsAreaChart from "@/components/area-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumbers } from "@/lib/format-utils";
import { useAnalyiticsData } from "@/hooks/use-analytics-data";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { StatsCardProps, StatsGrid } from "@/components/stats-grid";
import { HugeiconsIcon } from "@hugeicons/react";
import { Doctor02Icon } from "@hugeicons/core-free-icons";
import { CubeIcon } from "@radix-ui/react-icons";

export default function AnalyticsPage() {
  const { userRole } = useTeamStore();
  const canViewRevenue = usePermission(userRole).canViewDue();
  const { data, isLoading } = useAnalyiticsData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const statsCards: StatsCardProps[] = [
    {
      title: "Cases",
      value: formatNumbers(data?.data.cases ?? 0),
      icon: <FileTextIcon className="size-6" />,
      change: {
        value: data?.data.casesDelta ? (data?.data.casesDelta).toFixed(0).concat('%') : "0",
        trend: data?.data.casesDelta ? data?.data.casesDelta > 1 ? "up" : "down" : "up",
      }
    },
    {
      title: "Doctors",
      value: formatNumbers(data?.data.doctors ?? 0),
      icon: <HugeiconsIcon icon={Doctor02Icon} />,
      change: {
        value: data?.data.doctorsDelta ? (data?.data.doctorsDelta).toFixed(0).concat('%') : "0",
        trend: data?.data.doctorsDelta ? data?.data.doctorsDelta > 1 ? "up" : "down" : "up",
      }
    },
    {
      title: "Materials",
      value: formatNumbers(data?.data.materials ?? 0),
      icon: <CubeIcon className="size-6" />,
      change: {
        value: data?.data.materialsDelta ? (data?.data.materialsDelta).toFixed(0).concat('%') : "0",
        trend: data?.data.materialsDelta ? data?.data.materialsDelta > 1 ? "up" : "down" : "up",
      }
    },
    // ...(canViewRevenue ? [{
    //   title: "Revenue",
    //   value: "EGP 24,500",
    //   icon: <LineChart className="size-6" />,
    //   trend: 15.3
    // }] : [])
  ];

  return (
    <ContentLayout title="Analytics">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Track your dental lab performance and insights
        </p>
      </motion.div>

      <div className="space-y-6">
        {isLoading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`gap-4 grid grid-cols-3`}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Skeleton className="h-[150px] w-full" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <StatsGrid stats={statsCards} />
          </motion.div>
        )}

        {/* Area Chart */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <AnalyticsAreaChart data={data?.casesChartData ?? {}} label="cases" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Top Doctors</CardTitle>
                <CardDescription>Doctors with the most cases</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[].map((doctor, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.totalCases} cases</p>
                        </div>
                        {/* <div className={`text-sm ${doctor.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {doctor.trend > 0 ? '+' : ''}{doctor.trend}%
                          </div> */}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Popular Materials</CardTitle>
                <CardDescription>Most used materials this month</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { name: "Zirconia Crown", count: 68, percentage: "32%" },
                      { name: "Composite Filling", count: 54, percentage: "25%" },
                      { name: "Porcelain Veneer", count: 42, percentage: "19%" },
                      { name: "Dental Implant", count: 35, percentage: "16%" },
                      { name: "Temporary Crown", count: 18, percentage: "8%" }
                    ].map((material, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-sm text-muted-foreground">{material.count} uses</p>
                        </div>
                        <div className="text-sm font-medium">
                          {material.percentage}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </ContentLayout>
  );
}
