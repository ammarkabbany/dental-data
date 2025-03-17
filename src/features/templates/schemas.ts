import {z} from 'zod'

// export const updateMaterialSchema = z.object({
//   name: z.string().min(4, "Name needs to be at least 4 characters long"),
//   price: z.number().min(0, "Please enter a positive number"),
// })

export const createTemplateSchema = z.object({
  name: z.string().min(4, "Name cannot be shortar than 4 characters").max(32, "Max name length is 32").optional(),
  doctor: z.string().optional(),
  material: z.string().optional(),
  shade: z.string().optional(),
  note: z.string().optional(),
})