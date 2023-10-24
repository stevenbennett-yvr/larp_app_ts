import { z } from "zod"


export const roleSchema =  {
    id: z.string(),
    uid: z.string(),
    title: z.string(),
    email: z.string(), // use Email as Outgoing one-to-one ID for now.
}