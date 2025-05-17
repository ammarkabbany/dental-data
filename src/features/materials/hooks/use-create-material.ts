import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateMaterial } from "../actions";
import { Material } from "@/types";
import useTeamStore from "@/store/team-store";
import { toastAPI } from "@/lib/ToastAPI";


export const useCreateMaterial = () => {
  const {membership} = useTeamStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Material>}) => {
      if (!membership) {
        throw new Error('You are not a member of a team')
      }
      const res = await CreateMaterial(membership.userId, membership.teamId, data)
      if (!res.success) {
        throw new Error(res.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['materials']})
      toastAPI.success('Material created')
    },
    // onError: (error) => {
    //   toastAPI.error(error.message)
    // },
  })
}