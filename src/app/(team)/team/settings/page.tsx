"use client";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Settings } from "lucide-react";
import PlanBillingPage from "../billing/billing-tab";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RedirectToAuth from "@/components/auth/custom-auth-redirect";
import RedirectToOnboarding from "@/components/auth/custom-onboard-redirect";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useTeam } from "@/providers/team-provider";
import GeneralSettingsForm from "./general-settings-form";
import Link from "next/link";

export default function TeamPage() {
  const { isAuthenticated, currentTeam, isLoading } =
    useTeam();
  const [activeTab, setActiveTab] = useState("general");

  if (isLoading) {
    return (
      <main className="bg-gradient-to-b from-background to-muted/30">
        <Header>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="cursor-pointer font-semibold hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </Header>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <RedirectToAuth />;
  }

  if (!currentTeam) {
    return (
      <main className="bg-gradient-to-b from-background to-muted/30 min-h-screen">
        <Header>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="cursor-pointer font-semibold hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </Header>
        <RedirectToOnboarding />
      </main>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <main className="bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <Header>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="cursor-pointer font-semibold hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </Header>
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Team Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team preferences and configuration
          </p>
        </motion.div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="w-full flex flex-col md:flex-row gap-8"
        >
          <Card className="md:w-64 flex-shrink-0 bg-card border-0 shadow-sm h-fit sticky top-8">
            <CardContent className="p-4">
              <TabsList className="flex flex-row md:flex-col gap-2 bg-transparent p-0 h-auto w-full overflow-x-auto md:overflow-visible">
                <TabsTrigger
                  value="general"
                  onClick={() => setActiveTab("general")}
                  className="w-full h-11 justify-start gap-3 px-3 py-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Settings className="size-4 flex-shrink-0" />
                  General
                </TabsTrigger>
                {/* <TabsTrigger
                  value="billing"
                  onClick={() => setActiveTab("billing")}
                  className="w-full h-11 justify-start gap-3 px-3 py-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <CreditCard className="size-4 flex-shrink-0" />
                  Billing
                </TabsTrigger> */}
                {/* <TabsTrigger
                  value="notifications"
                  onClick={() => setActiveTab("notifications")}
                  className="w-full h-11 justify-start gap-3 px-3 py-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Bell className="size-4 flex-shrink-0" />
                  Notifications
                </TabsTrigger> */}
              </TabsList>
            </CardContent>
          </Card>

          <div className="grow">
            <Card className="border-0 shadow-sm">
              <TabsContent value="general" className="m-0">
                <CardHeader className="border-b pb-6">
                  <CardTitle className="text-xl font-medium">
                    General Settings
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Manage your team&apos;s basic information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    <motion.div variants={itemVariants}>
                      <GeneralSettingsForm />
                    </motion.div>
                  </motion.div>
                </CardContent>
              </TabsContent>

              {/* <TabsContent value="billing" className="m-0">
                <CardHeader className="border-b pb-6">
                  <CardTitle className="text-xl font-medium">
                    Billing Settings
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Manage your team&apos;s billing information and subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <PlanBillingPage />
                </CardContent>
              </TabsContent> */}

              {/* <TabsContent value="notifications" className="m-0">
                <CardHeader className="border-b pb-6">
                  <CardTitle className="text-xl font-medium">Notification Settings</CardTitle>
                  <CardDescription className="mt-1.5">
                    Control how and when your team receives notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <NotificationsTab
                    canUpdate={canUpdate}
                    isSaving={isSaving}
                    handleSave={handleSave}
                  />
                </CardContent>
              </TabsContent> */}
            </Card>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
