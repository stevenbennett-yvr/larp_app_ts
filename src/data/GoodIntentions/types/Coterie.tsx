import { z } from "zod";
import { sphereOfInfluenceSchema, v5BackgroundRefSchema } from "./V5Backgrounds";
import { v5MeritFlawRefSchema } from "./V5MeritsOrFlaws";

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

export const v5CoterieSchema = z.object({
    id: z.string(),
    name: z.string(),
    members: z.string().array(),
    territory: v5TerritoryBenefitSchema.array(),
    backgrounds: v5BackgroundRefSchema.array(),
    meritsFlaws: v5MeritFlawRefSchema.array(),
})

export type Coterie = z.infer<typeof v5CoterieSchema>


