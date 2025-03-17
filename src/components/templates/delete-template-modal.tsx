import { Button } from "@/components/ui/button";
// import { useTeamStore } from "~/store/(user)/TeamStore";
// import { useCasesStore } from "~/store/Cases";
// import { useDoctorsStore } from "~/store/Doctors";
import { ResponsiveModalWithTrigger } from "../responsive-modal";
import { useState } from "react";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Template } from "@/types";
import { useDeleteTemplate } from "@/features/templates/hooks/use-delete-template";
import { Trash } from "lucide-react";

interface DeleteTemplateModalProps {
  templateId: Template['$id'];
  component?: React.ReactNode;
}
export function DeleteTemplateModal({ templateId, component }: DeleteTemplateModalProps) {
  const [open, setOpen] = useState(false);
  // const {team, updateTeam} = useTeamStore();

  const {mutate, isPending} = useDeleteTemplate();
 
  const handleDelete = async () => {
    mutate({id: templateId});
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
            <Button variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>
      }
    >
      <div className="p-7 space-y-4">
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete this template.
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
