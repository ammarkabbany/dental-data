"use client";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { HouseIcon } from "lucide-react";

export default function AccountPage() {
  const { user } = useUser();

  return (
    <main>
      <Header />
      <div className="p-8">
        <Tabs
          defaultValue="tab-1"
          orientation="vertical"
          className="w-full flex-row gap-x-12"
        >
          <TabsList className="flex-col gap-1 bg-transparent py-0">
            <h3 className="text-2xl font-bold py-4 text-foreground">Settings</h3>
            <TabsTrigger
              value="tab-1"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
          <div className="grow rounded-md text-start">
            <TabsContent value="tab-1">
              <p className="text-muted-foreground px-4 py-3 text-xs">
                Content for Tab 1
              </p>
            </TabsContent>
            <TabsContent value="tab-2">
              <p className="text-muted-foreground px-4 py-3 text-xs">
                Content for Tab 2
              </p>
            </TabsContent>
            <TabsContent value="tab-3">
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
