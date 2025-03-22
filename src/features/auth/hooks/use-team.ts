import { getUserTeams } from "@/lib/team-service";
import { useQuery } from "@tanstack/react-query"


export const useUserTeams = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ["current_team"],
    queryFn: async () => {
      const userTeams = await getUserTeams(userId);
      return userTeams;
    },
  })

  return query;
}