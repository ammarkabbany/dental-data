import { Doctor } from "@/types";
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
import { useTeam } from "@/providers/team-provider";

export const DoctorCreateModal = () => {
  const {currentTeam} = useTeam();
  const { isModalOpen, closeModal } = useModalStore();

  const {mutate, isPending, error} = useCreateDoctor();

  const onCancel = () => {
    closeModal(Modals.CREATE_DOCTOR_MODAL);
  };

  const form = useForm<z.infer<typeof createDoctorSchema>>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
      due: 0,
      totalCases: 0,
    }
  });

  const onSubmit = (values: z.infer<typeof createDoctorSchema>) => {
    if (!currentTeam) {
      return;
    }
    mutate({data: values, teamId: currentTeam.$id}, {
      onSuccess: () => {
        closeModal(Modals.CREATE_DOCTOR_MODAL);
      }
    })
      
  };

  return (
    <ResponsiveModal
      open={isModalOpen(Modals.CREATE_DOCTOR_MODAL)}
      onOpenChange={() => closeModal(Modals.CREATE_DOCTOR_MODAL)}
    >
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">
            Update doctor details
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
                        <Input {...field} placeholder="Enter name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="due"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                          placeholder="Enter number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalCases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Cases</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                          placeholder="Enter number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
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
