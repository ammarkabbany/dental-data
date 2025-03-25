import { Payment } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { createPayment } from "../payments";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({data}: {data: Partial<Payment>}) => {
      const payment = await createPayment(data)
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['doctors']})
      toast.success('Payment created successfully')
    },
    onError: (error) => {
      console.error('Error creating payment:', error)
    },
  })
}