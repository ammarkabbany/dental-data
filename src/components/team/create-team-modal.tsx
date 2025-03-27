"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Users, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveModalWithTrigger } from "../responsive-modal";
import { DialogTrigger } from "../ui/dialog";
import { UserAvatar } from "../user-avatar";
import { z } from "zod";
import { useCreateTeam } from "@/features/team/hooks/use-create-team";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useAuth } from "@clerk/nextjs";
import { useTeam } from "@/providers/team-provider";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(4, {
    message: "Team name must be at least 4 characters.",
  }),
});

export default function TeamCreationModal({children, open}: {children: React.ReactNode, open: boolean}) {
  const [isOpen, setIsOpen] = useState<boolean>(open);
  const [currentStep, setCurrentStep] = useState(0);
  const { userId } = useAuth();

  const steps = [
    { id: "team", label: "Create Team", icon: Users },
    { id: "invite", label: "Progress", icon: Loader },
    { id: "complete", label: "Complete", icon: Check },
  ];

  const handleNext = () => {
    if (!form.formState.isValid) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const { mutate, isPending, isSuccess } = useCreateTeam();
  // const redirectUrl = useRedirectUrl();
  // const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleBack = () => {
    if (isSuccess || isPending) return;
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!userId) {
        return;
      }
      setCurrentStep(1);
      mutate(
        { name: values.name, userId },
        {
          onSuccess: () => {
            setCurrentStep(2);
            queryClient.invalidateQueries({queryKey: ['team']})
          },
        }
      );
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  }

  return (
    <ResponsiveModalWithTrigger
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      }
    >
      {/* <DialogHeader className="p-4">
        <DialogTitle>
          Create Your Team
        </DialogTitle>
      </DialogHeader> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence>
            <motion.div
              className="rounded-xl shadow-xl overflow-hidden w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0">
                {/* Stepper */}
                <div className="flex mb-8">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex-1">
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <motion.div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                              index <= currentStep
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-gray-300 text-gray-400"
                            }`}
                            animate={{
                              backgroundColor:
                                index <= currentStep ? "#2563eb" : "#ffffff",
                              borderColor:
                                index <= currentStep ? "#2563eb" : "#d1d5db",
                              color:
                                index <= currentStep ? "#ffffff" : "#9ca3af",
                            }}
                          >
                            {index < currentStep ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <step.icon className="w-5 h-5" />
                            )}
                          </motion.div>
                          {index < steps.length - 1 && (
                            <div
                              className={`absolute top-5 w-full h-0.5 left-full -translate-y-1/2 ${
                                index < currentStep
                                  ? "bg-blue-600"
                                  : "bg-gray-300"
                              }`}
                              style={{ width: "calc(100% - 2.5rem)" }}
                            >
                              <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: "0%" }}
                                animate={{
                                  width: index < currentStep ? "100%" : "0%",
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>
                        <span className="text-xs mt-2 font-medium">
                          {step.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[250px]"
                  >
                    {/*  */}
                    {currentStep === 0 && (
                      <div className="space-y-12">
                        <div>
                          <h3 className="text-lg font-medium">
                            Team Information
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Create a new team to enroll in free trial.
                          </p>
                        </div>
                        <div className="">
                          <div className="flex items-center justify-center">
                            <UserAvatar
                              className="my-2 size-14"
                              name={form.watch().name || "T"}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Awesome Team"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="py-20 gap-y-2 flex flex-col justify-center items-center">
                        <Loader className="animate-spin duration-1000" />
                        Creating Team...
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                          <Check className="w-8 h-8 text-green-600 dark:text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium">Team Created!</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Your team has been created successfully.
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg w-full mt-2 text-left">
                          <div className="flex items-center gap-x-4">
                            <UserAvatar
                              className="my-2 size-14"
                              name={form.getValues().name || "T"}
                            />
                            {form.getValues().name}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isPending || isSuccess}
                    className={currentStep === 0 ? "opacity-0" : ""}
                    type="button"
                  >
                    Back
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={currentStep === 0 ? undefined : handleNext}
                      disabled={!form.formState.isValid || isPending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      type={currentStep === 0 ? "submit" : "button"}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isPending}
                      type="button"
                      asChild
                    >
                      <Link aria-disabled={isPending} href={"/dashboard"}>Go to Dashboard</Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </Form>
    </ResponsiveModalWithTrigger>
  );
}
