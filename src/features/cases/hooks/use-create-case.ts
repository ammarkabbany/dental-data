import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { CreateCase } from "../actions";


export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data, teamId, userId}: {data: Partial<Case>, teamId: string, userId: string}) => {
      const res = await CreateCase(teamId, userId, data)
      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['cases'], (oldData: any[]) => [data, ...oldData]);
      toast.success('Case created successfully')
    },
    onError: (error) => {
      toast.error(error.message);
      console.error('Error creating case:', error)
    },
  })
}