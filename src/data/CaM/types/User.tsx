import { z } from "zod";

export const roleSchema = z.object({
    title: z.string(),
    domain: z.string(),
    venue: z.string(),
})

export const userSchema = z.object({
    name: z.string(),
    domain: z.string(),
    email: z.string(),
    uid: z.string(),
    mc: z.number(),
    roles: roleSchema.array().optional(),
})

export type User = z.infer<typeof userSchema>

export const getEmptyUser = (): User => {
    return {
        name: "",
        domain: "",
        email: "",
        uid: "",
        mc: 0,
    }
}