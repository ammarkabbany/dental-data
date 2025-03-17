import {z} from 'zod'

export const updateDoctorSchema = z.object({
  name: z.string().min(4, "Name needs to be at least 4 characters long"),
  due: z.number().min(0, "Please enter a positive number"),
  totalCases: z.number().min(0, "Please enter a positive number"),
})

export const createDoctorSchema = z.object({
  name: z.string().min(4, "Name needs to be at least 4 characters long"),
  due: z.number().min(0, "Please enter a positive number"),
  totalCases: z.number().min(0, "Please enter a positive number"),
})