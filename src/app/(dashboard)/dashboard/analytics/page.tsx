"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { motion } from "framer-motion";
import { FileTextIcon, Crown } from "lucide-react";
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
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "@/components/ui/button";
import AnalyticsStatsCard from "@/components/analytics-card";
import { DoctorsPieChart } from "@/components/doctors/doctors-chart";
import { UpgradePrompt } from "@/components/upgrade-prompt";

export default function AnalyticsPage() {
  const { userRole, currentTeam } = useTeamStore();
  const canViewRevenue = usePermission(userRole).canViewDue();
  const { data, isLoading } = useAnalyiticsData();

  // Animation variants
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

  const statsCards = [
    {
      title: "Cases",
      value: formatNumbers(data?.data.cases ?? 0),
      icon: <FileTextIcon className="size-6" />,
      trend: data?.data.casesDelta ? data?.data.casesDelta : 0,
      // trendLabel: data?.data.casesDelta ? data?.data.casesDelta > 1 ? "up" : "down" : "up",
    },
    {
      title: "Doctors",
      value: formatNumbers(data?.data.doctors ?? 0),
      icon: <HugeiconsIcon icon={Doctor02Icon} />,
      trend: data?.data.doctorsDelta ? data?.data.doctorsDelta : 0,
      // trendLabel: data?.data.doctorsDelta ? data?.data.doctorsDelta > 1 ? "up" : "down" : "up",
    },
    {
      title: "Materials",
      value: formatNumbers(data?.data.materials ?? 0),
      icon: <CubeIcon className="size-6" />,
      trend: data?.data.materialsDelta ? data?.data.materialsDelta : 0,
      // trendLabel: data?.data.materialsDelta ? data?.data.materialsDelta > 1 ? "up" : "down" : "up",
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
      {currentTeam?.planId === "free" && (
        <UpgradePrompt featureName="Analytics" />
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your dental lab performance and insights.
            <br />
            Analytics are automatically updated every 12 hours.
            <br />
            <span className="text-primary">
              Last updated:{" "}
              {data?.$createdAt &&
                formatDistanceToNowStrict(new Date(data.$createdAt), {
                  addSuffix: true,
                })}
            </span>
          </p>
        </div>
        {/* <Button
              className="transition" 
            >
              <RefreshCcw className="size-4" />
              Refresh
            </Button> */}
      </motion.div>

      <div className="space-y-6">
        <div>
          {isLoading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-xl" // added gap-6
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="col-span-1"
                >
                  <Skeleton className="h-[150px] w-full rounded-lg" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-xl"
            >
              {statsCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="col-span-1"
                >
                  <AnalyticsStatsCard {...card} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Area Chart */}
        {currentTeam?.planId !== 'free' && (
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <div className="xl:col-span-2">
              <AnalyticsAreaChart
                data={data?.casesChartData ?? {}}
                label="cases"
              />
            </div>
            {/* <DoctorsPieChart /> */}
          </motion.div>
        )}

        {/* <motion.div
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
                            <div className={`text-sm ${doctor.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {doctor.trend > 0 ? '+' : ''}{doctor.trend}%
                              </div>
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
                        {[].map((material, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{material.name}</p>
                              <p className="text-sm text-muted-foreground">{material.totalCases} cases</p>
                            </div>
                            <div className={`text-sm ${material.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {material.trend > 0 ? '+' : ''}{material.trend}%
                              </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div> */}
      </div>
    </ContentLayout>
  );
}
