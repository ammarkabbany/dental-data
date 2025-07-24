import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { createTeam } from "../teamService";
import { teams } from "@/lib/appwrite/client";
import { toastAPI } from "@/lib/ToastAPI";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { name: string; userId: string; type: 'dental_lab' | 'clinic' | 'freelancer' | 'other' }>({
    mutationFn: async ({name, userId, type}) => {
      const team = await createTeam(name, userId, type);
      const appwriteTeam = await teams.create(team.$id, name, ['owner'])
      return {
        team,
        appwriteTeam,
        role: 'owner'
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['team']})
      toastAPI.success('Team created')
    },
    onError: (error) => {
      console.error('Error create team:', error)
    },
  })
}