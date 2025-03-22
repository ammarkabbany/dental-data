"use client";
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
import { useTeam } from "@/providers/team-provider";
import { createCaseSchema } from "@/features/cases/schemas";
import { DatePicker } from "../date-picker";
import { CustomComboBox } from "../custom-combobox";
import { useState } from "react";
import TeethFormData from "../TeethFormData";
import { Case, Material, Tooth, ToothCollection } from "@/types";
import { ResponsiveModalWithTrigger } from "../responsive-modal";
import { DialogTrigger } from "../ui/dialog";
import { useUpdateCase } from "@/features/cases/hooks/use-update-case";
import { usePermission } from "@/hooks/use-permissions";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";

export const EditCaseModal = ({selectedCase}: {selectedCase: Case}) => {
  const { currentTeam, userRole } = useTeam();
  const canViewDue = usePermission(userRole).canViewDue()
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  const onCancel = () => {
    setDialogOpen(false);
    form.reset();
  }

  const {doctors} = useDoctorsStore();
  const {materials} = useMaterialsStore();
  const getMatrialById = (id: string) => {
    return materials?.find((material) => material.$id === id);
  };
  const getDoctorById = (id: string) => {
    return doctors?.find((doctor) => doctor.$id === id);
  };

  const caseData: ToothCollection = JSON.parse(String(selectedCase?.teethData))

  const [teethData, setTeethData] = useState<Tooth[]>(caseData?.upper?.left?.concat(caseData?.upper?.right || [])?.concat(
    caseData?.lower?.left || []
  )?.concat(caseData?.lower?.right || []));
  const labels = [
    ...(caseData?.upper?.left?.map((t) => t.label) || []),
    ...(caseData?.upper?.right?.map((t) => t.label) || []),
    ...(caseData?.lower?.left?.map((t) => t.label) || []),
    ...(caseData?.lower?.right?.map((t) => t.label) || []),
  ];
  const [checkedTeeth, setCheckedTeeth] = useState<number[]>(labels);
  const [lastCheckedTooth, setLastCheckedTooth] = useState<
    number | undefined
  >();

  const { mutate, isPending, error } = useUpdateCase();

  const handleMultiDue = (operation: string, material: string) => {
    const qMaterial = materials?.find((mat) => mat.$id === material);
    // handle due
    if (!qMaterial || qMaterial === undefined) return;
    if (operation === "add") {
      if (form.getValues()?.due === undefined) {
        form.setValue("due", qMaterial?.price || 0);
      } else {
        form.setValue(
          "due",
          (form.getValues().due || 0) + qMaterial?.price || 0
        );
      }
    } else {
      if (form.getValues()?.due === undefined) {
        return;
      }
      form.setValue("due", (form.getValues().due || 0) - qMaterial.price || 0);
    }
  };

  const handleDue = (operation: string, material: string) => {
    let value = form.getValues()?.due || 0;
    const qMaterial = materials?.find((mat) => mat.$id === material);

    if (operation === "add") {
      value += qMaterial?.price || 0; // Add price if material is found
    } else {
      value -= qMaterial?.price || 0; // Subtract price if material is found
    }
    form.setValue("due", value);
  };

  const handleDueSpecific = (oldMaterial: Material, material: Material) => {
    if (
      form.getValues().due !== undefined &&
      oldMaterial !== undefined &&
      form.getValues().due < material.price
    ) {
      return;
    }

    let value = Number(form.getValues().due);

    let s = (form.getValues().due = value -= oldMaterial.price);
    form.setValue("due", (s += material.price));
  };

  const handleCheckTeeth = (
    event: React.MouseEvent<HTMLInputElement>,
    label: number
  ) => {
    if (!form.getValues().materialId) {
      return;
    }

    let newCheckedTeeth = [...checkedTeeth];
    let newTeethData = [...teethData]; // Create a copy of current teethData

    // Handle shift-click: Select all teeth between the last checked and current one
    if (event.shiftKey && lastCheckedTooth !== undefined) {
      const teethRange = getTeethInRange(lastCheckedTooth, label);
      teethRange.forEach((toothLabel) => {
        if (!newCheckedTeeth.includes(toothLabel)) {
          newCheckedTeeth.push(toothLabel);
          selectTooth(toothLabel);
          handleMultiDue("add", form.getValues()?.materialId); // Update due for added teeth
          newTeethData.push({
            label: toothLabel,
            materialId: form.getValues()?.materialId,
          });

          // Classify the tooth into the correct quadrant
          // const quadrant = classifyToothQuadrant(toothLabel);
          // console.log(`Tooth ${toothLabel} classified in: ${quadrant}`);
        }
      });
    } else {
      // Normal single click selection
      if (newCheckedTeeth.includes(label)) {
        newCheckedTeeth = newCheckedTeeth.filter((tooth) => tooth !== label); // Deselect
        selectTooth(label);
        handleMultiDue("remove", form.getValues()?.materialId); // Handle removal of due
        newTeethData = newTeethData.filter((t) => t.label !== label);
      } else {
        newCheckedTeeth.push(label); // Select
        selectTooth(label);
        handleDue("add", form.getValues()?.materialId); // Handle addition of due
        newTeethData.push({ label, materialId: form.getValues()?.materialId });

        // Classify the tooth into the correct quadrant
        // const quadrant = classifyToothQuadrant(label);
      }
    }

    setCheckedTeeth(newCheckedTeeth);
    setTeethData(newTeethData); // Update teethData
    setLastCheckedTooth(label); // Update the last checked tooth
  };

  const teethOrder = [
    // Upper left quadrant
    18, 17, 16, 15, 14, 13, 12, 11,
    // Upper right quadrant
    21, 22, 23, 24, 25, 26, 27, 28,
    // Lower right quadrant
    48, 47, 46, 45, 44, 43, 42, 41,
    // Lower left quadrant
    31, 32, 33, 34, 35, 36, 37, 38,
  ];

  const excludedTeeth = [10, 19, 20, 29, 30, 39, 40];

  // Function to get all teeth between two labels
  const getTeethInRange = (start: number, end: number): number[] => {
    const startIndex = teethOrder.indexOf(start);
    const endIndex = teethOrder.indexOf(end);

    // Determine if selection is forward or backward
    const isForwardSelection = startIndex <= endIndex;

    // Get the selected range
    let selectedTeeth;
    if (isForwardSelection) {
      selectedTeeth = teethOrder.slice(startIndex, endIndex + 1);
    } else {
      selectedTeeth = teethOrder.slice(endIndex, startIndex + 1).reverse();
    }

    // Filter out excluded teeth (e.g., 10, 19, etc.)
    return selectedTeeth.filter((tooth) => !excludedTeeth.includes(tooth));
  };

  // Define the possible regions for teeth
  const selectTooth = (label: number) => {
    let region: "upper" | "lower" | undefined;
    let secondRegion: "left" | "right" | undefined;

    // Assign the correct region based on the tooth label
    if (label >= 11 && label <= 18) {
      // Upper left (11 to 18)
      region = "upper";
      secondRegion = "left";
    } else if (label >= 21 && label <= 28) {
      // Upper right (21 to 28)
      region = "upper";
      secondRegion = "right";
    } else if (label >= 31 && label <= 38) {
      // Lower **right** (31 to 38)
      region = "lower";
      secondRegion = "right";
    } else if (label >= 41 && label <= 48) {
      // Lower **left** (41 to 48)
      region = "lower";
      secondRegion = "left";
    }

    // Ensure that valid regions have been assigned
    if (
      region &&
      secondRegion &&
      form.getValues().teethData?.[region]?.[secondRegion]
    ) {
      const teeth = form.getValues().teethData?.[region]?.[secondRegion];

      // Check if the tooth is already selected
      const isToothSelected = (teeth ?? []).some(
        (tooth: Tooth) => tooth.label === label
      );

      const data = form.getValues().teethData;

      if (isToothSelected) {
        // If already selected, remove the tooth
        form.setValue(
          `teethData.${region}.${secondRegion}`,
          teeth.filter((tooth: Tooth) => tooth.label !== label)
        );

        // Update the teeth data by removing the tooth
        setTeethData((prevTeethData) =>
          prevTeethData.filter((t) => t.label !== label)
        );
      } else {
        // If not already selected, add the tooth
        form.setValue(`teethData.${region}.${secondRegion}`, [
          ...data[region][secondRegion],
          { label, materialId: form.getValues()?.materialId },
        ]);

        // Add the tooth to the teeth data
        setTeethData((prevTeethData) => [
          ...prevTeethData,
          { label, materialId: form.getValues()?.materialId },
        ]);
      }
    } else {
      console.log(
        `Invalid region or region not found: ${region} ${secondRegion}`
      );
    }
  };

  const handleChangeToothMaterial = (
    newValue: Tooth & { material: Material }
  ) => {
    // if formData.material is empty then toast error and return
    if (!form.getValues().materialId) {
      // toast({
      //   variant: "destructive",
      //   title: "Error:",
      //   description: "Please select a default material",
      // });
      return;
    }

    const tooth = teethData.find((t) => t.label === newValue.label);
    if (tooth) {
      const toothMaterial = materials?.find(
        (mat) => mat.$id === tooth.materialId
      );
      handleDueSpecific(toothMaterial ?? newValue.material, newValue.material);
      const data = form.getValues().teethData;
      form.setValue(
        "teethData.upper.left",
        data?.upper?.left?.map((t) =>
          t.label === newValue.label
            ? { ...t, material: newValue.material.$id }
            : t
        )
      );
      form.setValue(
        "teethData.upper.right",
        data?.upper?.right?.map((t) =>
          t.label === newValue.label
            ? { ...t, material: newValue.material.$id }
            : t
        )
      );
      form.setValue(
        "teethData.lower.left",
        data?.lower?.left?.map((t) =>
          t.label === newValue.label
            ? { ...t, material: newValue.material.$id }
            : t
        )
      );
      form.setValue(
        "teethData.lower.right",
        data?.lower?.right?.map((t) =>
          t.label === newValue.label
            ? { ...t, material: newValue.material.$id }
            : t
        )
      );
      setTeethData([
        ...teethData.filter((t) => t.label !== newValue.label),
        { ...newValue, materialId: newValue.material.$id },
      ]);
    }
  };

  const form = useForm<z.infer<typeof createCaseSchema>>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      patient: selectedCase?.patient,
      date: selectedCase?.date ? new Date(selectedCase.date).toLocaleDateString("en-CA") : undefined,
      doctorId: selectedCase?.doctorId,
      materialId: selectedCase?.materialId,
      teethData: caseData,
      shade: selectedCase?.shade,
      due: selectedCase?.due,
      invoice: selectedCase?.invoiceStatus,
      note: selectedCase?.note,
    },
  });

  const onSubmit = (values: z.infer<typeof createCaseSchema>) => {
    mutate({ data: values, caseId: selectedCase.$id, teamId: currentTeam?.$id }, {
      onSuccess: () => {
        onCancel();
      }
    });
  };

  return (
    <ResponsiveModalWithTrigger
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (open) {
          setDialogOpen(open);
        } else {
          // reset form on close
          onCancel();
        }
      }}
      className="md:min-w-3xl lg:min-w-4xl w-full overflow-x-hidden"
      trigger={
        <DialogTrigger asChild>
          <Button onMouseDown={(e) => e.stopPropagation()} variant="ghost" className="w-full justify-start">
            Edit
          </Button>
        </DialogTrigger>
      }
    >
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex px-7">
          <CardTitle className="text-xl font-bold">
            Update case details
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="!flex !flex-col gap-y-6">
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <FormControl>
                          <Input
                            className="placeholder:text-muted-foreground/50"
                            {...field}
                            placeholder="-"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <FormControl>
                          <CustomComboBox
                            label="doctor"
                            property="$id"
                            variant={"secondary"}
                            values={doctors || []}
                            value={field.value}
                            action={field.onChange}
                            previewValue={`${getDoctorById(field.value)?.name}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="materialId"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Material</FormLabel>
                          <FormControl>
                            <CustomComboBox
                              label="material"
                              property="$id"
                              variant={"secondary"}
                              values={materials || []}
                              value={field.value}
                              action={field.onChange}
                              previewValue={`${
                                getMatrialById(field.value)?.name
                              } ${getMatrialById(field.value)?.price}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shade"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Shade</FormLabel>
                          <FormControl>
                            <Input
                              className="placeholder:text-muted-foreground/50"
                              {...field}
                              placeholder="-"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel htmlFor="case-date-picker">Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              {...field}
                              date={field.value}
                              setDate={(v: Date) => {
                                field.onChange(
                                  new Date(v).toLocaleDateString("en-CA")
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
                    <FormField
                      control={form.control}
                      name="due"
                      render={({ field }) => (
                        <FormItem hidden={!canViewDue}>
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
                  </div>
                </div>
                <div className="mt-4">
                  <TeethFormData
                    data={[]}
                    checkedTeeth={checkedTeeth}
                    materials={materials || []}
                    handleChangeToothMaterial={handleChangeToothMaterial}
                    handleCheckTeeth={handleCheckTeeth}
                  />
                </div>
              </div>
              {/* <Separator className="mt-2" /> */}
              <div className="flex items-center justify-between gap-4 mt-4">
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
                  Save Changes
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
};
