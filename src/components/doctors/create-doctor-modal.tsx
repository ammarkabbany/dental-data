import { ResponsiveModal } from "../responsive-modal";
import { Modals, useModalStore } from "@/store/modal-store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDoctorSchema } from "@/features/doctors/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateDoctor } from "@/features/doctors/hooks/use-create-doctor";
import { useOnboardingStore } from "@/store/onboarding-store"; // Import onboarding store

export const CreateDoctorModal = () => {
  const { isModalOpen, closeModal } = useModalStore();
  // Onboarding store
  const { checklistItems, completeChecklistItem } = useOnboardingStore();

  const {mutate, isPending, error} = useCreateDoctor();

  const onCancel = () => {
    form.reset();
    closeModal(Modals.CREATE_DOCTOR_MODAL);
  };

  const form = useForm<z.infer<typeof createDoctorSchema>>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
    }
  });

  const onSubmit = (values: z.infer<typeof createDoctorSchema>) => {
    mutate({data: values}, {
      onSuccess: () => {
        // Complete checklist item for adding a doctor
        if (!checklistItems.addedFirstDoctor) {
          completeChecklistItem('addedFirstDoctor');
        }
        form.reset();
        closeModal(Modals.CREATE_DOCTOR_MODAL);
      }
    })
  };

  return (
    <ResponsiveModal
      open={isModalOpen(Modals.CREATE_DOCTOR_MODAL)}
      onOpenChange={() => closeModal(Modals.CREATE_DOCTOR_MODAL)}
    >
      <Card className="w-full h-full border-none shadow-none bg-gradient-to-t from-card to-accent">
        <CardHeader className="flex px-7">
          <CardTitle className="text-xl font-bold">
            Create new doctor
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="!flex !flex-col gap-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input maxLength={32} {...field} placeholder="Enter name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="mt-2" />
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="secondary"
                  type="button"
                  size={"lg"}
                  className={`${!onCancel && "invisible"}`}
                  onClick={onCancel}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={"lg"}
                  variant="default"
                  disabled={isPending}
                >
                  Create
                </Button>
              </div>
            </form>
            {error && (
            <div className="text-red-500 text-xs mt-4">
              {error.message}
            </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
