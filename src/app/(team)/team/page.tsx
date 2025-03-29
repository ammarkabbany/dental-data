"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Crown, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useGetBillingPlan } from "@/features/team/hooks/use-get-billing-plan";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { FileText } from "lucide-react"; // Add this import
import { Settings } from "lucide-react"; // Add this import
import { Button } from "@/components/ui/button"; // Add this import
import Link from "next/link"; // Add this import
import Header from "@/components/layout/Header";
import { useCurrentTeam } from "@/features/team/hooks/use-current-team";
import { useAppwriteTeam } from "@/features/team/hooks/use-appwrite-team";
import TeamNotFound from "@/components/team-not-found";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";

export default function TeamPage() {
  const { isLoading: isUserLoading, isAuthenticated, handleLogin } = useAuth();
  const {data: currentTeam, isLoading} = useCurrentTeam();
  const {data: appwriteTeam} = useAppwriteTeam();

  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      handleLogin('/team')
    }
  }, [isUserLoading, isAuthenticated])

  const {
    data: plan,
    isLoading: isPlanLoading
  } = useGetBillingPlan();

  if (isUserLoading || (isLoading || isPlanLoading)) {
    return (
      <main>
        <Header />
        <div className="h-full min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <main>
      <Header />
    </main>
  }

  if (!currentTeam || !plan) {
    return <main>
      <Header />
      <TeamNotFound />
    </main>
  }

  const subscriptionEnd = new Date(currentTeam.planExpiresAt);
  const totalDays = 30; // Assuming monthly subscription
  const daysLeft = Math.ceil(
    (subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const progress = ((totalDays - daysLeft) / totalDays) * 100;
  const hasExpired = progress >= 100;
  const remainingCases = currentTeam.maxCases - currentTeam.casesUsed;

  return (
    <main>
      <Header />
      <div className="space-y-4 pt-8 pb-8 px-4 sm:px-8">
        {/* Add this section before the grid */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {currentTeam.name}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              asChild
            >
              <Link href="/team/settings">
                <Settings className="size-4 mr-2" />
                Settings
              </Link>
            </Button>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Add this new card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cases Usage</CardTitle>
              <FileText className="size-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentTeam.casesUsed || 0} / {currentTeam.maxCases}
              </div>
              <Progress
                value={(currentTeam.casesUsed / currentTeam.maxCases) * 100}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {remainingCases <= currentTeam.maxCases
                  ? `${remainingCases} cases remaining`
                  : "Limit reached"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription Plan
              </CardTitle>
              <Crown className="size-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{plan?.name}</div>
              <p className="text-xs text-muted-foreground">
                {plan?.$id === "free"
                  ? "Upgrade for more features"
                  : "Pro Plan"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Time Remaining
              </CardTitle>
              <CalendarDays className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDistanceToNow(subscriptionEnd)}
              </div>
              <Progress value={progress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {hasExpired ? "Expired" : "Renews"} on{" "}
                {subscriptionEnd.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="size-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appwriteTeam?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Limited to {plan?.maxTeamMembers} member(s)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
