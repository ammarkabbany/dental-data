import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "../admin-service";

export const useGetAdminTeams = () => {
  return useQuery({
    queryKey: ["admin_teams"],
    queryFn: async () => {
      const teams = await getAllTeams();
      return teams;
    },
  });
};
