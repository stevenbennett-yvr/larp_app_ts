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
    z.literal("")
])
export type V5SphereKey = z.infer<typeof sphereOfInfluenceSchema>

export const SphereSelectData = [
    "church",
    "finance",
    "health",
    "high society",
    "industry",
    "legal",
    "media",
    "occult",
    "police",
    "politics",
    "service industry",
    "street",
    "transportation",
    "underworld",
    "university",
];


export const v5AdvantageRefSchema = z.object({
    name: z.string(),
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
})

export type V5AdvantageRef = z.infer<typeof v5AdvantageRefSchema>

export const emptyAdvantage: V5AdvantageRef = {
    name: "",
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
}

export const v5BackgroundRefSchema = z.object({
    id: z.string(),
    name: z.string(),
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
    note: z.string(),
    advantages: z.array(v5AdvantageRefSchema),
    sphere: z.array(sphereOfInfluenceSchema).optional(),
    freeAdvantage: z.array(z.string()).optional(),
})
export type V5BackgroundRef = z.infer<typeof v5BackgroundRefSchema>

export const emptyBackground: V5BackgroundRef = {
    id: "",
    name: "",
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
    note: "",
    advantages: [],
}

/// build out refs from json here....
export const v5BackgroundRefs: V5BackgroundRef[] = backgroundDataJson.map((b) => ({
    id: `background_${b.name}`,
    name: b.name,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
    note: "",
    advantages: []
}))
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
    summary: z.string(),
    source: z.string(),
    advantages: z.array(v5AdvantageSchema).optional(),
    icon: z.string(),
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
            summary: "",
            source: "",
            advantages: [],
            icon: ""
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


export const v5AdvantageLevel = (AdvantageRef: V5AdvantageRef) => {
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

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints" | "sphere" | "note" | "freeAdvantage";

export const handleBackgroundChange = (
    kindred: Kindred,
    setKindred: Function,
    background: V5BackgroundRef,
    type: VariableKeys,
    newPoints: number | string | string[],
) => {
    const existingBackground = kindred.backgrounds.find((b) => b.id === background.id);
    if (existingBackground) {
        const updatedBackgrounds = kindred.backgrounds.map((b) =>
            b.id === background.id ? { ...b, [type]: newPoints } : b
        );
        setKindred({ ...kindred, backgrounds: updatedBackgrounds });
    } else {
        setKindred({
            ...kindred,
            backgrounds: [...kindred.backgrounds, { ...background, [type]: newPoints }],
        });
    }
};

export const handleBackgroundRemove = (
    kindred: Kindred,
    setKindred: Function,
    backgroundRef: V5BackgroundRef
) => {
    const backgroundsToRemove = [] as V5BackgroundRef[];
    backgroundsToRemove.push(backgroundRef)
    const updatedBackgrounds = kindred.backgrounds.filter((b) => !backgroundsToRemove.includes(b))
    setKindred({ ...kindred, backgrounds: updatedBackgrounds });
}

export const handleAdvantageChange = (
    kindred: Kindred,
    setKindred: Function,
    bRef: V5BackgroundRef,
    aRef: V5AdvantageRef,
    type: VariableKeys,
    newPoints: number | string,
) => {
    const existingAdvantage = bRef.advantages.find((a) => a.name === aRef.name);
    if (!existingAdvantage) {
        // If the background doesn't exist, create a new one with the provided advantage
        bRef.advantages.push({ ...aRef, [type]: newPoints });
    }
    const updatedBackgrounds = kindred.backgrounds.map((background) => {
        if (background.id === bRef.id) {
            // Update the existing background with the new advantages
            return {
                ...background,
                advantages: background.advantages.map((advantage) =>
                    advantage.name === aRef.name ? { ...advantage, [type]: newPoints } : advantage
                ),
            };
        }
        return background;
    });

    setKindred({ ...kindred, backgrounds: updatedBackgrounds });

};
