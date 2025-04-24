import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateMaterial } from "../actions";
import { Material } from "@/types";
import useTeamStore from "@/store/team-store";


export const useCreateMaterial = () => {
  const {membership} = useTeamStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Material>}) => {
      if (!membership) {
        throw new Error('You are not a member of a team')
      }
      const doctor = await CreateMaterial(membership.userId, membership.teamId, data)
      return doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['materials']})
      toast.success('Material created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}