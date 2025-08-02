import { useQuery } from "@tanstack/react-query";
import { listAllExecutions } from "./actions";

export const useGetAdminExecutions = (status?: string) => {
  return useQuery({
    queryKey: ["adminExecutions", status],
    queryFn: async () => listAllExecutions(status),
    retry: false,
    refetchInterval: 5000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    staleTime: 0
  });
};
