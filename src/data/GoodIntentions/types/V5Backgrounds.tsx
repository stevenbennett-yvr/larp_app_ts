import { z } from 'zod'

import { Kindred } from './Kindred'
import backgroundDataJson from '../sources/v5Backgrounds.json'
import { getNumberBelow } from '../../../utils/getNumberBelow'

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
    havenBool: z.boolean().optional()
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

    if (experiencePoints === 0) {
        let level = creationPoints + freebiePoints;
        let xpNeeded = 3;
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

export const v5AdvantageLevel = (AdvantageRef: V5AdvantageRef) => {
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
    let { experiencePoints, creationPoints, freebiePoints, havenBool } = AdvantageRef;

    if (experiencePoints === 0) {
        let level = creationPoints + freebiePoints + (havenBool? 1:0);
        let xpNeeded = 3;
        totalXpNeeded = xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
        return { level, totalXpNeeded, pastXpNeeded };
    } else {
        let level = creationPoints + freebiePoints + (havenBool? 1:0);
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

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints" | "sphere" | "note" | "havenBool";

export const handleBackgroundChange = (
    kindred: Kindred,
    setKindred: Function,
    background: V5BackgroundRef,
    type: VariableKeys,
    newPoints: number | string ,
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

export const v5HandleXpBackgroundChange = (
    character: any,
    setCharacter: Function,
    background: V5BackgroundRef,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = v5BackgroundLevel(background)

    let xp = value > background.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

    handleBackgroundChange(character, setCharacter, background, "experiencePoints", xp)
    return xp
}

export const v5FindMaxBackground = (
    kindred: Kindred,
    background: V5BackgroundRef,
) => {
    const resourcesRef = kindred.backgrounds.find((entry) => entry.name === "Resources");
    const resourceLevel = resourcesRef ? v5BackgroundLevel(resourcesRef).level : 0;
    const havenMax = resourceLevel === 3 ? 3 : resourceLevel === 1 ? 2 : 1;

    const { experiencePoints } = background;
    const { level } = v5BackgroundLevel(background);

    let max = undefined;
    if (background.name === "Haven" ? havenMax : level === 3) {
        max = experiencePoints;
    }
    return max;
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
    newPoints: number | string | boolean,
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

export const v5HandleXpAdvantageChange = (
    character: any,
    setCharacter: Function,
    background: V5BackgroundRef,
    advantage: V5AdvantageRef,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = v5AdvantageLevel(advantage)

    let xp = value > advantage.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

    handleAdvantageChange(character, setCharacter, background, advantage, "experiencePoints", xp)
    return xp
}


/* 

// This doesn't work, found a workaround.

export const v5FindMaxAdvantage = (
    advantage: V5AdvantageRef,
    advantageInfo: V5Advantage,
    background: V5BackgroundRef
) => {
    const { experiencePoints } = background;
    const { level } = v5AdvantageLevel(advantage);
    let maxCost = advantageInfo.cost[advantageInfo.cost.length - 1]

    let max = undefined;
    if (level === maxCost) {
        max = experiencePoints;
    }
    console.log(level)
    return max;
} */

export const filterSelectData = (
    kindred: Kindred,
    backgroundData: V5Background[]
) => {
    const userBackgrounds = kindred.backgrounds; // Replace with the actual user's backgrounds
    const backgroundsToExclude = ["Contacts", "Allies", "Haven", "Mask"];
    const hasObviousPredator = kindred.meritsFlaws.some(entry => entry.name === "Obvious Predator");

    return backgroundData.filter((background) => {
        const backgroundName = background.name;

        // Check if there is no object in userBackgrounds with a matching name
        const isNotInUserBackgrounds = !userBackgrounds.some((bg) => bg.name === backgroundName);

        // Check if the backgroundName is in the exceptions list
        const isException = backgroundsToExclude.includes(backgroundName);

        // Check if the backgroundName is "Herd" and the user has "Obvious Predator"
        const isHerdAndObviousPredator = backgroundName === "Herd" && hasObviousPredator;

        // Keep the background if it's not in userBackgrounds, is an exception, or is "Herd" with "Obvious Predator"
        return isNotInUserBackgrounds || isException || isHerdAndObviousPredator;
    });
}


export const advantageStep = (advantage: V5AdvantageRef, background: V5Background): number => {
    if (!background.advantages) { return 1 }
    const advantageInfo = background.advantages.find(entry => entry.name === advantage.name)
    let minCost = advantageInfo?.cost[0];
    let maxCost = advantageInfo?.cost[advantageInfo?.cost.length - 1]
    if (!minCost || !maxCost) { return 0 }
    if (minCost === maxCost) {
        return minCost;
    } else {
        return 1;
    }
}

export const kindredBackgrounds = (kindred: Kindred) => {
    const uniqueBackgrounds = new Map();

    const allBackgrounds:V5BackgroundRef[] = [];
    const highestLevelHerdResources:V5BackgroundRef[] = [];
    
    kindred.backgrounds
      .filter((bg, index, array) => {
        // Keep the first occurrence of each background based on 'id'
        return array.findIndex((b) => b.id === bg.id) === index;
      })
      .forEach((bg) => {
        const name = bg.name;
        const level = v5BackgroundLevel(bg).level;
    
        if (!(name === "Herd" || name === "Resources")) {
          allBackgrounds.push(bg);
        } else {
          const existingEntry = uniqueBackgrounds.get(name);
          if (!existingEntry || level > v5BackgroundLevel(existingEntry).level) {
            uniqueBackgrounds.set(name, bg);
          }
        }
      });
    
    uniqueBackgrounds.forEach((bg) => {
      if (bg.name === "Herd" || bg.name === "Resources") {
        highestLevelHerdResources.push(bg);
      }
    });
    
    return [...highestLevelHerdResources, ...allBackgrounds].sort((a, b) => a.name.localeCompare(b.name));
}