import { z } from "zod";
import { v5MeritFlawRefSchema } from "./V5MeritsOrFlaws";
import { sphereOfInfluenceSchema } from "./V5Spheres";

export const v5BenefitNameSchema = z.union([
    z.literal("comfort"),
    z.literal("connections"),
    z.literal("deterrents"),
    z.literal("")
])

export const v5TerritoryBenefitSchema = z.object({
    name: v5BenefitNameSchema,
    sphere: sphereOfInfluenceSchema.optional(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
})

export const coterieSchema = z.object({
    id: z.string(),
    territoryContributions: v5TerritoryBenefitSchema.array(),
})

export const domainSchema = z.object({
    location: z.string(),
    description: z.string()
})

export const v5CoterieSchema = z.object({
    id: z.string(),
    vssId: z.string(),
    name: z.string(),
    concept: z.string(),
    goals: z.string(),
    members: z.string().array(),
    meritsFlaws: v5MeritFlawRefSchema.array(),
    domain: domainSchema,
})

export type Coterie = z.infer<typeof v5CoterieSchema>

export const getEmptyCoterie = (): Coterie => {
    return {
        id: "",
        vssId: "",
        name: "",
        concept: "",
        goals: "",
        members: [],
        meritsFlaws: [],
        domain: {
            location: "",
            description: "",
        }
    }
}

