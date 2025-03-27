import { useQuery } from "@tanstack/react-query";
import { account, databases } from "@/lib/appwrite/client";
import { DATABASE_ID, TEAMS_COLLECTION_ID } from "@/lib/constants";
import { Team } from "@/types";
import { getAppwriteMembership, getAppwriteTeam } from "../queries";

export const useTeamData = () => {
  const query = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const appwriteTeam = await getAppwriteTeam();
      if (!appwriteTeam) return {
        appwriteTeam: null,
        team: null,
        role: null
      };
      try {
        const user = await account.get();
        const team = await databases.getDocument<Team>(
          DATABASE_ID,
          TEAMS_COLLECTION_ID,
          appwriteTeam.$id
        )
        const membership = await getAppwriteMembership(team.$id, user.$id);
        const role = membership?.roles[0];
        return {
          appwriteTeam,
          team,
          role
        };
      } catch (error) {
        return {
          appwriteTeam: null,
          team: null,
          role: null
        }
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 30, // Data stays fresh for 30 minutes
    gcTime: 1000 * 60 * 60, // Cache persists for 1 hour
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: false, // Prevent refetch on component mount
  })

  return query;
}

// if (!user) {
//   setCurrentTeam(null);
//   setUserRole(null)
//   console.log('Not authorized')
//   return;
// }

// const teams = await getUserTeams(user.id);
// const teamId = localStorage.getItem('currentTeamId');

// if (teams[0]) {
//   localStorage.setItem('currentTeamId', teams[0].$id);
//   const membership = await getTeamMembership(teams[0].$id, user.id);
//   setUserRole(membership?.role || null);
//   setCurrentTeam(teams[0]);
// }