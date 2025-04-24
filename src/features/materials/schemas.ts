import {z} from 'zod'

export const updateMaterialSchema = z.object({
  name: z.string().min(4, "Name needs to be at least 4 characters long").max(20, "Name needs to be at most 20 characters long"),
  price: z.number().min(0, "Please enter a positive number"),
})

export const createMaterialSchema = z.object({
  name: z.string().min(4, "Name needs to be at least 4 characters long").max(20, "Name needs to be at most 20 characters long"),
  price: z.number().min(0, "Please enter a positive number"),
})