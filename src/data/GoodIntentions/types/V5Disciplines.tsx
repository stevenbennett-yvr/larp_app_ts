import { z } from "zod";

import * as logos from "../../../assets/images/GoodIntentions";
import { Kindred } from "./Kindred";
import { Clans } from "./V5Clans";
import { v5xp } from "./V5Costs";
import { getNumberBelow } from "../../../utils/getNumberBelow";
import { cleanRituals } from "./V5Rituals";
import { cleanCeremonies } from "./V5Ceremonies";

export const disciplineNameSchema = z.union([
    z.literal("animalism"),
    z.literal("auspex"),
    z.literal("celerity"),
    z.literal("dominate"),
    z.literal("fortitude"),
    z.literal("obfuscate"),
    z.literal("potence"),
    z.literal("presence"),
    z.literal("protean"),
    z.literal("blood sorcery"),
    z.literal("oblivion"),
    z.literal("thin-blood alchemy"),
])
export type DisciplineName = z.infer<typeof disciplineNameSchema>

export const allDisciplines : DisciplineName[] = [
    "animalism",
    "auspex",
    "celerity",
    "dominate",
    "fortitude",
    "obfuscate",
    "potence",
    "presence",
    "protean",
    "blood sorcery",
    "oblivion",
    "thin-blood alchemy"
]

export const disciplineSchema = z.object({
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
})

export type V5Discipline = z.infer<typeof disciplineSchema>


export const disciplinesSchema = z.object({
    animalism: disciplineSchema,
    auspex: disciplineSchema,
    celerity: disciplineSchema,
    dominate: disciplineSchema,
    fortitude: disciplineSchema,
    obfuscate: disciplineSchema,
    potence: disciplineSchema,
    presence: disciplineSchema,
    protean: disciplineSchema,
    oblivion: disciplineSchema,
    "blood sorcery": disciplineSchema,
    "thin-blood alchemy": disciplineSchema,
})
export type V5Disciplines = z.infer<typeof disciplinesSchema>

export const disciplineKeySchema = disciplinesSchema.keyof()
export type DisciplineKey = z.infer<typeof disciplineKeySchema>

export type DisciplineDescription = {
    summary: string;
    logo: string;
}

export const disciplines: Record<DisciplineName, DisciplineDescription> = {
    animalism: {
        summary: "Interact with and control animals",
        logo: logos.animalismLogo,
    },
    auspex: {
        summary: "Supernatural senses and premonitions",
        logo: logos.auspexLogo,
    },
    celerity: {
        summary: "Move with supernatural speed",
        logo: logos.celerityLogo,
    },
    dominate: {
        summary: "Control other's minds",
        logo: logos.dominateLogo,
    },
    fortitude: {
        summary: "Resist damage and influence",
        logo: logos.fortitudeLogo,
    },
    obfuscate: {
        summary: "Remain undetected",
        logo: logos.obfuscateLogo,
    },
    potence: {
        summary: "Gain supernatural strength",
        logo: logos.potenceLogo,
    },
    presence: {
        summary: "Supernatural appearance and vibe",
        logo: logos.presenceLogo,
    },
    protean: {
        summary: "Shape your body to gain power",
        logo: logos.proteanLogo,
    },
    "blood sorcery": {
        summary: "Use blood-related magic and rituals",
        logo: logos.bloodSorceryLogo,
    },
    oblivion: {
        summary: "Shadow powers and necromancy",
        logo: logos.oblivionLogo,
    },
    "thin-blood alchemy": {
        summary: "Create draughts that provide different abilities",
        logo: logos.alchemyLogo
    }
}

export const getEmptyDisciplines: V5Disciplines = {
    animalism: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    auspex: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    celerity: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    dominate: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    fortitude: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    obfuscate: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    potence: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    presence: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    protean: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    oblivion: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    "blood sorcery": { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
    "thin-blood alchemy": { creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
}

export const v5DisciplineLevel = (kindred:Kindred, discipline:DisciplineKey) => {
    const { creationPoints, freebiePoints, experiencePoints } = kindred.disciplines[discipline]
    let clan = kindred.clan
    const disciplinesForClan = Clans[clan].disciplines;
    let inClan = disciplinesForClan.includes(discipline)
    let isCaitiff = clan === "Caitiff"
    let isAlchemy = discipline === "thin-blood alchemy"
    let isAlchemist = kindred.meritsFlaws.some((m) => m.name === "Thin-Blood Alchemist")

    const xpCost = inClan || isAlchemy? v5xp.inClanDisciplines : isCaitiff? v5xp.caitiffDiscipline : v5xp.outOfClanDiscipline

    let xp = experiencePoints
    let totalXpNeeded = 0
    let pastXpNeeded = [0]
    if (xp === 0) {
      let level = creationPoints + freebiePoints + (isAlchemy&&isAlchemist?1:0);
      let totalXpNeeded = (level + 1) * xpCost;
      pastXpNeeded.push(totalXpNeeded)
      return {level, totalXpNeeded, pastXpNeeded};
    } 
    else {
      let level = creationPoints + freebiePoints + (isAlchemy&&isAlchemist?1:0);
      let xpNeeded = (level + 1) * xpCost;
      totalXpNeeded += xpNeeded
      pastXpNeeded.push(totalXpNeeded)
      while (xp >= xpNeeded) {
        level++;
        xp -= xpNeeded;
        xpNeeded = (level + 1) * xpCost;
        totalXpNeeded += xpNeeded
        pastXpNeeded.push(totalXpNeeded)
      }
      return {level, totalXpNeeded, pastXpNeeded};
    }
}


type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
export const v5HandleDisciplineChange = (
    kindred: Kindred,
    setCharacter: (kindred:Kindred) => void,
    discipline: DisciplineKey,
    variableKey: VariableKeys,
    value: number,
) => {

    const updatedDisciplines = {
        ...kindred.disciplines,
        [discipline]: {
            ...kindred.disciplines[discipline],
            [variableKey]: value
        }
    }

    let updatedCharacter = {
        ...kindred,
        disciplines: updatedDisciplines,
    }

    updatedCharacter = {
        ...updatedCharacter,
        rituals: cleanRituals(updatedCharacter),
        ceremonies: cleanCeremonies(updatedCharacter),
    }

    setCharacter(updatedCharacter)
}


export const v5HandleXpDisciplineChange = (
    character: Kindred,
    setCharacter: (kindred:Kindred) => void,
    discipline: DisciplineKey,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = v5DisciplineLevel(character, discipline)
    const disciplines = character.disciplines as V5Disciplines;
    const disciplineData = disciplines[discipline];

    let xp = value > disciplineData.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

    v5HandleDisciplineChange(character, setCharacter, discipline, "experiencePoints", xp)
    return xp
}

export const v5FindMaxDiscipline = (
    kindred: Kindred,
    discipline: DisciplineKey,
) => {
    const disciplines = kindred.disciplines as V5Disciplines;
    const disciplineData = disciplines[discipline]

    const { experiencePoints } = disciplineData;
    const { level } = v5DisciplineLevel(kindred, discipline);

    let max = undefined;
    if (level === 5) {
        max = experiencePoints;
    }
    return max;
}