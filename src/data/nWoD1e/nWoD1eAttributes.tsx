import { z } from 'zod';
import { getNumberBelow } from '../../utils/getNumberBelow';

export const attributeCategoriesSchema = z.union([
    z.literal('mental'),
    z.literal('physical'),
    z.literal('social'),
])

export type AttributeCategory = 'mental' | 'physical' | 'social';

export const attributeTypeSchema = z.union([
    z.literal('power'),
    z.literal('finesse'),
    z.literal('resistance'),
])

const attributeSchema = z.object({
    creationPoints: z.number().min(1).max(6).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
    category: attributeCategoriesSchema,
    type: attributeTypeSchema
})

export type nWoD1eAttribute = z.infer<typeof attributeSchema>;

export const attributesSchema = z.object({
    intelligence: attributeSchema,
    wits: attributeSchema,
    resolve: attributeSchema,
    strength: attributeSchema,
    dexterity: attributeSchema,
    stamina: attributeSchema,
    presence: attributeSchema,
    manipulation: attributeSchema,
    composure: attributeSchema,
})
export type nWoD1eAttributes = z.infer<typeof attributesSchema>
export const attributesKeySchema = attributesSchema.keyof()
export type AttributesKey = z.infer<typeof attributesKeySchema>
export const allAttributes: AttributesKey[] = [
    'intelligence',
    'wits',
    'resolve',
    'strength',
    'dexterity',
    'stamina',
    'presence',
    'manipulation',
    'composure'
]

export const nWoD1eAttributeDescriptions: Record<AttributesKey, string> = {
    strength: "Physical might. Sheer bodily power. The capacity to lift objects, move items, hit things and people, and do damage. Strength is a measure of muscle.",
    dexterity: "Quickness. Response time. A delicate touch. Dexterity indicates how quickly and with how much finesse your character responds to his physical world.",
    stamina: "Sturdiness. Steadfastness. Sheer physical resilience. Stamina is a measure of how tough your character is. It indicates how far she can push her body, and how much physical abuse she can endure.",
    presence: "Bearing. Stature. Assertiveness. Presence suggests the power of your character's very identity. Attractiveness is only part of the trait. Your character may be jaw-dropping gorgeous, plain-Jane or downright ugly, but her Presence means much more. It reflects her sheer command over the attention of others.",
    manipulation: "Charm. Persuasiveness. Charisma. The capacity to play upon the desires, hopes and needs of others to influence them. Manipulation reflects your character's finesse in social situations.",
    composure: "Poise. Dignity. The capacity to remain calm and appear --and actually be-- unfazed in social and threatening situations, usually harrowing ones.",
    intelligence: "The raw power of the mind. Cognitive capacity. The inherent capability to digest, comprehend and remember information -- and to learn more. Intelligence is a direct measure of how smart your character is.",
    wits: "The ability to think on one's feet, under pressure or duress, without letting them see you sweat. Wits also encompasses an eye for detail, the ability to absorb what's going on in the environment, and to react to events.",
    resolve: "The focus and determination to see your character's will done. The capacity to stay on target, ignore distractions and to resist coercion or browbeating. Resolve is your character's mental fortitude.",
}

/// Type Functions

export const nWoD1eCurrentAttributeLevel = (
    character: any,
    attribute: AttributesKey,
) => {
    const attributes = character.attributes as nWoD1eAttributes;
    const attributeData = attributes[attribute]
    let { creationPoints, freebiePoints = 0, experiencePoints = 0 } = attributeData;

    let totalXpNeeded = 0;
    let pastXpNeeded = [0];

    if (experiencePoints === 0) {
        let level = creationPoints + freebiePoints;
        let xpNeeded = (level + 1) * 5;
        totalXpNeeded = xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
        return { level, totalXpNeeded, pastXpNeeded };
    } else {
        let level = creationPoints + freebiePoints;
        let xpNeeded = (level + 1) * 5;
        totalXpNeeded += xpNeeded;
        pastXpNeeded.push(totalXpNeeded);

        while (experiencePoints >= xpNeeded) {
            level++;
            experiencePoints -= xpNeeded;
            xpNeeded = (level + 1) * 5;
            totalXpNeeded += xpNeeded;
            pastXpNeeded.push(totalXpNeeded);
        }

        return { level, totalXpNeeded, pastXpNeeded };
    }
}

export const nWoD1eFindMaxAttribute = (
    character: any,
    attribute: AttributesKey,
) => {
    const attributes = character.attributes as nWoD1eAttributes;
    const attributeData = attributes[attribute]

    const { experiencePoints } = attributeData;
    const { level } = nWoD1eCurrentAttributeLevel(character, attribute);

    const powerStat = 5

    let max = undefined;
    if (powerStat <= 5 && level === 5) {
        max = experiencePoints;
    } if (powerStat > 5 && level === powerStat) {
        max = experiencePoints;
    }
    return max;
};

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
export const nWoD1eHandleAttributeChange = (
    character: any,
    setCharacter: Function,
    attribute: AttributesKey,
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

export const nWoD1ehandleXpAttributeChange = (
    character: any,
    setCharacter: Function,
    attribute: AttributesKey,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = nWoD1eCurrentAttributeLevel(character, attribute)
    const attributes = character.attributes as nWoD1eAttributes;
    const attributeData = attributes[attribute]; // Get the attribute data

    let xp = value > attributeData.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

    nWoD1eHandleAttributeChange(character, setCharacter, attribute, "experiencePoints", xp)
    return xp
}

export function nWoD1eAttributesCreationPointsCheck(
    character: any
): Record<string, number> {
    const totalPointsByCategory: Record<string, number> = {
        mental: 0,
        physical: 0,
        social: 0,
    };
    const attributes = character.attributes as nWoD1eAttributes;

    for (const attribute in attributes) {
        const attributeKey = attribute as AttributesKey
        const attributeData = attributes[attributeKey]
        const { category, creationPoints } = attributeData;

        if (category === 'mental') {
            totalPointsByCategory.mental += creationPoints;
        } else if (category === 'physical') {
            totalPointsByCategory.physical += creationPoints;
        } else if (category === 'social') {
            totalPointsByCategory.social += creationPoints;
        }
    }

    return totalPointsByCategory;
}

export function nWoD1eAttributesCheckTotalPoints(
    character: any
): boolean {
    const totalPointsByCategory = nWoD1eAttributesCreationPointsCheck(character)
    
    for (const category in totalPointsByCategory) {
        if (totalPointsByCategory[category] === 8) {
          delete totalPointsByCategory[category];
          for (const category in totalPointsByCategory) {
            if (totalPointsByCategory[category] === 7) {
              delete totalPointsByCategory[category];
              const remainingCategory = Object.keys(totalPointsByCategory)[0]
              if (totalPointsByCategory[remainingCategory] === 6) {
                return true
              }
            }
          }
        }
      }
    
    return false; // No category with the desired points found
}