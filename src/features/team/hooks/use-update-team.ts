import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { updateTeamSettings } from "../teamService";
import { toastAPI } from "@/lib/ToastAPI";

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, updates }: { teamId: string, updates: { name?: string, currency?: string } }) => {
      await updateTeamSettings(teamId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      toastAPI.success('Team updated')
    },
    onError: (error) => {
      console.error('Error updating team:', error)
    },
  })
}
