import { ToothCollection } from "@/types";
import { z } from "zod";

// export const updateMaterialSchema = z.object({
//   name: z.string().min(4, "Name needs to be at least 4 characters long"),
//   price: z.number().min(0, "Please enter a positive number"),
// })

export const createCaseSchema = z.object({
  patient: z.string().max(32, "Max patient name length is 32").optional(),
  date: z.string(),
  doctorId: z.string().min(1, "Required"),
  materialId: z.string().min(1, "Required"),
  data: z.custom<ToothCollection>().refine(
    (data) => {
      return (
        data.lower.left.length ||
        data.lower.right.length ||
        data.upper.left.length ||
        data.upper.right.length
      );
    },
    {
      message: "At least one tooth must be selected.",
    }
  ),
  shade: z.string().max(6, "Max shade length is 6").optional(),
  due: z.number().min(0, "Due can't be negative"),
  invoice: z.boolean().optional(),
  note: z.string().max(50, "Max note length is 50").optional(),
});
