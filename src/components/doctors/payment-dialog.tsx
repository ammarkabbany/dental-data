"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Doctor } from "@/types";
import { useState } from "react";
import { formatCurrency } from "@/lib/format-utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useCreatePayment } from "@/features/doctors/hooks/use-create-payment";
import { DatePicker } from "../date-picker";
import { ResponsiveModalWithTrigger } from "../responsive-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "../ui/dialog";
import { useAppwriteTeam } from "@/features/team/hooks/use-appwrite-team";

interface PaymentDialogProps {
  doctor: Doctor;
  children: React.ReactNode;
}

export function PaymentDialog({
  doctor,
  children
}: PaymentDialogProps) {
  const { mutate, isPending, error } = useCreatePayment();
  const {data: appwriteTeam} = useAppwriteTeam();

  const [open, setOpen] = useState(false);

  const onCancel = () => {
    setOpen(false);
    form.reset();
  };

  const createPaymentSchema = z.object({
    amount: z
      .number()
      .min(1, "Amount must be greater than 0")
      .max(doctor.due, "Amount must be less than or equal to due amount")
      .nonnegative()
      .transform((v) => v || 0),
    date: z.date(),
    doctorId: z.string(),
  });

  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      doctorId: doctor.$id,
    },
  });

  const onSubmit = (values: z.infer<typeof createPaymentSchema>) => {
    mutate(
      {
        data: {
          amount: values.amount,
          date: values.date.toISOString(),
          doctorId: values.doctorId,
        },
      },
      {
        onSuccess: () => {
          onCancel();
          form.reset();
        },
      }
    );
  };

  return (
    <ResponsiveModalWithTrigger trigger={<DialogTrigger asChild>
      {children}
    </DialogTrigger>} open={open} onOpenChange={(open) => {
        if (open) {
          setOpen(open);
        } else {
          onCancel();
        }
      }}>
      <Card className="w-full h-full border-none shadow-none bg-gradient-to-t from-card to-secondary/40">
        <CardHeader className="flex px-7">
          <CardTitle className="text-xl font-bold">Add Payment</CardTitle>
          <CardDescription>
            Current due amount: {formatCurrency(doctor.due, appwriteTeam?.prefs.currency, 0)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                          placeholder="Enter payment amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="case-date-picker">Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          {...field}
                          date={field.value}
                          customFormat={"PPP"}
                          setDate={(v: Date) => {
                            field.onChange(
                              new Date(v)
                            );
                          }}
                          mode="single"
                          id="case-date-picker"
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
                  Add Payment
                </Button>
              </div>
            </form>
            {error && (
              <div className="text-red-500 text-xs mt-4">{error.message}</div>
            )}
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModalWithTrigger>
  );
}

// <DatePicker date={date} setDate={setDate} mode="single">
//   <Button
//     variant={"outline"}
//     disabled={isPending}
//     className="justify-start text-left font-normal"
//   >
//     <CalendarIcon className="mr-2 h-4 w-4" />
//     {format(date, "PPP")}
//   </Button>
// </DatePicker>
