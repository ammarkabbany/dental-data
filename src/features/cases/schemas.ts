import { ToothCollection } from '@/types'
import {z} from 'zod'

// export const updateMaterialSchema = z.object({
//   name: z.string().min(4, "Name needs to be at least 4 characters long"),
//   price: z.number().min(0, "Please enter a positive number"),
// })

export const createCaseSchema = z.object({
  patient: z.string().max(48, "Max name length is 48").optional(),
  date: z.string(),
  doctorId: z.string().min(1, "Required"),
  materialId: z.string().min(1, "Required"),
  teethData: z.custom<ToothCollection>(),
  shade: z.string().optional(),
  due: z.number().min(0, "Due can't be negative"),
  invoice: z.boolean().optional(),
  note: z.string().optional(),
})