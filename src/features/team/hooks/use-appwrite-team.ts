import { useQuery } from "@tanstack/react-query"
import { getAppwriteTeam } from "../queries";

export const useAppwriteTeam = () => {
  return useQuery({
    queryKey: ['appwrite_team'],
    queryFn: async () => {
      try {
        const team = await getAppwriteTeam();
        return team || null;
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