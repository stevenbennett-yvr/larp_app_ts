import { z } from "zod";
import { Kindred } from "./Kindred";
import { v5xp } from "./V5Costs";
import { getNumberBelow } from "../../../utils/getNumberBelow";

export const attributeCategoriesSchema = z.union([
    z.literal('mental'),
    z.literal('physical'),
    z.literal('social'),
])

export type AttributeCategory = 'mental' | 'physical' | 'social';

const attributeSchema = z.object({
    creationPoints: z.number().min(1).max(4).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
    category: attributeCategoriesSchema,
})

export const v5AttributesSchema = z.object({
    strength: attributeSchema,
    dexterity: attributeSchema,
    stamina: attributeSchema,

    charisma: attributeSchema,
    manipulation: attributeSchema,
    composure: attributeSchema,

    intelligence: attributeSchema,
    wits: attributeSchema,
    resolve: attributeSchema,
})
export type V5Attributes = z.infer<typeof v5AttributesSchema>
export const v5attributesKeySchema = v5AttributesSchema.keyof()
export type V5AttributesKey = z.infer<typeof v5attributesKeySchema>

// Page 152
export const attributeDescriptions: Record<V5AttributesKey, string> = {
    strength: "Anything related to muscles",
    dexterity: "Agility and coordination",
    stamina: "Toughness and resilience",
    charisma: "Charm and magnetism",
    manipulation: "Get others to do what you want",
    composure: "Self-control and staying calm",
    intelligence: "Memory and reasoning",
    wits: "Intuition and split-second decision making",
    resolve: "Focus and attention",
}

export const v5AttributeLevel = (
    kindred: Kindred,
    attribute: V5AttributesKey,
) => {
    const attributes = kindred.attributes as V5Attributes
    const attributeData = attributes[attribute]
    let { creationPoints, freebiePoints, experiencePoints } = attributeData;

    let totalXpNeeded = 0;
    let pastXpNeeded = [0];

    if (experiencePoints === 0) {
        let level = creationPoints + freebiePoints;
        let xpNeeded = (level + 1) * v5xp.attributes;
        totalXpNeeded = xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
        return { level, totalXpNeeded, pastXpNeeded };
    } else {
        let level = creationPoints + freebiePoints;
        let xpNeeded = (level + 1) * v5xp.attributes;
        totalXpNeeded += xpNeeded;
        pastXpNeeded.push(totalXpNeeded);

        while (experiencePoints >= xpNeeded) {
            level++;
            experiencePoints -= xpNeeded;
            xpNeeded = (level + 1) * v5xp.attributes;
            totalXpNeeded += xpNeeded;
            pastXpNeeded.push(totalXpNeeded);
        }

        return { level, totalXpNeeded, pastXpNeeded };
    }
}

export const getV5AttributeCPArray = (kindred: Kindred): number[] => {
    const attributes = kindred.attributes;
    const levelArray: number[] = [];
    Object.keys(attributes).forEach((attribute) => {
        let attributeName = attribute as V5AttributesKey;
        const creationPoints = attributes[attributeName].creationPoints;
        levelArray.push(creationPoints);
    });
    levelArray.sort((a,b) => b-a);
    return levelArray
}

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
export const v5HandleAttributeChange = (
    character: any,
    setCharacter: Function,
    attribute: V5AttributesKey,
    variableKey: VariableKeys,
    value: number,
) => {

    const updatedAttributes = {
        ...character.attributes,
        [attribute]: {
            ...character.attributes[attribute],
            [variableKey]: value
        }
    }

    const updatedCharacter = {
        ...character,
        attributes: updatedAttributes
    }

    setCharacter(updatedCharacter)
}

export const v5HandleXpAttributeChange = (
    character: any,
    setCharacter: Function,
    attribute: V5AttributesKey,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = v5AttributeLevel(character, attribute)
    const attributes = character.attributes as V5Attributes;
    const attributeData = attributes[attribute]; // Get the attribute data

    let xp = value > attributeData.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

    v5HandleAttributeChange(character, setCharacter, attribute, "experiencePoints", xp)
    return xp
}

export const v5FindMaxAttribute = (
    kindred: Kindred,
    attribute: V5AttributesKey,
) => {
    const attributes = kindred.attributes as V5Attributes;
    const attributeData = attributes[attribute]

    const { experiencePoints } = attributeData;
    const { level } = v5AttributeLevel(kindred, attribute);

    let max = undefined;
    if (level === 5) {
        max = experiencePoints;
    }
    return max;
};

export const v5AttributesCheckTotalPoints = (
    kindred: Kindred,
) => {
    let attributes = kindred.attributes
    let count = 0
    for (const attribute in attributes) {
        const attributeKey = attribute as V5AttributesKey
        count += attributes[attributeKey].creationPoints
    }
    return count === 22
}