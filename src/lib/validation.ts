import { z } from "zod"

export const softwareInfoSchema = z.object({
  name: z.string().min(2, "Project name is too short"),
  version: z.string().min(1, "Version is required"),
  stack: z.string().min(2, "Enter at least one tech stack"),
  developer: z.string().min(2, "Developer name is required"),
  description: z.string().optional()
})

export type SoftwareInfo = z.infer<typeof softwareInfoSchema>
