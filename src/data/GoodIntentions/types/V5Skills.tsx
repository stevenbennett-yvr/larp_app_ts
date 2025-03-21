import { z } from "zod";
import { Kindred } from "./Kindred";
import { getNumberBelow } from "../../../utils/getNumberBelow";
import { v5xp } from "./V5Costs";

export const v5skillCategoriesSchema = z.union([
    z.literal('mental'),
    z.literal('physical'),
    z.literal('social'),
])

const skillSchema = z.object({
    creationPoints: z.number().min(0).max(4).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
    category: v5skillCategoriesSchema,
});

export const v5skillsSchema = z.object({
    athletics: skillSchema,
    brawl: skillSchema,
    crafts: skillSchema,
    drive: skillSchema,
    firearms: skillSchema,
    melee: skillSchema,
    larceny: skillSchema,
    stealth: skillSchema,
    survival: skillSchema,

    "animal ken": skillSchema,
    etiquette: skillSchema,
    insight: skillSchema,
    intimidation: skillSchema,
    leadership: skillSchema,
    performance: skillSchema,
    persuasion: skillSchema,
    streetwise: skillSchema,
    subterfuge: skillSchema,

    academics: skillSchema,
    awareness: skillSchema,
    finance: skillSchema,
    investigation: skillSchema,
    medicine: skillSchema,
    occult: skillSchema,
    politics: skillSchema,
    science: skillSchema,
    technology: skillSchema,
})
export type V5Skills = z.infer<typeof v5skillsSchema>
export const v5skillsKeySchema = v5skillsSchema.keyof()
export type V5SkillsKey = z.infer<typeof v5skillsKeySchema>

export const v5allSkills: V5SkillsKey[] = [
    "athletics",
    "brawl",
    "crafts",
    "drive",
    "firearms",
    "melee",
    "larceny",
    "stealth",
    "survival",

    "animal ken",
    "etiquette",
    "insight",
    "intimidation",
    "leadership",
    "performance",
    "persuasion",
    "streetwise",
    "subterfuge",

    "academics",
    "awareness",
    "finance",
    "investigation",
    "medicine",
    "occult",
    "politics",
    "science",
    "technology",
]

export const v5EmptySkills: V5Skills = {
    athletics: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    brawl: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    crafts: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    drive: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    firearms: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    melee: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    larceny: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    stealth: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
    survival: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},

    "animal ken": { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    etiquette: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    insight: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    intimidation: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    leadership: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    performance: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    persuasion: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    streetwise: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},
    subterfuge: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'social'},

    academics: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    awareness: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    finance: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    investigation: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    medicine: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    occult: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    politics: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    science: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
    technology: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'mental'},
}

// Page 152
export const skillsDescriptions: Record<V5SkillsKey, string> = {
    athletics: "Running, jumping and climbing",
    brawl: "Unarmed combat",
    crafts: "Crafting, building, repairing",
    drive: "Operating vehicles (not needed for basic driving)",
    firearms: "Using ranged weapons",
    melee: "Armed melee combat",
    larceny: "Breaking into places and securing your home against the same",
    stealth: "Not being seen, heard or recognized",
    survival: "Handle adverse surroundings",

    academics: "Book-smarts and humanities",
    awareness: "Sharp senses and awareness of your surroundings",
    finance: "Making & handling money",
    investigation: "Researching, finding and following clues",
    medicine: "Healing and diagnosing",
    occult: "Affinity for secret lore",
    politics: "Handling government",
    science: "Knowledge of the physical world",
    technology: "Understand modern technology, computers, the internet",

    "animal ken": "Interacting with animals",
    etiquette: "Following social conventions",
    insight: "Sense emotions and motives",
    intimidation: "Get someone to back down",
    leadership: "Inspiring others",
    performance: "Performing art for an audience",
    persuasion: "Convincing others",
    streetwise: "Understanding criminal and urban society",
    subterfuge: "Trick others",
}

export const v5SkillLevel = (
    kindred: Kindred,
    skill: V5SkillsKey
) => {
    const skills = kindred.skills as V5Skills
    const skillData = skills[skill]
  
    let { creationPoints, freebiePoints = 0, experiencePoints = 0 } = skillData
  
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
  
    if (experiencePoints === 0) {
      let level = Math.max(creationPoints, freebiePoints)
      let xpNeeded = (level + 1) * v5xp.skill;
      totalXpNeeded = xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
      return { level, totalXpNeeded, pastXpNeeded };
    } else {
      let level = Math.max(creationPoints, freebiePoints)
      let xpNeeded = (level + 1) * v5xp.skill;
      totalXpNeeded += xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
  
      while (experiencePoints >= xpNeeded) {
        level++;
        experiencePoints -= xpNeeded;
        xpNeeded = (level + 1) * v5xp.skill;
        totalXpNeeded += xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
      }
  
      return { level, totalXpNeeded, pastXpNeeded };
    }
}

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
export const v5HandleSkillChange = (
    character: any,
    setCharacter: Function,
    skill: V5SkillsKey,
    variableKey: VariableKeys,
    value: number,
) => {

    const updatedAttributes = {
        ...character.skills,
        [skill]: {
            ...character.skills[skill],
            [variableKey]: value
        }
    }

    const updatedCharacter = {
        ...character,
        skills: updatedAttributes
    }

    setCharacter(updatedCharacter)
}


export const v5HandleXpSkillChange = (
    character: any,
    setCharacter: Function,
    skill: V5SkillsKey,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = v5SkillLevel(character, skill)
    const skills = character.skills as V5Skills;
    const skillData = skills[skill]; // Get the skill data

    let xp = value > skillData.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

    v5HandleSkillChange(character, setCharacter, skill, "experiencePoints", xp)
    return xp
}


export const getV5SkillCPArray = (kindred: Kindred): number[] => {
    const skills = kindred.skills;
    const levelArray: number[] = [];
    Object.keys(skills).forEach((skill) => {
        let skillName = skill as V5SkillsKey;
        const creationPoints = skills[skillName].creationPoints;
        levelArray.push(creationPoints);
    });
    levelArray.sort((a,b) => b-a);
    return levelArray
}

export const v5FindMaxSkill = (
    kindred: Kindred,
    skill: V5SkillsKey,
) => {
    const skills = kindred.skills as V5Skills;
    const skillData = skills[skill]

    const { experiencePoints } = skillData;
    const { level } = v5SkillLevel(kindred, skill);

    let max = undefined;
    if (level === 5) {
        max = experiencePoints;
    }
    return max;
};

export const v5SkillsCheckTotalPoints = (
    kindred: Kindred,
) => {
    let skills = kindred.skills
    let count = 0
    for (const skill in skills) {
        const attributeKey = skill as V5SkillsKey
        count += skills[attributeKey].creationPoints
    }
    return count === 26
}