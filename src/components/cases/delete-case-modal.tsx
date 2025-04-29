import { Button } from "@/components/ui/button";
// import { useTeamStore } from "~/store/(user)/TeamStore";
// import { useCasesStore } from "~/store/Cases";
// import { useDoctorsStore } from "~/store/Doctors";
import { ResponsiveModalWithTrigger } from "../responsive-modal";
import { useState } from "react";
import { Case } from "@/types";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useDeleteCase } from "@/features/cases/hooks/use-delete-case";
import useTeamStore from "@/store/team-store";

interface DeleteCaseModalModal {
  cases: Case[];
  component?: React.ReactNode;
}
export function DeleteCaseModal({ cases, component }: DeleteCaseModalModal) {
  const [open, setOpen] = useState(false);
  // const {team, updateTeam} = useTeamStore();
  const {membership} = useTeamStore();

  const {mutate, isPending} = useDeleteCase();
 
  const handleDelete = async () => {
    if (!membership) {
      return;
    }
    mutate({casesIds: cases.map(c => c.$id), teamId: membership.teamId});
    setOpen(false);
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
    //   toast.success("Case deleted successfully");
    // }
    // if (response.status === "failed") {
    //   console.log(response)
    //   toast.error("Failed to delete case");
    // }
  };

  return (
    <ResponsiveModalWithTrigger
      open={open}
      onOpenChange={setOpen}
      trigger={
        <DialogTrigger asChild>
          {component ?? (
            <Button disabled={isPending} variant={"ghost"} className="w-full justify-start">
              Delete
            </Button>
          )}
        </DialogTrigger>
      }
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
        <Button disabled={isPending} onClick={handleDelete}>Confirm</Button>
      </DialogFooter>
      </div>
    </ResponsiveModalWithTrigger>
  );
}
