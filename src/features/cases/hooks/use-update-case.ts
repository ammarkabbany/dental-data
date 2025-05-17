import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { UpdateCase } from "../actions";
import useTeamStore from "@/store/team-store";
import { toastAPI } from "@/lib/ToastAPI";


export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  const {membership} = useTeamStore();
  return useMutation({
    mutationFn: async ({data, oldCase, caseId}: {data: Partial<Case>, oldCase: Case, caseId: Case['$id']}) => {
      if (!membership) {
        throw new Error('User is not a member of a team')
      }
      const Case = await UpdateCase(caseId, membership.teamId, data, oldCase)
      return Case;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['cases'], (oldData: any[]) => {
      //    return oldData.map((c) => (c.$id === data?.$id ? data : c))
      // });
      // queryClient.invalidateQueries({queryKey: ['case', data?.$id]})
      toastAPI.success('Case updated')
    },
    onError: (error) => {
      console.error('Error updating case:', error)
    },
  })
}