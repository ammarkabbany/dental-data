import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Template } from "@/types";
import { UpdateTemplate } from "../actions";


export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data, id, teamId}: {data: Partial<Template>, id: Template['$id'], teamId: Template['teamId'] | undefined}) => {
      const template = await UpdateTemplate(id, teamId, data)
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