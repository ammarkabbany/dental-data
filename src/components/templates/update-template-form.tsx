import { ResponsiveModalWithTrigger } from "../responsive-modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createTemplateSchema } from "@/features/templates/schemas";
import { CustomComboBox } from "../custom-combobox";
import { useUpdateTemplate } from "@/features/templates/hooks/use-update-template";
import { Template } from "@/types";
import { useState } from "react";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";
import { useRouter } from "next/navigation";

export const UpdateTemplateForm = ({template}: {template: Template}) => {
  const {getDoctorById, doctors} = useDoctorsStore();
  const {getMaterialById, materials} = useMaterialsStore();
  const router = useRouter();

  const { mutate, isPending, error } = useUpdateTemplate();
    
  const onCancel = () => {
    router.back();
  }

  const form = useForm<z.infer<typeof createTemplateSchema>>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: template.name,
      material: template.material || undefined,
      doctor: template.doctor || undefined,
      shade: template.shade || undefined,
      note: template.note || undefined
    },
  });

  const onSubmit = (values: z.infer<typeof createTemplateSchema>) => {
    mutate(
      { data: values, id: template.$id },
      {
        onSuccess: () => {
          router.replace('/dashboard/templates')
        },
      }
    );
  };

  const handleDoctorSelection = (currentValue: string) => {
    const docDoctor = doctors?.find((doc) => doc.name === currentValue);
    form.setValue("doctor", docDoctor?.$id);
  };
  const handleMaterialSelection = (currentValue: string) => {
    const docMaterial = materials?.find((doc) => doc.$id === currentValue);
    form.setValue("material", docMaterial?.$id);
  };

  return (
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex">
          <CardTitle className="text-xl font-bold">
            Update template details
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
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <CustomComboBox
                            label="material"
                            property="$id"
                            variant={"secondary"}
                            values={materials || []}
                            value={field.value}
                            action={handleMaterialSelection}
                            previewValue={`${getMaterialById(field.value || "")?.name} (${
                                getMaterialById(field.value || "")?.price
                              })`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <FormControl>
                          <CustomComboBox
                            label="doctor"
                            // property="$id"
                            variant={"secondary"}
                            values={doctors || []}
                            value={field.value}
                            action={handleDoctorSelection}
                            previewValue={`${
                              getDoctorById(field.value || "")?.name
                            }`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter note" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shade</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter shade" />
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
                  Save
                </Button>
              </div>
            </form>
            {error && (
              <div className="text-red-500 text-xs mt-4">{error.message}</div>
            )}
          </Form>
        </CardContent>
      </Card>
  );
};
