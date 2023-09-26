import { z } from 'zod'
import meritFlawDataJson from '../sources/v5MeritsAndFlaws.json'

export const meritFlawTypeSchema = z.union([
    z.literal('merit'),
    z.literal("flaw")
])

export type meritFlawType = z.infer<typeof meritFlawTypeSchema>

export const meritFlawCategorySchema = z.union([
    z.literal("bonding"),
    z.literal("connection"),
    z.literal("feeding"),
    z.literal("ghoul"),
    z.literal("mystical"),
    z.literal("physical"),
    z.literal("psychological"),
    z.literal("thin-blood"),
])

export type MeritFlawCategory = z.infer<typeof meritFlawCategorySchema>

export const v5MeritFlawRefSchema = z.object({
    id: z.string(),
    name: z.string(),
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
    note: z.string()
})

export type V5MeritFlawRef = z.infer<typeof v5MeritFlawRefSchema>

export const v5MeritFlawRefs: V5MeritFlawRef[] = meritFlawDataJson.map((mf) => ({
    id: `merit_${mf.name}`,
    name: mf.name,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
    note: ""
}))

export const v5MeritFlawSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: meritFlawTypeSchema,
    category: meritFlawCategorySchema,
    cost: z.array(z.number()),
    description: z.string(),
    source: z.string(),
})

export type V5MeritFlaw = z.infer<typeof v5MeritFlawSchema>

export const meritFlawData: V5MeritFlaw[] = meritFlawDataJson.map((mf) => ({
    id: `meritFlaw_${mf.name}`,
    name: mf.name,
    type: mf.type as meritFlawType,
    category: mf.category as MeritFlawCategory,
    cost: mf.cost,
    description: mf.description,
    source: mf.source
}))

export const emptyMeritFlaw:V5MeritFlawRef = {
    id: "",
    name: "",
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
    note: "",
}

export const v5MeritLevel = (v5MeritFlawRef: V5MeritFlawRef) => {
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
    let { experiencePoints, creationPoints, freebiePoints } = v5MeritFlawRef;

    let level = Math.max(creationPoints + freebiePoints)

    if (!creationPoints && !freebiePoints) {
        totalXpNeeded += 3;
        pastXpNeeded.push(totalXpNeeded);
    }
    let xpNeeded = (level + 1) * 3;
    totalXpNeeded += xpNeeded;
    pastXpNeeded.push(totalXpNeeded);

    if (experiencePoints < xpNeeded && creationPoints + freebiePoints > 0) {
        level = creationPoints + freebiePoints; // Set level to 0 for the initial purchase
        return { level, totalXpNeeded, pastXpNeeded };
    }

    // Check if xp is less than the first xpNeeded value
    if (experiencePoints < xpNeeded) {
        level = 1; // Set level to 0 for the initial purchase
        return { level, totalXpNeeded, pastXpNeeded };
    }

    while (experiencePoints >= xpNeeded) {
        level++;
        experiencePoints -= xpNeeded;
        xpNeeded = (level + 1) * 3;
        totalXpNeeded += xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
    }

    return { level, totalXpNeeded, pastXpNeeded };
}