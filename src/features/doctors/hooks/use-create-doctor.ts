import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateDoctor } from "../actions";
import { Doctor } from "@/types";


export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data, teamId}: {data: Partial<Doctor>, teamId: string}) => {
      const doctor = await CreateDoctor(teamId, data)
      return doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['doctors']})
      toast.success('Doctor created successfully')
    },
    onError: (error) => {
      console.error('Error updating doctor:', error)
    },
  })
}