import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { UpdateCase } from "../actions";
import { useGetMembership } from "@/features/team/hooks/use-get-membership";


export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  const {data: membership} = useGetMembership();
  return useMutation({
    mutationFn: async ({data, oldDue, caseId}: {data: Partial<Case>, oldDue: number, caseId: Case['$id']}) => {
      if (!membership) {
        throw new Error('User is not a member of a team')
      }
      const Case = await UpdateCase(caseId, membership.teamId, data, oldDue)
      return Case;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['cases'], (oldData: any[]) => {
      //    return oldData.map((c) => (c.$id === data?.$id ? data : c))
      // });
      // queryClient.invalidateQueries({queryKey: ['case', data?.$id]})
      toast.success('Case updated successfully')
    },
    onError: (error) => {
      console.error('Error creating case:', error)
    },
  })
}