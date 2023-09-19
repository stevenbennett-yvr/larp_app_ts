import { z } from 'zod'

import { Kindred } from './Kindred'
import backgroundDataJson from '../sources/v5Backgrounds.json'

export const sphereOfInfluenceSchema = z.union([
    z.literal("church"),
    z.literal("finance"),
    z.literal("health"),
    z.literal("high society"),
    z.literal("industry"),
    z.literal("legal"),
    z.literal("media"),
    z.literal("occult"),
    z.literal("police"),
    z.literal("politics"),
    z.literal("service industry"),
    z.literal("street"),
    z.literal("transportation"),
    z.literal("underworld"),
    z.literal("university"),
])

export const v5AdvantageRefSchema = z.object({
    name: z.string(),
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
})

export type V5AdvantageRef = z.infer<typeof v5AdvantageRefSchema>

export const v5BackgroundRefSchema = z.object({
    id: z.string(),
    name: z.string(),
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
    note: z.string(),
    advantages: z.array(v5AdvantageRefSchema),
    sphere: z.optional(sphereOfInfluenceSchema),
})

export type V5BackgroundRef = z.infer<typeof v5BackgroundRefSchema>

/// build out refs from json here....

///

export type requirementFunctions = (kindred: Kindred) => boolean

const requirementSchema = z.object({
    requirement: z.string(),
    level: z.number().min(1).int(),
})
export type Requirement = z.infer<typeof requirementSchema>


export const v5AdvantageSchema = z.object({
    name: z.string(),
    description: z.string(),
    cost: z.array(z.number()),
    type: z.string()
});

export type V5Advantage = z.infer<typeof v5AdvantageSchema>

export const v5BackgroundSchema = z.object({
    class: z.string(),
    name: z.string(),
    id: z.string(),
    description: z.string(),
    source: z.string(),
    advantages: z.array(v5AdvantageSchema).optional(),
});

export type V5Background = z.infer<typeof v5BackgroundSchema>;

/// build out backgrounds from json here...
export const backgroundData: V5Background[] = backgroundDataJson.map((background) => ({
    ...background,
    id: `background_${background.name}`
}))
///

export const v5GetBackgroundByName = (name: string): V5Background => {
    let backgroundInfo = backgroundData.find((b) => b.name === name)
    if (!backgroundInfo) {
        return {
            class: "",
            name: "",
            id: "",
            description: "",
            source: "",
            advantages: []
        }
    } else {
        return backgroundInfo
    }
}

export const v5GetAdvantageByName = (name: string): V5Advantage => {
    // Iterate through each background to find the matching advantage
    for (const background of backgroundData) {
        const matchingAdvantage = background.advantages?.find(
            (advantage) => advantage.name === name
        );
        
        if (matchingAdvantage) {
            return matchingAdvantage; // Return the matching advantage info
        }
    }

    // If no matching advantage is found, return undefined (or handle the case as needed)
    return {
        name: "",
        description: "",
        cost: [0],
        type: "advantage",
    };
};

export const v5BackgroundLevel = (v5BackgroundRef: V5BackgroundRef) => {
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
    let { experiencePoints, creationPoints, freebiePoints } = v5BackgroundRef;

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


export const v5AdvantageLevel = ( AdvantageRef: V5AdvantageRef) => {
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
    let { experiencePoints, creationPoints, freebiePoints } = AdvantageRef;

    const advantageInfo = v5GetAdvantageByName(AdvantageRef.name)
    const { cost } = advantageInfo

    let level = Math.max(creationPoints + freebiePoints)

    if (!creationPoints && !freebiePoints) {
        totalXpNeeded += cost[0] * 3;
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
