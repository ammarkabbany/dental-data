import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Template } from "@/types";
import { DeleteTemplate } from "../actions";


export const useDeleteTemplate = () => {
  return useMutation({
    mutationFn: async ({id}: {id: Template['$id']}) => {
      await DeleteTemplate(id)
    },
    onSuccess: () => {
      // queryClient.setQueryData(['templates'], (oldData: any[]) => {
      //    return oldData.map((c) => (c.$id === data?.$id ? data : c))
      // });
      toast.success('Template deleted successfully')
    },
    onError: (error) => {
      console.error('Error updating template:', error)
    },
  })
}