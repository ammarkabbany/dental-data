import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastAPI } from "@/lib/ToastAPI";
import useTeamStore from "@/store/team-store";
import { CreateCaseInvoice } from "../actions";
import { CaseInvoice } from "@/types";

export const useCreateCaseInvoice = () => {
  const { membership } = useTeamStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: Partial<CaseInvoice> }) => {
      if (!membership) {
        throw new Error("User is not a member of a team");
      }
      const res = await CreateCaseInvoice(
        membership.userId,
        membership.teamId,
        data
      );
      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseInvoices"] });
      toastAPI.success("Export saved successfully");
    },
    onError: (error) => {
      toastAPI.error(error.message);
    },
  });
};