import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { CreateCase } from "../actions";


export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data, teamId, userId}: {data: Partial<Case>, teamId: string, userId: string}) => {
      const Case = await CreateCase(teamId, userId, data)
      return Case;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['cases'], (oldData: any[]) => [data, ...oldData]);
      toast.success('Case created successfully')
    },
    onError: (error) => {
      console.error('Error creating case:', error)
    },
  })
}