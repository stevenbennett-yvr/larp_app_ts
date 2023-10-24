import { z } from "zod"

/* 

Domain Roles:
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

export const roleSchema =  {
    id: z.string(),
    uid: z.string(),
    title: z.string(),
    email: z.string(), // use Email as Outgoing one-to-one ID for now.
}