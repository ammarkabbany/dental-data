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
    refetchInterval: 5000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });
};
