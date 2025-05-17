import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { Template } from "@/types";
import { CreateTemplate } from "../actions";
import useTeamStore from "@/store/team-store";
import { toastAPI } from "@/lib/ToastAPI";


export const useCreateTemplate = () => {
  const {membership} = useTeamStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Template>}) => {
      if (!membership) {
        throw new Error('Not a member of a team')
      }
      const template = await CreateTemplate(membership.teamId, data)
      return template;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['templates'], (oldData: any[]) => [data, ...oldData]);
      toastAPI.success('Template created')
    },
    onError: (error) => {
      toastAPI.error(error.message)
    },
  })
}