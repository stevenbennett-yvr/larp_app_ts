import { z } from 'zod';
import { v5AttributesSchema } from './V5Attributes';
import { clanNameSchema } from './V5Clans';
import { v5skillsSchema } from './V5Skills';
import { predatorTypeNameSchema } from './V5PredatorType';
import { specialtySchema } from './V5Specialties';
import { v5BackgroundRefSchema } from './V5Backgrounds';
import { disciplinesSchema } from './V5Disciplines';
import { ritualRefSchema } from './V5Rituals';
import { Power, powerRefSchema } from './V5Powers';
import { v5MeritFlawRefSchema } from './V5MeritsOrFlaws';
import { ceremonyRefSchema } from './V5Ceremonies';
import { loresheetRefSchema, sectNameSchema } from './V5Loresheets'
import { formulaRefSchema } from './V5Alchemy';

export const v5BackgroundSchema = z.object({
    history: z.string(),
    goals: z.string(),
    description: z.string(), 
})

export const BasicSchema = z.object({
    creationPoints: z.number().min(0).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
})

export const backstorySchema = z.object({
    history: z.string(),
    goals: z.string(),
    description: z.string(),
    profilePic: z.string(),
  })

export const touchstoneSchema = z.object({
    name: z.string(),
    description: z.string(),
    conviction: z.string(),
})

export type Touchstone = z.infer<typeof touchstoneSchema>

export const kindredSchema = z.object({
    id: z.optional(z.string()),
    email: z.string(),
    uid: z.string(),
    domain: z.string(),
    name: z.string(),
    concept: z.string(),

    backstory: backstorySchema,
    touchstones: touchstoneSchema.array(),

    clan: clanNameSchema,
    sect: sectNameSchema,
    generation: z.number().min(0).int(),
    predatorType: predatorTypeNameSchema,
    bloodPotency: BasicSchema,
    humanity: BasicSchema,

    attributes: v5AttributesSchema,
    skills: v5skillsSchema,
    skillSpecialties: specialtySchema.array(),
    disciplines: disciplinesSchema,
    powers: powerRefSchema.array(),
    rituals: ritualRefSchema.array(),
    ceremonies: ceremonyRefSchema.array(),
    formulae: formulaRefSchema.array(),

    backgrounds: v5BackgroundRefSchema.array(),
    meritsFlaws: v5MeritFlawRefSchema.array(),
    loresheet: loresheetRefSchema,
    startDate: z.string().datetime(),
})
export type Kindred = z.infer<typeof kindredSchema>

export const getEmptyKindred = (): Kindred => {
    return {
        name: "",
        concept: "",
        email: "",
        uid: "",
        domain: "",
        touchstones: [],

        backstory: {
            history: "",
            goals: "",
            description: "",
            profilePic: "",
          },

        clan: "",
        sect: "",
        generation: 0,
        predatorType:"",
        bloodPotency: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },
        humanity: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0 },

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

        disciplines: {
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
        },
        powers: [],
        rituals: [],
        ceremonies: [],
        formulae: [],

        backgrounds: [],
        meritsFlaws: [],
        loresheet: {name:"",benefits:[]},
        startDate: new Date().toISOString(),
    }
}

export const containsBloodSorcery = (powers: Power[]) => powers.filter((power) => power.discipline === "blood sorcery").length > 0

export const containsOblivion = (powers: Power[]) => powers.filter((power) => power.discipline === "oblivion").length > 0
