import { useQuery } from "@tanstack/react-query"
import { getAppwriteTeam } from "../queries";

export const useAppwriteTeam = (teamId: string) => {
  const query = useQuery<any>({
    queryKey: ["appwrite_team"],
    queryFn: async () => {
      const team = await getAppwriteTeam(teamId);

      return team;
    },
  })

  return query;
}