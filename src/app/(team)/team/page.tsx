"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Crown, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useGetBillingPlan } from "@/features/team/hooks/use-get-billing-plan";
import { FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { useTeam } from "@/providers/team-provider";
import RedirectToAuth from "@/components/auth/custom-auth-redirect";
import LoadingSpinner from "@/components/ui/loading-spinner";
import RedirectToOnboarding from "@/components/auth/custom-onboard-redirect";
import { UserAvatar } from "@/components/user-avatar";
import { CheckoutDialog } from "./billing/checkout-dialog";
import { useState } from "react";

export default function TeamPage() {
  const { isLoading, isAuthenticated } = useTeam();
  const { userRole, currentAppwriteTeam: appwriteTeam, currentTeam } = useTeamStore();
  const canUpdate = usePermission(userRole).checkPermission('team', 'update');

  const [showRenewDialog, setShowRenewDialog] = useState(false);

  const {
    data: plan,
    isLoading: isPlanLoading
  } = useGetBillingPlan();

  if (isLoading) {
    return <main className="">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    </main>
  }

  if (!isAuthenticated) {
    return <RedirectToAuth />
  }

  if (!currentTeam) {
    return <main className="min-h-screen">
      <Header />
      <RedirectToOnboarding />
    </main>
  }

  const subscriptionEnd = new Date(currentTeam.planExpiresAt);
  const totalDays = plan?.$id === "free" ? 14 : 30;
  const daysLeft = Math.ceil(
    (subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const progress = ((totalDays - daysLeft) / totalDays) * 100;
  const hasExpired = progress >= 100;
  const remainingCases = currentTeam.maxCases - currentTeam.casesUsed;

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <main className="bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto space-y-6 pt-8 pb-12 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card shadow-md overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-4">
                <UserAvatar name={currentTeam.name} className="size-12" imgClassName="bg-purple-700 text-xl" />
                {currentTeam.name}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="transition-colors"
                asChild
              >
                <Link href="/team/settings">
                  <Settings className="size-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-gradient-to-br from-sidebar/10 to-sidebar shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cases Usage</CardTitle>
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <FileText className="size-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentTeam.casesUsed || 0} / {currentTeam.maxCases}
                </div>
                <Progress
                  value={(currentTeam.casesUsed / currentTeam.maxCases) * 100}
                  className="mt-2 h-2"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground mt-2">
                    {remainingCases > 0
                      ? `${remainingCases} cases remaining`
                      : "Limit reached"}
                  </p>
                  {remainingCases <= 0 && canUpdate && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 p-0 h-auto text-primary"
                      asChild
                    >
                      <Link href="/team/billing">Upgrade</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-gradient-to-br from-sidebar/10 to-sidebar shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscription Plan
                </CardTitle>
                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <Crown className="size-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{plan?.name}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {plan?.$id === "free"
                    ? "Upgrade for more features"
                    : "Premium"}
                </p>
                {canUpdate && (
                  <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-primary" asChild>
                    <Link href="/team/billing">Upgrade now</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-gradient-to-br from-sidebar/10 to-sidebar shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Time Remaining
                </CardTitle>
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <CalendarDays className="size-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDistanceToNow(subscriptionEnd)}
                </div>
                <Progress
                  value={progress}
                  className="mt-2 h-2"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className={hasExpired ? "text-red-500 font-medium" : ""}>
                      {hasExpired ? "Expired" : "Expires"}
                    </span>{" "}
                    on {subscriptionEnd.toLocaleDateString()}
                  </p>
                  {hasExpired && canUpdate && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 p-0 h-auto text-primary"
                      onClick={() => setShowRenewDialog(true)}
                    >
                      Renew plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-gradient-to-br from-sidebar/10 to-sidebar shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                  <Users className="size-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appwriteTeam?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Limited to {plan?.maxTeamMembers} member{plan?.maxTeamMembers !== 1 ? 's' : ''}
                </p>
                {canUpdate && plan && plan.maxTeamMembers > 1 && (
                  <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-primary" asChild>
                    <Link href="#">Invite members</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {plan && <CheckoutDialog
        isOpen={showRenewDialog}
        onClose={() => setShowRenewDialog(false)}
        planName={plan.name}
        price={plan.price}
      />}
    </main>
  );
}
