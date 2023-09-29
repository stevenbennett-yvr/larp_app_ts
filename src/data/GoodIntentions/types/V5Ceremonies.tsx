import { z } from 'zod';

export const ceremonySchema = z.object({
    name: z.string(),
    summary: z.string(),
    rouseChecks: z.number().min(0).int(),
    requiredTime: z.string(),
    dicePool: z.string(),
    ingredients: z.string(),
    level: z.number().min(1).int(),
})
export type Ceremony = z.infer<typeof ceremonySchema>

export const ceremonyRefSchema = z.object({
    name: z.string(),
    creationPoints: z.number().min(0).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
})

export type CeremonyRef = z.infer<typeof ceremonyRefSchema>

export const Ceremonies: Ceremony[] = [
    {
        name: "Din of the Damned",
        summary: "This Ceremony allows the sounds of the dead lands to permeate the world of the living and prevent others from eavesdropping.",
        rouseChecks: 1,
        requiredTime: "5min",
        dicePool: "",
        ingredients: "Ash from a crematorium",
        level: 1,
    },
    {
        name: "Eyes of the Dead",
        summary: " This Ceremony allows a necromancer to sense the presence of corpses and immediately identify their time and cause of death.",
        rouseChecks: 1,
        requiredTime: "5min",
        dicePool: "",
        ingredients: "Embalming fluid",
        level: 1,
    },
    {
        name: "Guiding Spirits",
        summary: "This Ceremony allows you to commune with wraiths along a specific route, using the dead’s insight to help find the safest and quickest path",
        rouseChecks: 1,
        requiredTime: "3 nights",
        dicePool: "",
        ingredients: "A broken compass",
        level: 1,
    },
    {
        name: "Summon Spirit",
        summary: "This Ceremony summons the closest spirit or a specific spirit if the Oblivion user has one of its fetters.",
        rouseChecks: 1,
        requiredTime: "5min",
        dicePool: "",
        ingredients: "A broken mirror, rotting or dead wood, and ash from an extinguished fire",
        level: 1,
    },
]

export const ceremonyRefs: CeremonyRef[] = Ceremonies.map((ceremony) => ({
    name: ceremony.name,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
}))