import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { UpdateDoctor } from "../actions";
import { Doctor } from "@/types";
import { toastAPI } from "@/lib/ToastAPI";


export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({id, data}: {id: Doctor['$id'], data: Partial<Doctor>}) => {
      const res = await UpdateDoctor(id, data)
      if (!res.success) {
        throw new Error(res.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['doctors']})
      toastAPI.success('Doctor updated')
    },
    onError: (error) => {
      toastAPI.error(error.message || "An unknown error occurred")
    },
  })
}