import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { UpdateCase } from "../actions";


export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data, caseId, teamId}: {data: Partial<Case>, caseId: Case['$id'], teamId: Case['teamId'] | undefined}) => {
      const Case = await UpdateCase(caseId, teamId, data)
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