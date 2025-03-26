import { useQuery } from "@tanstack/react-query"
import { getBillingPlan } from "../planService";

export const useGetBillingPlan = (id: string | undefined) => {
  return useQuery({
    queryKey: ['billing_plan', id],
    queryFn: async () => {
      if (!id) return null;
      const plan = await getBillingPlan(id);
      return plan;
    },
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}