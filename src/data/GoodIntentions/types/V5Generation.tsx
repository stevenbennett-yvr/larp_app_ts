import { z } from 'zod'

const rankNameSchema = z.union([
    z.literal("Thin-blood"),
    z.literal("Fledgeling"),
    z.literal("Neonate"),
    z.literal("Ancille"),
    z.literal("Elder")
]) 

const generationSchema = z.object({
    generation: z.string(),
    rank: rankNameSchema,
    min_bp: z.number(),
    max_bp: z.number(),
})

export type Generation = z.infer<typeof generationSchema>

export const generations: Record<number, Generation> ={
    9: {
        generation: "9th",
        rank: "Ancille",
        min_bp: 2,
        max_bp: 5,
    },
    10: {
        generation: "10th",
        rank: "Neonate",
        min_bp: 1,
        max_bp: 4,
    },
    11: {
        generation: "11th",
        rank: "Neonate",
        min_bp: 1,
        max_bp: 4,
    },
    12: {
        generation: "12th",
        rank: "Fledgeling",
        min_bp: 1,
        max_bp: 3,
    },
    13: {
        
        generation: "13th",
        rank: "Fledgeling",
        min_bp: 1,
        max_bp: 3,
    },
    14: {
        generation: "14th",
        rank: "Thin-blood",
        min_bp: 0,
        max_bp: 0,
    },
    15: {
        generation: "15th",
        rank: "Thin-blood",
        min_bp: 0,
        max_bp: 0,
    },
    16: {
        generation: "16th",
        rank: "Thin-blood",
        min_bp: 0,
        max_bp: 0,
    }
}