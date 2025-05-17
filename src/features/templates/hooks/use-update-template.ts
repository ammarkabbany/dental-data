import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";
import { Template } from "@/types";
import { UpdateTemplate } from "../actions";
import useTeamStore from "@/store/team-store";
import { toastAPI } from "@/lib/ToastAPI";


export const useUpdateTemplate = () => {
  const {membership} = useTeamStore();
  return useMutation({
    mutationFn: async ({data, id}: {data: Partial<Template>, id: Template['$id']}) => {
      if (!membership?.teamId) {
        throw new Error('Not a member of a team')
      }
      const template = await UpdateTemplate(id, membership?.teamId, data)
      return template;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(['templates'], (oldData: any[]) => {
      //    return oldData.map((c) => (c.$id === data?.$id ? data : c))
      // });
      toastAPI.success('Template updated')
    },
    onError: (error) => {
      console.error('Error updating template:', error)
    },
  })
}