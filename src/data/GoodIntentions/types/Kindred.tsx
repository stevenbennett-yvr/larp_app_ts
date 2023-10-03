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
import { v5xp } from '../V5Experience';

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

export const kindredSchema = z.object({
    id: z.optional(z.string()),
    email: z.string(),
    uid: z.string(),
    domain: z.string(),

    name: z.string(),

    clan: clanNameSchema,
    generation: z.number().min(0).int(),
    predatorType: z.object({
        name: predatorTypeNameSchema,
    }),
    bloodPotency: BasicSchema,
    humanity: BasicSchema,

    background: v5BackgroundSchema,

    attributes: v5AttributesSchema,
    skills: v5skillsSchema,
    skillSpecialties: specialtySchema.array(),
    disciplines: disciplinesSchema,
    powers: powerRefSchema.array(),
    rituals: ritualRefSchema.array(),
    ceremonies: ceremonyRefSchema.array(),

    backgrounds: v5BackgroundRefSchema.array(),
    meritsFlaws: v5MeritFlawRefSchema.array(),
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
        generation: 0,
        predatorType: { name: "" },
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

        backgrounds: [],
        meritsFlaws: [],
    }
}

export const containsBloodSorcery = (powers: Power[]) => powers.filter((power) => power.discipline === "blood sorcery").length > 0

export const containsOblivion = (powers: Power[]) => powers.filter((power) => power.discipline === "oblivion").length > 0

export const v5BloodPotencyLevel = (
    kindred: Kindred,
) => {  
    let { creationPoints, freebiePoints = 0, experiencePoints = 0 } = kindred.bloodPotency
  
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
  
    if (experiencePoints === 0) {
      let level = creationPoints + freebiePoints;
      let xpNeeded = (level + 1) * v5xp.bloodPotency;
      totalXpNeeded = xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
      return { level, totalXpNeeded, pastXpNeeded };
    } else {
      let level = creationPoints + freebiePoints;
      let xpNeeded = (level + 1) * v5xp.bloodPotency;
      totalXpNeeded += xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
  
      while (experiencePoints >= xpNeeded) {
        level++;
        experiencePoints -= xpNeeded;
        xpNeeded = (level + 1) * v5xp.bloodPotency;
        totalXpNeeded += xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
      }
  
      return { level, totalXpNeeded, pastXpNeeded };
    }
}