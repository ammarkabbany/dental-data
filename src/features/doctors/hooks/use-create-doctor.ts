import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateDoctor } from "../actions";
import { Doctor } from "@/types";
import useTeamStore from "@/store/team-store";
import { toastAPI } from "@/lib/ToastAPI";

export const useCreateDoctor = () => {
  const {membership} = useTeamStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Doctor>}) => {
      if (!membership) {
        throw new Error('User is not a member of a team')
      }
      const res = await CreateDoctor(membership.userId ,membership.teamId, data)
      if (!res.success) {
        throw new Error(res.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['doctors']})
      toastAPI.success('Doctor created')
    },
    // onError: (error) => {
    //   toastAPI.error(error.message)
    // },
  })
}