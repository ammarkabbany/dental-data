import { useMutation } from "@tanstack/react-query";
import useTeamStore from "@/store/team-store";
import { submitApplication } from "../actions";
import { toast } from "sonner";

export const useSubmitInstapay = () => {
  const { membership } = useTeamStore();
  return useMutation({
    mutationFn: async ({image, planId, amount}: {
      image: File;
      planId: string;
      amount: number;
    }) => {
      if (!membership) {
        throw new Error("User is not a member of a team");
      }
      const res = await submitApplication({
        form: {
          userId: membership.userId,
          teamId: membership.teamId,
          planId,
          amount,
          image,
        },
      });
      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
