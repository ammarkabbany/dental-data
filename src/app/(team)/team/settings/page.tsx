"use client";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermission } from "@/hooks/use-permissions";
import { ArrowRight, Bell, CreditCard, Settings } from "lucide-react";
import PlanBillingPage from "./billing-tab";
import NotificationsTab from "./notifications-tab";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import useTeamStore from "@/store/team-store";
import RedirectToAuth from "@/components/auth/custom-auth-redirect";
import RedirectToOnboarding from "@/components/auth/custom-onboard-redirect";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useTeam } from "@/providers/team-provider";

export default function TeamPage() {
  const { userRole, appwriteTeam, isAuthenticated, currentTeam, isLoading } = useTeam();
  const { membership } = useTeamStore((state) => state);
  const canUpdate = usePermission(userRole).checkPermission('team', 'update');
  const [activeTab, setActiveTab] = useState("general");
  const [teamName, setTeamName] = useState(membership?.teamName || "");
  const [currency, setCurrency] = useState(appwriteTeam?.prefs.currency || "USD");
  const [isSaving, setIsSaving] = useState(false);


  if (isLoading) {
    return <main className="bg-gradient-to-b from-background to-muted/30">
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
    return <main className="bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <Header />
      <RedirectToOnboarding />
    </main>
  }

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

  const handleSave = (type: string) => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${type} settings saved successfully`);
    }, 1000);
  };

  return (
    <main className="bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Team Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your team preferences and configuration</p>
        </motion.div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="w-full flex flex-col md:flex-row gap-8"
        >
          <Card className="md:w-64 flex-shrink-0 bg-card/50 border-0 shadow-sm h-fit sticky top-8">
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
                <TabsTrigger
                  value="billing"
                  onClick={() => setActiveTab("billing")}
                  className="w-full h-11 justify-start gap-3 px-3 py-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <CreditCard className="size-4 flex-shrink-0" />
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  onClick={() => setActiveTab("notifications")}
                  className="w-full h-11 justify-start gap-3 px-3 py-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Bell className="size-4 flex-shrink-0" />
                  Notifications
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <div className="grow">
            <Card className="border-0 shadow-sm">
              <TabsContent value="general" className="m-0">
                <CardHeader className="border-b pb-6">
                  <CardTitle className="text-xl font-medium">General Settings</CardTitle>
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
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="teamName" className="text-base">Team Name</Label>
                          <Input
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name"
                            disabled={!canUpdate}
                            className="max-w-md"
                          />
                          <p className="text-sm text-muted-foreground">
                            This name will be displayed across the platform
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currency" className="text-base">Default Currency</Label>
                          <Select
                            value={currency}
                            onValueChange={setCurrency}
                            disabled={!canUpdate}
                          >
                            <SelectTrigger className="max-w-md">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Currencies</SelectLabel>
                                <SelectItem value="EGP">Egyptian Pound (EGP)</SelectItem>
                                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                                <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            Currency used for displaying financial information
                          </p>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Data Privacy Mode</Label>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Hide sensitive patient information from team members without proper access
                              </p>
                            </div>
                            <Switch defaultChecked={true} disabled={!canUpdate} />
                          </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Automatic Backups</Label>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Automatically backup team data on a regular schedule
                              </p>
                            </div>
                            <Switch defaultChecked={true} disabled={!canUpdate} />
                          </div>
                        </div>
                      </div>

                      {canUpdate && (
                        <div className="mt-8 flex justify-end">
                          <Button
                            variant="default"
                            onClick={() => handleSave('General')}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Save general settings'}
                            {!isSaving && <ArrowRight className="ml-2 h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </CardContent>
              </TabsContent>

              <TabsContent value="billing" className="m-0">
                <CardHeader className="border-b pb-6">
                  <CardTitle className="text-xl font-medium">Billing Settings</CardTitle>
                  <CardDescription className="mt-1.5">
                    Manage your team&apos;s billing information and subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <PlanBillingPage />
                </CardContent>
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
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
              </TabsContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
