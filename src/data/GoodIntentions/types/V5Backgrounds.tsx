import { number, z } from 'zod'

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
    havenPoints: z.number(),
    loresheetFreebiePoints: z.number(),
})

export type V5AdvantageRef = z.infer<typeof v5AdvantageRefSchema>

export const emptyAdvantage: V5AdvantageRef = {
    name: "",
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
    havenPoints: 0,
    loresheetFreebiePoints: 0,
}

export const v5BackgroundRefSchema = z.object({
    id: z.string(),
    name: z.string(),
    creationPoints: z.number(),
    predatorTypeFreebiePoints: z.number(),
    loresheetFreebiePoints: number(),
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
    predatorTypeFreebiePoints: 0,
    loresheetFreebiePoints: 0,
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
    predatorTypeFreebiePoints: 0,
    loresheetFreebiePoints: 0,
    note: "",
    advantages: []
}))
///

function combineAdvantages(...arrays: V5AdvantageRef[][]): Array<V5AdvantageRef> {
    // Create an empty object to store the combined advantageRefs.
    const combinedAdvantages: { [key: string]: V5AdvantageRef } = {};

    // Loop through each array of advantageRefs.
    for (const array of arrays) {
        for (const advantage of array) {
            // Check if an advantage with the same name already exists in the combinedAdvantages object.
            if (combinedAdvantages[advantage.name]) {
                // If it exists, add the values of the current advantage to the existing one.
                combinedAdvantages[advantage.name].creationPoints += advantage.creationPoints;
                combinedAdvantages[advantage.name].freebiePoints += advantage.freebiePoints;
                combinedAdvantages[advantage.name].experiencePoints += advantage.experiencePoints;
                combinedAdvantages[advantage.name].havenPoints += advantage.havenPoints;
                combinedAdvantages[advantage.name].loresheetFreebiePoints += advantage.loresheetFreebiePoints;
            } else {
                // If it doesn't exist, create a new entry for the advantage.
                combinedAdvantages[advantage.name] = { ...advantage };
            }
        }
    }

    // Convert the combinedAdvantages object back to an array.
    const combinedArray = Object.values(combinedAdvantages);

    return combinedArray;
}

export function mergeBackgrounds(id: string, ...objects: V5BackgroundRef[]): V5BackgroundRef {
    // Ensure that there are at least two objects to merge
    console.log(objects)
    if (objects.length < 2) {
        return emptyBackground;
    }

    const firstObjectName = objects[0].name;
    if (!objects.every(obj => obj.name === firstObjectName)) {
        return emptyBackground;
    }

    const result: V5BackgroundRef = { ...emptyBackground, name: firstObjectName, id };

    // Initialize with the first object
    const [firstObject, ...restObjects] = objects;

    // Merge numerical properties
    result.creationPoints = Math.max(firstObject.creationPoints, ...restObjects.map(obj => obj.creationPoints));
    result.freebiePoints = Math.max(firstObject.freebiePoints, ...restObjects.map(obj => obj.freebiePoints));
    result.experiencePoints = Math.max(firstObject.experiencePoints, ...restObjects.map(obj => obj.experiencePoints));
    result.predatorTypeFreebiePoints = Math.max(firstObject.predatorTypeFreebiePoints, ...restObjects.map(obj => obj.predatorTypeFreebiePoints));
    result.loresheetFreebiePoints = Math.max(firstObject.loresheetFreebiePoints, ...restObjects.map(obj => obj.loresheetFreebiePoints));

    // Combine advantages arrays
    result.advantages = combineAdvantages(firstObject.advantages, ...restObjects.map(obj => obj.advantages));

    return result;
}



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
    let { experiencePoints, creationPoints, freebiePoints, predatorTypeFreebiePoints, loresheetFreebiePoints } = v5BackgroundRef;

    if (experiencePoints === 0) {
        let level = creationPoints + freebiePoints + predatorTypeFreebiePoints + loresheetFreebiePoints;
        let xpNeeded = 3;
        totalXpNeeded = xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
        level = Math.min(level, 3)
        return { level, totalXpNeeded, pastXpNeeded };
    } else {
        let level = creationPoints + freebiePoints + predatorTypeFreebiePoints + loresheetFreebiePoints;
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
        level = Math.min(level, 3)
        return { level, totalXpNeeded, pastXpNeeded };
    }
}

function findAdvantageByName(name: string): any {
    for (const entry of backgroundData) {
      if (entry.advantages) {
        for (const advantage of entry.advantages) {
          if (advantage.name === name) {
            return advantage;
          }
        }
      }
    }
    return null; // Return null if the advantage with the given name is not found
  }

export const v5AdvantageLevel = (AdvantageRef: V5AdvantageRef) => {
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
    let { experiencePoints, creationPoints, freebiePoints, havenPoints, loresheetFreebiePoints } = AdvantageRef;
    let advantageInfo = findAdvantageByName(AdvantageRef.name)
    let advantageMax = advantageInfo.cost[advantageInfo.cost.length-1]

    if (!havenPoints) { havenPoints = 0 }

    if (experiencePoints === 0) {
        let level = creationPoints + freebiePoints + havenPoints + loresheetFreebiePoints;
        let xpNeeded = 3;
        totalXpNeeded = xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
        level = Math.min(level, advantageMax)
        return { level, totalXpNeeded, pastXpNeeded };
    } else {
        let level = creationPoints + freebiePoints + havenPoints + loresheetFreebiePoints;
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
        level = Math.min(level, advantageMax)
        return { level, totalXpNeeded, pastXpNeeded };
    }
}

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints" | "sphere" | "note" | "havenPoints";

export const handleBackgroundChange = (
    kindred: Kindred,
    setKindred: Function,
    background: V5BackgroundRef,
    type: VariableKeys,
    newPoints: number | string,
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
        if (backgroundName === "Herd" && hasObviousPredator) { return null }

        // Keep the background if it's not in userBackgrounds, is an exception, or is "Herd" with "Obvious Predator"
        return isNotInUserBackgrounds || isException;
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

    const allBackgrounds: V5BackgroundRef[] = [];
    const highestLevelHerdResources: V5BackgroundRef[] = [];

    kindred.backgrounds
        .filter((bg, index, array) => {
            // Keep the first occurrence of each background based on 'id'
            return array.findIndex((b) => b.id === bg.id) === index;
        })
        .forEach((bg) => {
            const name = bg.name;
            const level = v5BackgroundLevel(bg).level;
            const advantageLength = bg.advantages.length

            if (!(name === "Herd" ||name === "Resources")) {
                allBackgrounds.push(bg);
            } else {
                const existingEntry = uniqueBackgrounds.get(name);
                if (!existingEntry || level > v5BackgroundLevel(existingEntry).level || advantageLength > existingEntry.advantages.length) {
                    uniqueBackgrounds.set(name, bg);
                }
            }
        });

    uniqueBackgrounds.forEach((bg) => {
        if (bg.name === "Herd"||bg.name === "Resources") {
            highestLevelHerdResources.push(bg);
        }
    });

    return [...highestLevelHerdResources, ...allBackgrounds].sort((a, b) => a.name.localeCompare(b.name));
}
