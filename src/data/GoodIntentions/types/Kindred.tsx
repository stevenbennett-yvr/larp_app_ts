import { z } from 'zod';
import { v5AttributesSchema } from './V5Attributes';
import { clanNameSchema } from './V5Clans';
import { v5skillsSchema } from './V5Skills';
import { predatorTypeNameSchema } from './V5PredatorType';
import { specialtySchema } from './V5Specialties';
import { v5BackgroundRefSchema } from './V5Backgrounds';
import { disciplineSchema } from './V5Disciplines';

export const v5BackgroundSchema = z.object({
    history: z.string(),
    goals: z.string(),
    description: z.string(), 
})

export const kindredSchema = z.object({
    id: z.optional(z.string()),
    email: z.string(),
    uid: z.string(),
    domain: z.string(),

    name: z.string(),

    clan: clanNameSchema,
    predatorType: z.object({
        name: predatorTypeNameSchema,
        pickedSpecialities: specialtySchema.array(),
    }),

    background: v5BackgroundSchema,

    attributes: v5AttributesSchema,
    skills: v5skillsSchema,
    skillSpecialties: specialtySchema.array(),
    disciplines: disciplineSchema.array(),

    backgrounds: v5BackgroundRefSchema.array(),
    merits: z.array(z.string()),
    flaws: z.array(z.string())

})
export type Kindred = z.infer<typeof kindredSchema>

export const getEmptyKindred = (): Kindred => {
    return {
        name: "",
        email: "",
        uid: "",
        domain: "",

        background: {
            history: "",
            goals: "",
            description: "",
        },

        clan: "",
        predatorType: { name: "", pickedSpecialities: [] },

        attributes: {
            strength: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'physical' },
            dexterity: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'physical' },
            stamina: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'physical' },
        
            charisma: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'social' },
            manipulation: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'social' },
            composure: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'social' },
        
            intelligence: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'mental' },
            wits: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'mental' },
            resolve: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'mental' },
        },

        skills: {
            athletics: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
            brawl: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
            craft: { creationPoints: 0, freebiePoints: 0, experiencePoints: 0, category: 'physical'},
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
        },
        skillSpecialties: [],

        disciplines: [],
        backgrounds: [],
        merits: [],
        flaws: [],

    }
}