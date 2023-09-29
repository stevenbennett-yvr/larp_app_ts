import { z } from 'zod';

export const ritualSchema = z.object({
    name: z.string(),
    summary: z.string(),
    rouseChecks: z.number().min(0).int(),
    requiredTime: z.string(),
    dicePool: z.string(),
    ingredients: z.string(),
    level: z.number().min(1).int(),
})
export type Ritual = z.infer<typeof ritualSchema>

export const Rituals: Ritual[] = [
    {
        name: "Blood Walk",
        summary: "Use blood to learn about a subjects generation, name, sire and - on a crit - any active Blood Bonds.",
        rouseChecks: 1,
        requiredTime: "1 hour",
        dicePool: "",
        ingredients: "Blood of the subject",
        level: 1,
    },
    {
        name: "Clinging of the Arachnid",
        summary: "Drink blood mixed with a freshly crushed spider to cling to walls like an insect.",
        rouseChecks: 1,
        requiredTime: "5min",
        dicePool: "",
        ingredients: "Living spider, your own blood",
        level: 1,
    },
    {
        name: "Craft Bloodstone",
        summary: "Slowly soak blood into a small magnet. Once done, you sense the direction and rough distance of the stone for a week.",
        rouseChecks: 1,
        requiredTime: "3 nights",
        dicePool: "",
        ingredients: "Small magnet, your blood",
        level: 1,
    },
    {
        name: "Wake with Evenings Freshness",
        summary: "When threatened during the day after performing this ritual, awaken and ignore daytime penalties for a scene.",
        rouseChecks: 1,
        requiredTime: "5min",
        dicePool: "",
        ingredients: "Burnt bones of a rooster",
        level: 1,
    },
    {
        name: "Ward against Ghouls",
        summary: "Place a ward on a small object. When a ghoul tries to touch it, roll your Ritual roll. If you succeed, the Ghoul cannot touch it and is damaged.",
        rouseChecks: 1,
        requiredTime: "5min",
        dicePool: "",
        ingredients: "",
        level: 1,
    },
]

export const ritualRefSchema = z.object({
    name: z.string(),
    creationPoints: z.number().min(0).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
})

export type RitualRef = z.infer<typeof ritualRefSchema>

export const ritualRefs: RitualRef[] = Rituals.map((ritual) => ({
    name: ritual.name,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
}))