import { useQuery } from "@tanstack/react-query"
import { getAppwriteMembership, getAppwriteTeam } from "../queries";
import { account } from "@/lib/appwrite/client";
import { useAuth } from "@/providers/auth-provider";

export const useGetMembership = () => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['membership'],
    queryFn: async () => {
      try {
        const appwriteTeam = await getAppwriteTeam();
        if (!appwriteTeam) return null;
        
        // Use the user from context if available to avoid extra API call
        const userId = user?.$id || (await account.get()).$id;
        const membership = await getAppwriteMembership(appwriteTeam.$id, userId);
        
        return membership || null;
      } catch (error) {
        console.error('Error fetching membership:', error);
        return null; 
      }
    },
    enabled: isAuthenticated && !!user, // Only run query when user is authenticated and user object exists
  })
}