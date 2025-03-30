import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateDoctor } from "../actions";
import { Doctor } from "@/types";
import useTeamStore from "@/store/team-store";


export const useCreateDoctor = () => {
  const {membership} = useTeamStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Doctor>}) => {
      if (!membership) {
        throw new Error('User is not a member of a team')
      }
      const doctor = await CreateDoctor(membership.teamId, data)
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