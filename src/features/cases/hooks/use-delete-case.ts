import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { DeleteCase } from "../actions";
import { toastAPI } from "@/lib/ToastAPI";


export const useDeleteCase = () => {
  return useMutation({
    mutationFn: async ({casesIds, teamId}: {casesIds: Case['$id'][], teamId: string}) => {
      await DeleteCase(casesIds, teamId)
    },
    onSuccess: () => {
      toastAPI.success('Case deleted')
    },
    onError: (error) => {
      console.error('Error deleting case:', error)
    },
  })
}