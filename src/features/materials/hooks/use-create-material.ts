import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateMaterial } from "../actions";
import { Material } from "@/types";


export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data, teamId}: {data: Partial<Material>, teamId: string}) => {
      const doctor = await CreateMaterial(teamId, data)
      return doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['materials']})
      toast.success('Material created successfully')
    },
    onError: (error) => {
      console.error('Error updating doctor:', error)
    },
  })
}