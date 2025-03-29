import { ResponsiveModal } from "../responsive-modal";
import { Modals, useModalStore } from "@/store/modal-store";
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
import { useCreateMaterial } from "@/features/materials/hooks/use-create-material";
import { createMaterialSchema } from "@/features/materials/schemas";

export const MaterialCreateModal = () => {
  const { isModalOpen, closeModal } = useModalStore();

  const {mutate, isPending, error} = useCreateMaterial();

  const onCancel = () => {
    closeModal(Modals.CREATE_MATERIAL_MODAL);
  };

  const form = useForm<z.infer<typeof createMaterialSchema>>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      name: "",
      price: 0,
    }
  });

  const onSubmit = (values: z.infer<typeof createMaterialSchema>) => {
    mutate({data: values}, {
      onSuccess: () => {
        closeModal(Modals.CREATE_MATERIAL_MODAL);
      }
    });
  };

  return (
    <ResponsiveModal
      open={isModalOpen(Modals.CREATE_MATERIAL_MODAL)}
      onOpenChange={() => closeModal(Modals.CREATE_MATERIAL_MODAL)}
    >
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex px-7">
          <CardTitle className="text-xl font-bold">
            Create new material
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
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
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
