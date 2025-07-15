import { useQuery } from "@tanstack/react-query";
import { listAllExecutions } from "./actions";

export const useGetAdminExecutions = () => {
  return useQuery({
    queryKey: ["executions"],
    queryFn: async () => {
      const executions = await listAllExecutions();
      return executions;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
