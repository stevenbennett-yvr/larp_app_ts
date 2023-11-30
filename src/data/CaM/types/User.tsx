import { z } from "zod";

export const userSchema = z.object({
    name: z.string(),
    domain: z.string(),
    email: z.string(),
    uid: z.string(),
    mc: z.number(),
    roles: z.string().array(),
})

export type User = z.infer<typeof userSchema>

export const getEmptyUser = (): User => {
    return {
        name: "",
        domain: "",
        email: "",
        uid: "",
        mc: 0,
        roles: [],
    }
}