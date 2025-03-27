import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { createTeam } from "../teamService";
import { teams } from "@/lib/appwrite/client";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({name, userId}: {name: string, userId: string}) => {
      const team = await createTeam(name, userId);
      const appwriteTeam = await teams.create(team.$id, name, ['owner', 'member'])
      return {
        team,
        appwriteTeam,
        role: 'owner'
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['team']})
      toast.success('Team created successfully')
    },
    onError: (error) => {
      console.error('Error create team:', error)
    },
  })
}