import { getUserTeams } from "@/lib/team-service";
import { useQuery } from "@tanstack/react-query"
import { getUserRole } from "../actions";


export const useTeamRole = (teamId: string, userId: string) => {
  const query = useQuery({
    queryKey: ["current_team_role"],
    queryFn: async () => {
      const role = await getUserRole(teamId, userId);
      return role;
    },
  })

  return query;
}