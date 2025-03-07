import { z } from 'zod'
import meritFlawDataJson from '../sources/v5MeritsAndFlaws.json'
import { Kindred } from './Kindred'
import { v5BackgroundLevel } from './V5Backgrounds'
import { sphereOfInfluenceSchema } from './V5Spheres'
import { getNumberBelow } from '../../../utils/getNumberBelow'
import { v5BloodPotencyLevel } from './V5BloodPotency'
import { faCircleHalfStroke, faCircleNodes, faLightbulb, faLink, faPersonRunning, faPoo, faTeeth, faUserLock, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

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
    z.literal("mythical"),
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
    note: z.string(),
    userNote: z.string(),
    sphere: sphereOfInfluenceSchema.optional(),
})

export type V5MeritFlawRef = z.infer<typeof v5MeritFlawRefSchema>

export const v5MeritFlawRefs: V5MeritFlawRef[] = meritFlawDataJson.map((mf) => ({
    id: `merit_${mf.name}`,
    name: mf.name,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
    note: "",
    userNote: "",
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

export const getMeritIcon = (name: MeritFlawCategory) => {
    if (name === "bonding") {
        return faLink
    }
    if (name === "connection") {
        return faCircleNodes
    }
    if (name === "feeding") {
        return faTeeth
    }
    if (name === "ghoul") {
        return faUserLock
    }
    if (name === "mythical") {
        return faWandMagicSparkles
    }
    if (name === "physical") {
        return faPersonRunning
    }
    if (name === "psychological") {
        return faLightbulb
    }
    if (name === "thin-blood") {
        return faCircleHalfStroke
    }
    else {
        return faPoo
    }
}

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
    userNote: "",
}

export const v5GetMeritByName = (name: string) => {
    let meritInfo = meritFlawData.find((merit) => {
        return merit.name.trim() === name.trim();
    });
    if (!meritInfo) {
        return {
            id: "",
            name: "",
            type: "flaw",
            category: "feeding",
            cost: [0],
            description: "",
            source: ""
        }
    } else {
        return meritInfo
    }
}

export const v5MeritLevel = (v5MeritFlawRef: V5MeritFlawRef) => {
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
    let { experiencePoints, creationPoints, freebiePoints } = v5MeritFlawRef;

    let meritInfo = v5GetMeritByName(v5MeritFlawRef.name)

    if (meritInfo.type === "flaw") {
        if (experiencePoints === 0) {
            let level = creationPoints + freebiePoints;
            let xpNeeded = level > 0 ? 3 : meritInfo.cost[0] * 3;
            totalXpNeeded = xpNeeded;
            pastXpNeeded.push(totalXpNeeded);
            return { level, totalXpNeeded, pastXpNeeded };
        } else {
            let level = creationPoints + freebiePoints;
            let xpNeeded = 3;
            totalXpNeeded += xpNeeded;
            pastXpNeeded.push(totalXpNeeded);
            while (experiencePoints >= xpNeeded) {
                level--;
                experiencePoints -= xpNeeded;
                xpNeeded = 3;
                totalXpNeeded += xpNeeded;
                pastXpNeeded.push(totalXpNeeded);
            }
            return { level, totalXpNeeded, pastXpNeeded };
        }
    }
    else {
        if (experiencePoints === 0) {
            let level = creationPoints + freebiePoints;
            let xpNeeded = level > 0 ? 3 : meritInfo.cost[0] * 3;
            totalXpNeeded = xpNeeded;
            pastXpNeeded.push(totalXpNeeded);
            return { level, totalXpNeeded, pastXpNeeded };
        } else {
            let level = creationPoints + freebiePoints;
            let xpNeeded = 3;
            totalXpNeeded += xpNeeded;
            pastXpNeeded.push(totalXpNeeded);
            while (experiencePoints >= xpNeeded) {
                level++;
                experiencePoints -= xpNeeded;
                xpNeeded = 3;
                totalXpNeeded += xpNeeded;
                pastXpNeeded.push(totalXpNeeded);
            }
            return { level, totalXpNeeded, pastXpNeeded };
        }
    }
}

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints" | "note" | "userNote";
export const handleMeritFlawChange = (
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
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

export const v5HandleXpMeritChange = (
    character: any,
    setKindred: (kindred: Kindred) => void,
    meritFlaw: V5MeritFlawRef,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = v5MeritLevel(meritFlaw)

    let xp = value > meritFlaw.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

    handleMeritFlawChange(character, setKindred, meritFlaw, "experiencePoints", xp)
    return xp
}

export const v5HandleMeritRemove = (kindred: Kindred, setKindred: Function, meritRef: V5MeritFlawRef) => {
    const { meritsFlaws } = kindred;
    const meritsToRemove = [] as V5MeritFlawRef[];
    meritsToRemove.push(meritRef)

    const updatedMerits = meritsFlaws.filter((m) => !meritsToRemove.includes(m));
    setKindred({ ...kindred, meritsFlaws: updatedMerits })
}

export const v5MeritFlawFilter = (kindred: Kindred) => {
    let filteredData = meritFlawData;

    if (kindred.clan === "Ravnos" || kindred.backgrounds.some((bRef) => bRef.name === "Haven")) {
        filteredData = filteredData.filter((merit) => merit.name !== "No Haven");
    }

    if (kindred.clan === "Ventrue" || v5BloodPotencyLevel(kindred).level >= 3) {
        filteredData = filteredData.filter((merit) => merit.name !== "Iron Gullet" && merit.name !== "Farmer");
    }

    if (kindred.clan === "Ventrue") {
        filteredData = filteredData.filter((merit) => merit.name !== "Prey Exclusion");
    }

    if (kindred.generation > 9) {
        filteredData = filteredData.filter((merit) => merit.name !== "Archaic");
    }

    const maxMask = kindred.backgrounds
        .filter((bRef) => bRef.name === "Mask")
        .reduce((max, bRef) => Math.max(v5BackgroundLevel(bRef).level, max), 0);

    if (maxMask > 0) {
        filteredData = filteredData.filter((merit) => merit.name !== "Known Corpse" && merit.name !== "Known Blankbody");
    }

    if (maxMask < 2) {
        filteredData = filteredData.filter((merit) => merit.name !== "Cobbler");
    }

    if (maxMask < 3) {
        filteredData = filteredData.filter((merit) => merit.name !== "Zeroed");
    }

    if (kindred.backgrounds.some((bRef) => bRef.name === "Resources")) {
        filteredData = filteredData.filter((merit) => merit.name !== "Poor");
    }

    if (kindred.backgrounds.some((bRef) => bRef.name === "Herd")) {
        filteredData = filteredData.filter((merit) => merit.name !== "Obvious Predator");
    }

    return filteredData;
};