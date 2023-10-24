import { z } from "zod";
import domains from "../source/domains.json"

const linkSchema = z.object({
    facebook: z.string().optional(),
    discord: z.string().optional(),
    website: z.string().optional(),
})

const domainSchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    active: z.boolean(),
    staff: z.string().array(),
    links: linkSchema.optional(),
})

export type Domain = z.infer<typeof domainSchema>

export const Domains: Domain[] = domains.map((domain) => ({
    id: domain.id,
    name: domain.name,
    location: domain.location,
    active: domain.active,
    staff: [domain.coordinator],
    links: domain.links ? linkSchema.parse(domain.links) : undefined,
}))
