import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { UpdateDoctor } from "../actions";
import { Doctor } from "@/types";


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
      toast.success('Doctor updated successfully')
    },
    // onError: (error) => {
    //   toast.error(error.message)
    // },
  })
}