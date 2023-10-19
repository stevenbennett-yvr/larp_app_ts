import { z } from 'zod';

export const touchstoneSchema = z.object({
    name: z.string(),
    description: z.string(),
    conviction: z.string(),
    pic: z.string(),
})
export type Touchstone = z.infer<typeof touchstoneSchema>