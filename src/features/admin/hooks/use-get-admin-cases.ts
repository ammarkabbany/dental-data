import { useQuery } from "@tanstack/react-query";
import { getAllCases } from "../admin-service";

export const useGetAdminCases = () => {
  return useQuery({
    queryKey: ["admin_cases"],
    queryFn: async () => {
      const cases = await getAllCases();
      return cases;
    },
    retry: false
  });
};
