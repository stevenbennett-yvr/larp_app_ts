import { z } from "zod";
import { v5skillsKeySchema } from "./V5Skills";

export const specialtySchema = z.object({
    skill: v5skillsKeySchema,
    name: z.string(),
})
export type Specialty = z.infer<typeof specialtySchema>