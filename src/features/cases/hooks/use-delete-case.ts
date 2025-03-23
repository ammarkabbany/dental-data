import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";
import { Case } from "@/types";
import { DeleteCase } from "../actions";
import { useTeam } from "@/providers/team-provider";


export const useDeleteCase = () => {
  const {currentTeam} = useTeam();
  return useMutation({
    mutationFn: async ({casesIds}: {casesIds: Case['$id'][]}) => {
      await DeleteCase(casesIds)
    },
    onSuccess: () => {
      toast.success('Case deleted successfully')
    },
    onError: (error) => {
      console.error('Error creating case:', error)
    },
  })
}