import { z } from 'zod'
import meritFlawDataJson from '../sources/v5MeritsAndFlaws.json'
import { Kindred, v5BloodPotencyLevel } from './Kindred'
import { V5BackgroundRef, v5BackgroundLevel } from './V5Backgrounds'

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

export const emptyMeritFlaw: V5MeritFlawRef = {
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

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints" | "note";
export const handleMeritFlawChange = (
    kindred: Kindred,
    setKindred: Function,
    meritFlaw: V5MeritFlawRef,
    type: VariableKeys,
    newPoints: number | string,
): void => {
    const existingMerit = kindred.meritsFlaws.find((mf) => mf.id === meritFlaw.id)
    if (existingMerit) {
        if (newPoints === 0 && type !== "experiencePoints") {
            const updatedMerits = kindred.meritsFlaws.filter((mf) => mf.id !== meritFlaw.id);
            setKindred({ ...kindred, meritsFlaws: updatedMerits });
        } else {
            const updatedMerits = kindred.meritsFlaws.map((mf) =>
                mf.id === meritFlaw.id ? { ...mf, [type]: newPoints } : mf
            );
            setKindred({ ...kindred, meritsFlaws: updatedMerits });
        }
    } else {
        setKindred({
            ...kindred,
            meritsFlaws: [...kindred.meritsFlaws, { ...meritFlaw, [type]: newPoints }]
        })
    }
}

export const v5MeritFlawFilter = (kindred: Kindred) => {
    let filteredData = meritFlawData;

    if (kindred.clan === "Ravnos" || kindred.backgrounds.find((bRef:V5BackgroundRef) => bRef.name === "Haven")) {
        filteredData = filteredData.filter(merit => merit.name !== "No Haven");
    }
    if (kindred.clan === "Ventrue" || v5BloodPotencyLevel(kindred).level >= 3){
        filteredData = filteredData.filter(merit => merit.name !== "Iron Gullet");
        filteredData = filteredData.filter(merit => merit.name !== "Farmer");
    }
    if (kindred.clan === "Ventrue"){
        filteredData = filteredData.filter(merit => merit.name !== "Prey Exclusion");
    }
    if (kindred.generation > 9) {
        filteredData = filteredData.filter(merit => merit.name !== "Archaic");
    }
    let maxMask = 0
    kindred.backgrounds.forEach((bRef) => {
        if (bRef.name === "Mask") {
            maxMask = Math.max(v5BackgroundLevel(bRef).level, maxMask)
        }
    })
    if (maxMask > 0) {
        filteredData = filteredData.filter(merit => merit.name !== "Known Corpse");
    }
    if (maxMask > 0) {
        filteredData = filteredData.filter(merit => merit.name !== "Known Blankbody");
    }
    if (maxMask < 2) {
        filteredData = filteredData.filter(merit => merit.name !== "Cobbler");
    }
    if (maxMask < 3) {
        filteredData = filteredData.filter(merit => merit.name !== "Zeroed");
    }
    if (kindred.backgrounds.find((bRef:V5BackgroundRef) => bRef.name === "Resources")) {
        filteredData = filteredData.filter(merit => merit.name !== "Poor");
    }
    if (kindred.backgrounds.find((bRef:V5BackgroundRef) => bRef.name === "Herd")) {
        filteredData = filteredData.filter(merit => merit.name !== "Obvious Predator");
    }

    return filteredData;
}