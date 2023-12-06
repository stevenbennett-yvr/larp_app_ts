import { z } from "zod"

/* 
Venue Roles:
    Member
    Election Officer
    Complaints Reviewer
    Storyteller(s)
    Storyteller Support Officer

Global Roles:
    President
    Vice-President
    Secretary
    Treasurer
    Creative Director

*/

export const roleSchema =  z.object({
    id: z.string(),
    title: z.string(),
})

export type Role = z.infer<typeof roleSchema>

export const Roles: Role[] = [
    {
        id: "good.intentions",
        title: "Chronicle Storyteller",
    },
    {
        id: "vst.masq.000",
        title: "Venue Storyteller",
    },
    {
        id: "vst.masq.001",
        title: "Venue Storyteller",
    },
    {
        id: "vst.masq.015",
        title: "Venue Storyteller",
    },
    {
        id: "vst.masq.024",
        title: "Venue Storyteller",
    },
    {
        id: "vst.masq.102",
        title: "Venue Storyteller",
    },
    {
        id: "vst.masq.108",
        title: "Venue Storyteller",
    },
    {
        id: "vst.masq.121",
        title: "Venue Storyteller",
    },
    {
        id: "vst.tattered.001",
        title: "Venue Storyteller",
    },
]