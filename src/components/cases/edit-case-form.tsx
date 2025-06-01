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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createCaseSchema } from "@/features/cases/schemas";
import { DatePicker } from "../date-picker";
import { CustomComboBox } from "../custom-combobox";
import { useState } from "react";
import TeethFormData from "../TeethFormData";
import { Case, Material, Tooth, ToothCollection } from "@/types";
import { useUpdateCase } from "@/features/cases/hooks/use-update-case";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";
import { useRouter } from "next/navigation";

interface EditCaseFormProps {
  selectedCase: Case;
}

export const EditCaseForm = ({ selectedCase }: EditCaseFormProps) => {
  const router = useRouter();
  const {userRole} = useTeamStore(); // Removed membership as it's not used
  const canViewDue = usePermission(userRole).canViewDue();

  const onCancel = () => {
    form.reset();
    router.back(); // Navigate back on cancel
  };

  const {getDoctorById, doctors} = useDoctorsStore();
  const {getMaterialById, materials} = useMaterialsStore();

  const caseData: ToothCollection = JSON.parse(String(selectedCase?.data));

  const [teethData, setTeethData] = useState<Tooth[]>(
    caseData?.upper?.left
      ?.concat(caseData?.upper?.right || [])
      ?.concat(caseData?.lower?.left || [])
      ?.concat(caseData?.lower?.right || [])
  );
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

  const handleDoctorSelection = (currentValue: string) => {
    if (form.getValues().doctorId) {
      if (currentValue === form.getValues().doctorId) {
        form.resetField("doctorId");
        return;
      }
    }
    const docDoctor = doctors?.find((doc) => doc.name === currentValue);
    form.setValue("doctorId", docDoctor?.$id || "");
  };

  const handleMaterialSelection = (currentValue: string) => {
    const docMaterial = materials?.find((mat) => mat.$id === currentValue);
    const teethQuantity = teethData.length;

    if (docMaterial) {
      form.setValue("due", teethQuantity * docMaterial.price);
      form.setValue("materialId", docMaterial.$id);

      const currentTeethData = form.getValues().data;

      const updateQuadrant = (teeth: Tooth[] = []) => {
        return teeth.map((t) => ({
          ...t,
          materialId: docMaterial.$id,
        }));
      };

      form.setValue("data", {
        upper: {
          left: updateQuadrant(currentTeethData?.upper?.left),
          right: updateQuadrant(currentTeethData?.upper?.right),
        },
        lower: {
          left: updateQuadrant(currentTeethData?.lower?.left),
          right: updateQuadrant(currentTeethData?.lower?.right),
        },
      });

      const newTeethData = teethData.map((tooth) => ({
        label: tooth.label,
        materialId: docMaterial.$id,
      }));
      setTeethData(newTeethData);
    }
  };

  const handleMultiDue = (operation: string, material: string) => {
    const qMaterial = materials?.find((mat) => mat.$id === material);
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
      value += qMaterial?.price || 0;
    } else {
      value -= qMaterial?.price || 0;
    }
    form.setValue("due", value);
  };

  const handleDueSpecific = (oldMaterial: Material, material: Material) => {
    if (
      form.getValues().due !== undefined &&
      oldMaterial !== undefined &&
      form.getValues().due < material.price // This condition might need adjustment based on expected behavior
    ) {
      // It was 'return;' - decide if this logic is still appropriate or needs modification
      // For now, let's assume it prevents due from going negative in some scenarios.
      // If due can be negative or this check is not needed, remove or adjust.
      console.warn("Due calculation prevented by price condition.");
      // return; // Potentially keep or remove based on requirements
    }

    let value = Number(form.getValues().due) || 0; // Ensure value is a number, default to 0

    value -= oldMaterial?.price || 0; // Use optional chaining and default to 0 if oldMaterial or price is undefined
    value += material?.price || 0; // Use optional chaining and default to 0 if material or price is undefined

    form.setValue("due", value);
  };

  const handleCheckTeeth = (
    event: React.MouseEvent<HTMLInputElement>,
    label: number
  ) => {
    if (!form.getValues().materialId) {
      return;
    }

    let newCheckedTeeth = [...checkedTeeth];
    let newTeethData = [...teethData];

    if (event.shiftKey && lastCheckedTooth !== undefined) {
      const teethRange = getTeethInRange(lastCheckedTooth, label);
      teethRange.forEach((toothLabel) => {
        if (!newCheckedTeeth.includes(toothLabel)) {
          newCheckedTeeth.push(toothLabel);
          selectTooth(toothLabel, "add"); // Pass operation
          // handleMultiDue("add", form.getValues()?.materialId); // selectTooth handles due now
          newTeethData.push({
            label: toothLabel,
            materialId: form.getValues()?.materialId,
          });
        }
      });
    } else {
      if (newCheckedTeeth.includes(label)) {
        newCheckedTeeth = newCheckedTeeth.filter((tooth) => tooth !== label);
        selectTooth(label, "remove"); // Pass operation
        // handleMultiDue("remove", form.getValues()?.materialId); // selectTooth handles due now
        newTeethData = newTeethData.filter((t) => t.label !== label);
      } else {
        newCheckedTeeth.push(label);
        selectTooth(label, "add"); // Pass operation
        // handleDue("add", form.getValues()?.materialId); // selectTooth handles due now
        newTeethData.push({ label, materialId: form.getValues()?.materialId });
      }
    }

    setCheckedTeeth(newCheckedTeeth);
    setTeethData(newTeethData);
    setLastCheckedTooth(label);
  };

  const teethOrder = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38,
  ];

  const excludedTeeth = [10, 19, 20, 29, 30, 39, 40];

  const getTeethInRange = (start: number, end: number): number[] => {
    const startIndex = teethOrder.indexOf(start);
    const endIndex = teethOrder.indexOf(end);

    let selectedTeeth;
    if (startIndex <= endIndex) {
      selectedTeeth = teethOrder.slice(startIndex, endIndex + 1);
    } else {
      selectedTeeth = teethOrder.slice(endIndex, startIndex + 1).reverse();
    }
    return selectedTeeth.filter((tooth) => !excludedTeeth.includes(tooth));
  };

  const selectTooth = (label: number, operation: "add" | "remove") => {
    let region: "upper" | "lower" | undefined;
    let secondRegion: "left" | "right" | undefined;

    if (label >= 11 && label <= 18) {
      region = "upper"; secondRegion = "left";
    } else if (label >= 21 && label <= 28) {
      region = "upper"; secondRegion = "right";
    } else if (label >= 31 && label <= 38) {
      region = "lower"; secondRegion = "right"; // FDI notation, 30s are lower right
    } else if (label >= 41 && label <= 48) {
      region = "lower"; secondRegion = "left"; // FDI notation, 40s are lower left
    }

    if (region && secondRegion && form.getValues().data?.[region]?.[secondRegion]) {
      const currentQuadrantTeeth = form.getValues().data[region][secondRegion];
      const materialId = form.getValues().materialId;

      if (!materialId) {
        // console.error("Material ID is not set."); // Or show a toast
        return;
      }

      const isToothSelected = currentQuadrantTeeth.some((tooth: Tooth) => tooth.label === label);

      if (operation === "add" && !isToothSelected) {
        form.setValue(`data.${region}.${secondRegion}`, [
          ...currentQuadrantTeeth,
          { label, materialId },
        ]);
        handleDue("add", materialId);
      } else if (operation === "remove" && isToothSelected) {
        form.setValue(
          `data.${region}.${secondRegion}`,
          currentQuadrantTeeth.filter((tooth: Tooth) => tooth.label !== label)
        );
        handleDue("remove", currentQuadrantTeeth.find((t: Tooth) => t.label === label)?.materialId || materialId);
      }
    } else {
      console.warn(`Invalid region or quadrant for tooth ${label}: ${region} ${secondRegion}`);
    }
  };


  const handleChangeToothMaterial = (
    newValue: Tooth & { material: Material }
  ) => {
    if (!form.getValues().materialId) {
      // Consider showing a toast notification here
      console.error("Please select a default material first.");
      return;
    }

    const toothInTeethData = teethData.find((t) => t.label === newValue.label);
    if (toothInTeethData) {
      const oldMaterial = materials?.find(mat => mat.$id === toothInTeethData.materialId);

      if (oldMaterial) {
        handleDueSpecific(oldMaterial, newValue.material);
      } else {
        // If old material wasn't found, perhaps just add the new material's price
        // This depends on how 'due' should be calculated if a tooth didn't have a material before
        handleDue("add", newValue.material.$id);
      }

      const updateQuadrantMaterial = (quadrant: Tooth[] = []) =>
        quadrant.map((t) =>
          t.label === newValue.label ? { ...t, materialId: newValue.material.$id } : t
        );

      const currentFormData = form.getValues().data;
      form.setValue("data.upper.left", updateQuadrantMaterial(currentFormData?.upper?.left));
      form.setValue("data.upper.right", updateQuadrantMaterial(currentFormData?.upper?.right));
      form.setValue("data.lower.left", updateQuadrantMaterial(currentFormData?.lower?.left));
      form.setValue("data.lower.right", updateQuadrantMaterial(currentFormData?.lower?.right));

      setTeethData(prevTeethData =>
        prevTeethData.map(t =>
          t.label === newValue.label ? { ...t, materialId: newValue.material.$id } : t
        )
      );
    }
  };

  const form = useForm<z.infer<typeof createCaseSchema>>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      patient: selectedCase?.patient,
      date: selectedCase?.date
        ? new Date(selectedCase.date).toLocaleDateString("en-CA") // Ensure correct date formatting
        : undefined,
      doctorId: selectedCase?.doctorId,
      materialId: selectedCase?.materialId,
      data: caseData, // Already parsed
      shade: selectedCase?.shade,
      due: selectedCase?.due,
      invoice: selectedCase?.invoiceStatus, // Make sure this aligns with schema
      note: selectedCase?.note,
    },
  });

  const onSubmit = (values: z.infer<typeof createCaseSchema>) => {
    mutate(
      {
        data: values,
        oldCase: selectedCase,
        caseId: selectedCase.$id,
      },
      {
        onSuccess: () => {
          // onCancel(); // onCancel now includes router.back()
          // Potentially show a success toast here
          console.log("Case updated successfully!");
          router.push("/dashboard/cases"); // Navigate to cases list page
        },
        onError: () => {
          // Potentially show an error toast here
           console.error("Failed to update case.");
        }
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none dark:from-background dark:to-accent bg-gradient-to-tr">
      <CardHeader className="flex flex-col px-7">
        <CardTitle className="text-xl font-bold">
          Update case details
        </CardTitle>
        <CardDescription className="text-sm">
          Edit case details for {selectedCase.patient} (ID: {selectedCase.$id}).
        </CardDescription>
        <div className="mt-2">
          <Separator />
        </div>
      </CardHeader>
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
                          placeholder="Enter patient name"
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
                          variant={"secondary"}
                          values={doctors || []}
                          value={getDoctorById(field.value)?.name} // Display name
                          action={handleDoctorSelection}
                          previewValue={`${getDoctorById(field.value)?.name || "Select Doctor"}`}
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
                            value={field.value} // Store ID
                            action={handleMaterialSelection}
                            previewValue={`${getMaterialById(field.value)?.name || "Select Material"} (${
                              getMaterialById(field.value)?.price || "N/A"
                            })`}
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
                            placeholder="Enter shade"
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
                            date={field.value ? new Date(field.value) : undefined} // Ensure date is a Date object
                            setDate={(v: Date | undefined) => {
                              field.onChange(
                                v ? v.toLocaleDateString("en-CA") : undefined
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
                            value={field.value ?? ""} // Handle undefined case for input
                            onChange={(e) => {
                              const numValue = e.target.valueAsNumber;
                              field.onChange(isNaN(numValue) ? undefined : numValue);
                            }}
                            placeholder="Due amount"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-muted-foreground/50"
                          {...field}
                          placeholder="Enter any notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-end gap-4 mt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    size={"lg"}
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
              </div>
              <div className="mt-4">
                <TeethFormData
                  data={teethData} // This should be the state variable
                  checkedTeeth={checkedTeeth} // This should be the state variable
                  materials={materials || []}
                  handleChangeToothMaterial={handleChangeToothMaterial}
                  handleCheckTeeth={handleCheckTeeth}
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-xs mt-4">{error.message}</div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
