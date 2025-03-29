import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateMaterial } from "../actions";
import { Material } from "@/types";
import { useGetMembership } from "@/features/team/hooks/use-get-membership";


export const useCreateMaterial = () => {
  const {data: membership} = useGetMembership();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Material>}) => {
      if (!membership) {
        throw new Error('You are not a member of a team')
      }
      const doctor = await CreateMaterial(membership.teamId, data)
      return doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['materials']})
      toast.success('Material created successfully')
    },
    onError: (error) => {
      console.error('Error updating doctor:', error)
    },
  })
}