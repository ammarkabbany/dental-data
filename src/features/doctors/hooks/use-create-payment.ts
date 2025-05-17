import { Payment } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { createPayment } from "../payments";
import { toastAPI } from "@/lib/ToastAPI";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Payment>}) => {
      const payment = await createPayment(data)
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['doctors']})
      toastAPI.success('Payment created')
    },
    onError: (error) => {
      console.error('Error creating payment:', error)
    },
  })
}