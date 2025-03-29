import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Template } from "@/types";
import { UpdateTemplate } from "../actions";
import { useGetMembership } from "@/features/team/hooks/use-get-membership";


export const useUpdateTemplate = () => {
  const {data: membership} = useGetMembership();
  return useMutation({
    mutationFn: async ({data, id}: {data: Partial<Template>, id: Template['$id']}) => {
      if (!membership?.teamId) {
        throw new Error('Not a member of a team')
      }
      const template = await UpdateTemplate(id, membership?.teamId, data)
      return template;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['templates'], (oldData: any[]) => {
      //    return oldData.map((c) => (c.$id === data?.$id ? data : c))
      // });
      toast.success('Template updated successfully')
    },
    onError: (error) => {
      console.error('Error updating template:', error)
    },
  })
}