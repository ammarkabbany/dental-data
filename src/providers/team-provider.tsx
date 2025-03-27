"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Assuming you're using Clerk
import { Team } from "@/types"; // Adjust the import based on your structure
import { useAuth } from "./auth-provider";
import {
  getAppwriteMembership,
  getAppwriteTeam,
} from "@/features/team/queries";
import { Models, Query } from "appwrite";
import { getUserRole } from "@/features/auth/actions";
import { databases } from "@/lib/appwrite/client";
import { DATABASE_ID, TEAMS_COLLECTION_ID } from "@/lib/constants";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { useQueryClient } from "@tanstack/react-query";
import { useTeamData } from "@/features/team/hooks/use-team";

interface TeamContextType {
  currentTeam: Team | null;
  appwriteTeam: Models.Team<Models.Preferences> | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading: isUserLoading } = useAuth();
  const { user } = useUser();

  // const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  // const [appwriteTeam, setAppwriteTeam] =
  //   useState<Models.Team<Models.Preferences> | null>(null);
  // const [userRole, setUserRole] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  const {data, isLoading, refetch} = useTeamData();

  // async function loadCurrentTeam() {
  //   if (!user) {
  //     setCurrentTeam(null);
  //     setUserRole(null);
  //     return;
  //   }
  //   setLoading(true);

  //   // const teams = await getUserTeams(user.id);
  //   const teamId = localStorage.getItem("currentTeamId");
  //   await getAppwriteTeam().then(async (team) => {
  //     if (team) {
  //       const teamDoc = await databases.getDocument<Team>(
  //         DATABASE_ID,
  //         TEAMS_COLLECTION_ID,
  //         team.$id,
  //         [
  //           Query.select([
  //             "$id",
  //             "name",
  //             "planId",
  //             "casesUsed",
  //             "maxCases",
  //             "planExpiresAt",
  //           ]),
  //         ]
  //       );
  //       // const role = await getUserRole(team.$id, user.id);
  //       const membership = await getAppwriteMembership(team.$id, user.id);
  //       const role = membership?.roles[0];
  //       setAppwriteTeam(team);
  //       setCurrentTeam(teamDoc);
  //       setUserRole(role || null);
  //     } else {
  //       setCurrentTeam(null);
  //       setAppwriteTeam(null);
  //       setUserRole(null);
  //     }
  //     setLoading(false);
  //   });
  // }

  useEffect(() => {
    if (!isUserLoading && isAuthenticated) {
      refetch()
    }
  }, [isUserLoading, isAuthenticated, user]);

  // const queryClient = useQueryClient();
  useRealtimeUpdates(TEAMS_COLLECTION_ID, (res) => {
    const events = res.events;
    const payload = res.payload as Team;
    if (events.includes("databases.*.collections.*.documents.*.update")) {
      refetch();
    }
  });

  return (
    <TeamContext.Provider
      value={{
        currentTeam: data?.team || null,
        // setCurrentTeam,
        appwriteTeam: data?.appwriteTeam || null,
        // setAppwriteTeam,
        userRole: data?.role || null,
        // setUserRole,
        isLoading: isUserLoading || isLoading,
        isAuthenticated,
      }}
    >
      {/* <SimplePageLoader isLoading={loading} fullScreen /> */}
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook to use the Team context
export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
