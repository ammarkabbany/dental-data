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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateCase } from "@/features/cases/hooks/use-create-case";
import { createCaseSchema } from "@/features/cases/schemas";
import { DatePicker } from "../date-picker";
import { CustomComboBox } from "../custom-combobox";
import { useGetDoctors } from "@/features/doctors/hooks/use-get-doctors";
import { useGetMaterials } from "@/features/materials/hooks/use-get-materials";
import { useEffect, useState } from "react";
import TeethFormData from "../TeethFormData";
import { Material, Template, Tooth } from "@/types";
import { useRouter } from "next/navigation";
import TemplatesSidebar from "./templates-sidebar";
import { usePermission } from "@/hooks/use-permissions";
import { useTemplateParams } from "@/features/templates/hooks/use-template-params";
import { useTemplatesStore } from "@/store/templates-store";
import useTeamStore from "@/store/team-store";
import { AlertCircle } from "lucide-react"; // Add this import

export const CreateCaseForm = () => {
  const {membership, userRole} = useTeamStore();
  const canViewDue = usePermission(userRole).canViewDue();
  const router = useRouter();

  const templateParams = useTemplateParams();

  const { data: doctors } = useGetDoctors();
  const { data: materials } = useGetMaterials();
  const { addRecentTemplate, applyTemplate: storeCurrentTemplate, currentTemplate } =
    useTemplatesStore();
  const getMaterialById = (id: string) => {
    return materials?.find((material) => material.$id === id);
  };
  const getDoctorById = (id: string) => {
    return doctors?.find((doctor) => doctor.$id === id);
  };

  const [showSidebar, setShowSidebar] = useState(false);
  const [teethData, setTeethData] = useState<Tooth[]>([]);
  const [checkedTeeth, setCheckedTeeth] = useState<number[]>([]);
  const [lastCheckedTooth, setLastCheckedTooth] = useState<
    number | undefined
  >();

  const { mutate, isPending, error } = useCreateCase();

  const onCancel = () => {
    router.back();
  };

  const handleMaterialSelection = (currentValue: string) => {
    const docMaterial = materials?.find((mat) => mat.$id === currentValue);
    const teethQuantity = teethData.length;

    // Update the form values
    if (docMaterial) {
      // Update the due amount based on selected teeth quantity and material price
      form.setValue("due", teethQuantity * docMaterial.price);
      form.setValue("materialId", docMaterial.$id);

      // Update teeth data in the form
      const currentTeethData = form.getValues().data;

      // Update material for all teeth in each quadrant
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

      // Update local teeth data state
      const newTeethData = teethData.map((tooth) => ({
        label: tooth.label,
        materialId: docMaterial.$id,
      }));
      setTeethData(newTeethData);
    }
  };

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
      form.getValues().data?.[region]?.[secondRegion]
    ) {
      const teeth = form.getValues().data?.[region]?.[secondRegion];

      // Check if the tooth is already selected
      const isToothSelected = (teeth ?? []).some(
        (tooth: Tooth) => tooth.label === label
      );

      const data = form.getValues().data;

      if (isToothSelected) {
        // If already selected, remove the tooth
        form.setValue(
          `data.${region}.${secondRegion}`,
          teeth.filter((tooth: Tooth) => tooth.label !== label)
        );

        // Update the teeth data by removing the tooth
        setTeethData((prevTeethData) =>
          prevTeethData.filter((t) => t.label !== label)
        );
      } else {
        // If not already selected, add the tooth
        form.setValue(`data.${region}.${secondRegion}`, [
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
      const data = form.getValues().data;
      form.setValue(
        "data.upper.left",
        data?.upper?.left?.map((t) =>
          t.label === newValue.label
            ? { ...t, material: newValue.material.$id }
            : t
        )
      );
      form.setValue(
        "data.upper.right",
        data?.upper?.right?.map((t) =>
          t.label === newValue.label
            ? { ...t, material: newValue.material.$id }
            : t
        )
      );
      form.setValue(
        "data.lower.left",
        data?.lower?.left?.map((t) =>
          t.label === newValue.label
            ? { ...t, material: newValue.material.$id }
            : t
        )
      );
      form.setValue(
        "data.lower.right",
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
      patient: "",
      date: new Date().toLocaleDateString("en-CA"),
      doctorId: templateParams.doctorId || "",
      materialId: templateParams.materialId || "",
      data: {
        upper: {
          left: [],
          right: [],
        },
        lower: {
          left: [],
          right: [],
        },
      },
      shade: templateParams.shade || "",
      due: 0,
      invoice: false,
      note: templateParams.note || "",
    },
  });

  const onSubmit = (values: z.infer<typeof createCaseSchema>) => {
    if (!membership) {
      return;
    }
    mutate(
      { data: values, teamId: membership.teamId, userId: membership.userId },
      {
        onSuccess: () => {
          if (templateParams.templateId) {
            addRecentTemplate(templateParams.templateId);
          }
          if (currentTemplate) {
            addRecentTemplate(currentTemplate.$id);
          }
          form.resetField('patient')
          form.resetField('shade')
          form.resetField('due')
          form.resetField('invoice')
          form.resetField('note')
          handleResetTeeth();
        },
      }
    );
  };

  const handleResetTeeth = () => {
    form.resetField("data");
    form.resetField('due')
    setTeethData([]);
    setLastCheckedTooth(undefined);
    setCheckedTeeth([]);
  }

  const applyTemplate = (template: Template | undefined) => {
    if (!template) return;
    form.reset();
    if (template.doctor) form.setValue("doctorId", template.doctor);
    if (template.material) form.setValue("materialId", template.material);
    if (template.shade) form.setValue("shade", template.shade);
    if (template.note) form.setValue("note", template.note);
    storeCurrentTemplate(template);
  };

  return (
    <div className="flex flex-col 2xl:flex-row gap-4">
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full mb-4"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? "Hide Templates" : "Show Templates"}
        </Button>
        {showSidebar && <TemplatesSidebar applyTemplate={applyTemplate} />}
      </div>
      <div className="hidden lg:block">
        <TemplatesSidebar applyTemplate={applyTemplate} />
      </div>
      <div className="flex-1 px-2 3xl:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 lg:gap-8">
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-card/50 p-4 lg:p-6 rounded-lg border shadow-sm space-y-4 lg:space-y-6">
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Patient name" />
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
                              action={handleMaterialSelection}
                              previewValue={`${getMaterialById(field.value)?.name} ${
                                getMaterialById(field.value)?.price
                              }`}
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
                            placeholder="note"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col md:flex-row items-center justify-end gap-4">
                    <Button
                      variant="secondary"
                      type="button"
                      className="w-full sm:w-auto"
                      onClick={onCancel}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isPending}
                    >
                      {isPending ? "Creating..." : "Create Case"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-card/50 p-4 border rounded-lg relative min-w-[360px]">
                {!form.getValues().materialId && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center flex-col gap-2 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">Please select a material</p>
                  </div>
                )}
                <TeethFormData
                  data={teethData}
                  checkedTeeth={checkedTeeth}
                  materials={materials || []}
                  handleChangeToothMaterial={handleChangeToothMaterial}
                  handleCheckTeeth={handleCheckTeeth}
                  resetTeeth={handleResetTeeth}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
