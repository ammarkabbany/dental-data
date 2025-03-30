"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import AnalyticsAreaChart from "@/components/area-chart";
import AnalyticsStatsCard from "@/components/analytics-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumbers } from "@/lib/format-utils";
import { useAnalyiticsData } from "@/hooks/use-analytics-data";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";

export default function AnalyticsPage() {
  const {userRole} = useTeamStore();
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

  // Mock data for charts
  const mockChartData = {
    week: {
      "Mon": 5,
      "Tue": 8,
      "Wed": 12,
      "Thu": 7,
      "Fri": 15,
      "Sat": 3,
      "Sun": 0
    },
    month: {
      "Week 1": 25,
      "Week 2": 32,
      "Week 3": 28,
      "Week 4": 40
    },
    year: {
      "Jan": 120,
      "Feb": 145,
      "Mar": 132,
      "Apr": 170,
      "May": 185,
      "Jun": 192,
      "Jul": 210,
      "Aug": 190,
      "Sep": 205,
      "Oct": 220,
      "Nov": 240,
      "Dec": 235
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: "Total Cases",
      value: formatNumbers(data?.casesCount ?? 0),
      icon: <BarChart3 className="size-6 text-white" />,
      trend: data?.casesDifference ?? 0
    },
    {
      title: "Active Doctors",
      value: formatNumbers(data?.doctorsCount ?? 0),
      icon: <TrendingUp className="size-6 text-white" />,
      trend: 8.2
    },
    {
      title: "Materials Used",
      value: formatNumbers(data?.materialsCount ?? 0),
      icon: <PieChart className="size-6 text-white" />,
      trend: -3.1
    },
    // Only show revenue card if user has permission
    ...(canViewRevenue ? [{
      title: "Revenue",
      value: "EGP 24,500",
      icon: <LineChart className="size-6 text-white" />,
      trend: 15.3
    }] : [])
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
          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid grid-cols-1 sm:grid-cols-2 ${canViewRevenue ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}
          >
            {isLoading ? (
              Array.from({ length: canViewRevenue ? 4 : 3 }).map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Skeleton className="h-[150px] w-full" />
                </motion.div>
              ))
            ) : (
              statsCards.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AnalyticsStatsCard
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Area Chart */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <AnalyticsAreaChart data={mockChartData} label="cases" />
          </motion.div>

          {/* Additional Analytics Cards */}
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
                      {data?.topDoctors.map((doctor, i) => (
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