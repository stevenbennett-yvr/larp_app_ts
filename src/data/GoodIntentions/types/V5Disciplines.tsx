import { z } from "zod";

import * as logos from "../../../assets/images/GoodIntentions";

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
    "oblivion"
]

export const disciplineSchema = z.object({
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number(),
})
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
})
export type Discipline = z.infer<typeof disciplinesSchema>

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
}

export const getEmptyDisciplines: Discipline = {
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
}