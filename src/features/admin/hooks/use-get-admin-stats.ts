import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../admin-service";

export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const stats = await getAdminStats();
      return stats;
    },
  });
};
