import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { updateMaterial } from "../actions";
import { Material } from "@/types";
import { toastAPI } from "@/lib/ToastAPI";


export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({id, data}: {id: Material['$id'], data: Partial<Material>}) => {
      const res = await updateMaterial(id, data)
      if (!res.success) {
        throw new Error(res.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['materials']})
      toastAPI.success('Material updated')
    },
    onError: (error) => {
      toastAPI.error(error.message || "An unknown error occurred")
    },
  })
}