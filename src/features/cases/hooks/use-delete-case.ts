import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { DeleteCase } from "../actions";


export const useDeleteCase = () => {
  return useMutation({
    mutationFn: async ({casesIds, teamId}: {casesIds: Case['$id'][], teamId: string}) => {
      await DeleteCase(casesIds, teamId)
    },
    onSuccess: () => {
      toast.success('Case deleted successfully')
    },
    onError: (error) => {
      console.error('Error creating case:', error)
    },
  })
}