"use client";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAppwriteTeam } from "@/features/team/queries";
import { useTeam } from "@/providers/team-provider";
import { useUser } from "@clerk/nextjs";
import { Models } from "appwrite";
import { Users2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function TeamPage() {
  const { user } = useUser();
  const {currentTeam} = useTeam();
  const [teamPrefs, setTeamPrefs] = useState<Models.Preferences>({});
  
  useEffect(() => {
    const fetchUserTeamPrefs = async () => {
      if (!currentTeam) return;
      const team = await getAppwriteTeam(currentTeam.$id);
      if (!team) return;
      setTeamPrefs(team.prefs);
    }
    fetchUserTeamPrefs();
  }, [currentTeam])

  return (
    <main>
      <Header />
      <div className="p-8 max-w-6xl mx-auto">
        <Tabs
          defaultValue="general"
          orientation="vertical"
          className="w-full flex-row gap-x-12"
        >
          <TabsList className="flex flex-col gap-1 bg-transparent py-0 h-40">
            <h3 className="text-2xl font-bold py-4 text-foreground">Team Settings</h3>
            <TabsTrigger
              value="general"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
          <div className="grow rounded-md text-start">
            <TabsContent value="general">
              <div className="space-y-1 py-4">
                <h3 className="text-xl font-medium">General</h3>
                <p className="text-muted-foreground text-xs">
                  Manage your team&apos;s general settings
                </p>
              </div>
              <div className="border-t border-dashed" />
              <div className="space-y-2 py-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg">Name</h4>
                  <p className="text-muted-foreground text-xs">
                    Set a name for your team
                  </p>
                </div>
                <div className="space-y-1 flex gap-x-2">
                  <Input variant={"default"} className="w-[250px] bg-zinc-900" name="team-name" defaultValue={currentTeam?.name}>
                    <Input.Group>
                      <Input.LeftIcon>
                        <Users2 />
                      </Input.LeftIcon>
                    </Input.Group>
                  </Input>
                  <Button variant={"outline"}>Save</Button>
                </div>
              </div>
              <div className="border-t border-dashed" />
              <div className="space-y-2 py-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg">Currency</h4>
                  <p className="text-muted-foreground text-xs">
                    Set the currency of your team
                  </p>
                </div>
                <div className="space-y-1 flex gap-x-2">
                  <Select value={teamPrefs.currency}>
                    <SelectTrigger className="w-[250px] bg-zinc-900">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currencies</SelectLabel>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="EGP">EGP (EGP)</SelectItem>
                        <SelectItem value="AED">AED (AED)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button variant={"outline"}>Save</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="space-y-1 py-4">
                <h3 className="text-xl font-medium">Security</h3>
                <p className="text-muted-foreground text-xs">
                  Manage your team&apos;s security settings
                </p>
              </div>
              <div className="border-t border-dashed" />
            </TabsContent>
            <TabsContent value="notifications">
              <p className="text-muted-foreground px-4 py-3 text-xs">
                Content for Tab 3
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
