import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { updateTeam } from "../teamService";

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, updates }: { teamId: string, updates: { name?: string, currency?: string } }) => {
      await updateTeam(teamId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      toast.success('Team updated successfully')
    },
    onError: (error) => {
      console.error('Error create team:', error)
    },
  })
}
