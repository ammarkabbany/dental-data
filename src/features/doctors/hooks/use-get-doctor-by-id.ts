import { useQuery } from "@tanstack/react-query"
import { GetDoctorById } from "../actions"

export const useGetDoctorById = (id: string) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const doctor = await GetDoctorById(id);
      return doctor;
    },
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}