import { useQuery } from "@tanstack/react-query";
import { account, databases } from "@/lib/appwrite/client";
import { DATABASE_ID, TEAMS_COLLECTION_ID } from "@/lib/constants";
import { Team } from "@/types";
import { getAppwriteTeam } from "../queries";
import { getUserRole } from "@/features/auth/actions";

export const useTeamData = () => {
  const query = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const appwriteTeam = await getAppwriteTeam();
      if (!appwriteTeam) return;
      try {
        const user = await account.get();
        const team = await databases.getDocument<Team>(
          DATABASE_ID,
          TEAMS_COLLECTION_ID,
          appwriteTeam.$id
        )
        const role = await getUserRole(appwriteTeam.$id, user.$id);
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
    // refetchInterval: 60000, // refetch every minute
    retry: 2
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