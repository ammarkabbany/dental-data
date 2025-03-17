import { useQuery } from "@tanstack/react-query"
import { GetMaterialById } from "../actions"

export const useGetMaterialById = (id: string) => {
  return useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      const material = await GetMaterialById(id);
      return material;
    },
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}