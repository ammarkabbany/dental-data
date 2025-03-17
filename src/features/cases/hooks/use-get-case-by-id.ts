import { useQuery } from "@tanstack/react-query"
import { GetCaseById } from "../actions"

export const useGetCaseById = (id: string) => {
  return useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const _case = await GetCaseById(id);
      return _case;
    },
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}