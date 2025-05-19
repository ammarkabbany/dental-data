import { Button } from "@/components/ui/button";
// import { useTeamStore } from "~/store/(user)/TeamStore";
// import { useCasesStore } from "~/store/Cases";
// import { useDoctorsStore } from "~/store/Doctors";
import { ResponsiveModal } from "../responsive-modal";
import { useState } from "react";
import { Case } from "@/types";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteCase } from "@/features/cases/hooks/use-delete-case";
import useTeamStore from "@/store/team-store";
import { useModalStore } from "@/store/modal-store";

interface DeleteCaseModalModal {
  cases: Case[];
  onDelete?: () => void;
}
export function DeleteCaseModal({ cases, onDelete }: DeleteCaseModalModal) {
  const {closeModal, isModalOpen} = useModalStore();
  // const {team, updateTeam} = useTeamStore();
  const { membership } = useTeamStore();

  const { mutate, isPending } = useDeleteCase();

  const handleDelete = async () => {
    if (!membership) {
      return;
    }
    mutate({ casesIds: cases.map((c) => c.$id), teamId: membership.teamId }, {
      onSuccess: () => {
        closeModal("delete-case");
        onDelete?.();
      },
    });
    // const [response] = await Promise.all([
    //   // deleteCase(_case.$id),
    //   // updateDoctor(_case?.doctorId || "", {
    //   //   due: Math.max(
    //   //     (_case?.doctor.due || 0) - (_case?.due || 0),
    //   //     0,
    //   //   ),
    //   //   totalCases: Math.max(0, (getDoctorById(_case.doctorId)?.totalCases ?? 0) - 1),
    //   // }),
    //   deleteMultipleCases({documents: cases.map(c => c.$id)}),
    //   updateTeam({
    //     casesUsed: Math.max(0, team!.casesUsed - cases.length),
    //   })
    // ]);
    // if (response.status === "completed") {
    //   toastAPI.success("Case deleted successfully");
    // }
    // if (response.status === "failed") {
    //   console.log(response)
    //   toastAPI.error("Failed to delete case");
    // }
  };

  return (
    <ResponsiveModal
      open={isModalOpen("delete-case")}
      onOpenChange={() => closeModal("delete-case")}
      // trigger={
      //   <DialogTrigger asChild>
      //     {component ?? (
      //       <Button disabled={isPending} variant="destructive" className="gap-2">
      //         <Trash2 className="h-4 w-4" />
      //         Delete Selected ({Math.min(cases.length, 100)})
      //       </Button>
      //     )}
      //   </DialogTrigger>
      // }
      className="bg-gradient-to-t from-card to-accent"
    >
      <div className="p-7 space-y-4">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this case
            and will affect doctor data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"secondary"} asChild>
            <DialogClose disabled={isPending}>Cancel</DialogClose>
          </Button>
          <Button disabled={isPending} onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </div>
    </ResponsiveModal>
  );
}
