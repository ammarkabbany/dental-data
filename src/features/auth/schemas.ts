import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Invalid password"),
})

export const registerSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters long"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})