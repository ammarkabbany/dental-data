import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Template } from "@/types";
import { CreateTemplate } from "../actions";


export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data, teamId}: {data: Partial<Template>, teamId: string}) => {
      const template = await CreateTemplate(teamId, data)
      return template;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['templates'], (oldData: any[]) => [data, ...oldData]);
      toast.success('Template created successfully')
    },
    onError: (error) => {
      console.error('Error creating template:', error)
    },
  })
}