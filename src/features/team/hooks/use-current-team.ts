import { useQuery } from "@tanstack/react-query"
import { getAppwriteTeam } from "../queries";
import { databases } from "@/lib/appwrite/client";
import { Team } from "@/types";
import { DATABASE_ID, TEAMS_COLLECTION_ID } from "@/lib/constants";

export const useCurrentTeam = () => {
  return useQuery({
    queryKey: ['current_team'],
    queryFn: async () => {
      try {
        const appwriteTeam = await getAppwriteTeam();
        if (!appwriteTeam) return null;
        const team = await databases.getDocument<Team>(
          DATABASE_ID,
          TEAMS_COLLECTION_ID,
          appwriteTeam.$id
        )
        return team;
      } catch (error) {
        console.error(error);
        return null; 
      }
    },
    retry: 2,
    gcTime: 1000 * 60 * 60, // Cache persists for 1 hour
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: false, // Prevent refetch on component mount
  })
}