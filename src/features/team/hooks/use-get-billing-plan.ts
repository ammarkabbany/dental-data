import { useQuery } from "@tanstack/react-query"
import { getBillingPlan } from "../planService";
import { useCurrentTeam } from "./use-current-team";

export const useGetBillingPlan = () => {
  const {data} = useCurrentTeam();
  return useQuery({
    queryKey: ['billing_plan'],
    queryFn: async () => {
      if (!data?.planId) return null;
      const plan = await getBillingPlan(data.planId);
      return plan;
    },
    enabled: !!data?.planId,
    staleTime: 0
  })
}