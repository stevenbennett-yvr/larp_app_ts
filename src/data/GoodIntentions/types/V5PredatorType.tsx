import { z } from "zod";
import { v5BackgroundRefSchema, emptyBackground, emptyAdvantage } from "./V5Backgrounds";
import { v5attributesKeySchema } from "./V5Attributes";
import { v5skillsKeySchema } from "./V5Skills";
import { v5MeritFlawRefSchema, emptyMeritFlaw } from "./V5MeritsOrFlaws";

export const predatorTypeNameSchema = z.union([
    z.literal("Alleycat"),
    z.literal("Bagger"),
    z.literal("Cleaver"),
    z.literal("Consensualist"),
    z.literal("Extortionist"),
    z.literal("Farmer"),
    z.literal("Ferryman"),
    z.literal("Graverobber"),
    z.literal("Hitcher"),
    z.literal("Osiris"),
    z.literal("Sandman"),
    z.literal("Scene Queen"),
    z.literal("Siren"),

    z.literal(""),
])
export type PredatorTypeName = z.infer<typeof predatorTypeNameSchema>

export const huntingPoolSchema =
    z.object({
        attribute: v5attributesKeySchema,
        skill: v5skillsKeySchema,
    }
    )

export const predatorTypeSchema = z.object({
    name: z.string(),
    summary: z.string(),
    backgrounds: v5BackgroundRefSchema.array(),
    meritsAndFlaws: v5MeritFlawRefSchema.array(),
    humanityChange: z.number().int(),
    huntingPool: huntingPoolSchema.optional(),
})
export type PredatorType = z.infer<typeof predatorTypeSchema>


export const PredatorTypes: Record<PredatorTypeName, PredatorType> = {
    Alleycat: {
        name: "Alleycat",
        summary: "Ambush prey in alleys",
        backgrounds: [
            { ...emptyBackground, id: "alleycat-contacts", name: "Contacts", freebiePoints: 2, advantages: [] },
            { ...emptyBackground, id: "alleycat-resources", name: "Resources", freebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Cash Money", freebiePoints: 1 }] },
        ],
        meritsAndFlaws: [],
        humanityChange: -1,
        huntingPool: { attribute: "wits", skill: "streetwise" }
    },
    Bagger: {
        name: "Bagger",
        summary: "Feed on blood bags",
        backgrounds: [
            { ...emptyBackground, id: "bagger-contacts", name: "Contacts", sphere: "underworld", freebiePoints: 2, advantages: [] }
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'bagger-IronGullet', name: "Iron Gullet", freebiePoints: 3, note: "able to feed on rancid blood" },
            { ...emptyMeritFlaw, id: 'bagger-Enemy', name: "Enemy", freebiePoints: 2, note: "Someone believes you owe them" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "intelligence", skill: "larceny" }
    },
    Cleaver: {
        name: "Cleaver",
        summary: "Feed on friends and family",
        backgrounds: [
            { ...emptyBackground, id: "cleaver-herd", name: "Herd", freebiePoints: 2, advantages: [] },
            { ...emptyBackground, id: "cleaver-mask", name: "Mask", freebiePoints: 2, advantages: [] },
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'bagger-DarkSecret', name: "Dark Secret", freebiePoints: 1, note: "You are a cleaver" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "manipulation", skill: "subterfuge" }
    },
    Consensualist: {
        name: "Consensualist",
        summary: "Take blood only from the willing",
        backgrounds: [
            { ...emptyBackground, id: "consensualist-herd", name: "Herd", freebiePoints: 3, advantages: [] }
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'consensualist-DarkSecret', name: "Dark Secret", freebiePoints: 1, note: "Masquerade Breacher" },
            { ...emptyMeritFlaw, id: 'consensualist-PreyExclusion', name: "Prey Exclusion", freebiePoints: 1, note: "Can't feed on the non-consenting" },
        ],
        humanityChange: 1,
        huntingPool: { attribute: "manipulation", skill: "persuasion" },
    },
    Extortionist: {
        name: "Extortionist",
        summary: "Strong-arm prey into giving you their blood",
        backgrounds: [
            { ...emptyBackground, id: "extortionist-resources", name: "Resources", freebiePoints: 1, advantages: [] },
            { ...emptyBackground, id: "extortionist-contacts", name: "Contacts", freebiePoints: 1, advantages: [] },
            { ...emptyBackground, id: "extortionist-allies", name: "Allies", freebiePoints: 1, advantages: [] },
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'extortionist-Enemy', name: "Enemy", freebiePoints: 2, note: "(Police or Victim)" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "manipulation", skill: "intimidation" }
    },
    Farmer: {
        name: "Farmer",
        summary: "Feed on animals",
        backgrounds: [
            { ...emptyBackground, id: "farmer-haven", name: "Haven", freebiePoints: 2, advantages: [{ ...emptyAdvantage, name: "Zoo", freebiePoints: 2 }] },
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'farmer-Farmer', name: "Farmer", freebiePoints: 2, note: "feeding on non-animal blood costs you 2 willpower" },
        ],
        humanityChange: 1,
        huntingPool: { attribute: "composure", skill: "animal ken" },
    },
    Ferryman: {
        name: "Ferryman",
        summary: "Use your retainers to herd prey",
        backgrounds: [
            { ...emptyBackground, id: "ferryman-allies", name: "Allies", freebiePoints: 2, advantages: [{ ...emptyAdvantage, name: "Retainer", freebiePoints: 2 }] }
        ],
        meritsAndFlaws: [],
        humanityChange: 0,
    },
    Graverobber: {
        name: "Graverobber",
        summary: "Feed on fresh corpses and mourning families",
        backgrounds: [
            { ...emptyBackground, id: "graverobber-haven", name: "Haven", freebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Walk-In Freezer", freebiePoints: 1 }] }
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'graverobber-IronGullet', name: "Iron Gullet", freebiePoints: 3, note: "able to feed on rancid blood" },
            { ...emptyMeritFlaw, id: 'graverobber-ObviousPredator', name: "Obvious Predator", freebiePoints: 3, note: "mortals are scared of you, can't keep Herd" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "wits", skill: "medicine" },
    },
    Hitcher: {
        name: "Hitcher",
        summary: "Hunt prey on desolate roads",
        backgrounds: [
            { ...emptyBackground, id: "hitcher-haven", name: "Haven", freebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Garage", freebiePoints: 1 }] },
            { ...emptyBackground, id: "hitcher-resources", name: "Resources", freebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Goods and Services", freebiePoints: 1 }] }
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'hitcher-PreyExclusion', name: "Prey Exclusion", freebiePoints: 1, note: "Of our choice." },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "wits", skill: "etiquette" },
    },
    Osiris: {
        name: "Osiris",
        summary: "Feed on your followers",
        backgrounds: [
            { ...emptyBackground, id: "osiris-mask", name: "Mask", freebiePoints: 2, advantages: [] },
        ],
        meritsAndFlaws: [
        ],
        humanityChange: 0,
        huntingPool: { attribute: "manipulation", skill: "subterfuge" }
    },
    Sandman: {
        name: "Sandman",
        backgrounds: [
            { ...emptyBackground, id: "sandman-mask", name: "Mask", freebiePoints: 1, advantages: [] },
        ],
        summary: "Break into homes and feed on sleeping prey",
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'sandman-PreyExclusion', name: "Prey Exclusion", freebiePoints: 1, note: "Conscious Mortals." },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "dexterity", skill: "stealth" }
    },
    "Scene Queen": {
        name: "Scene Queen",
        summary: "Feed in your scene / subculture",
        backgrounds: [
            { ...emptyBackground, id: "sceneQueen-mask", name: "Mask", freebiePoints: 2, advantages: [] },
            { ...emptyBackground, id: "sceneQueen-fame", name: "Fame", freebiePoints: 1, advantages: [] },
            { ...emptyBackground, id: "sceneQueen-herd", name: "Herd", freebiePoints: 2, advantages: [] },
        ],
        meritsAndFlaws: [],
        humanityChange: 0,
        huntingPool: { attribute: "charisma", skill: "etiquette" },
    },

    Siren: {
        name: "Siren",
        summary: "Seduce prey and take their blood",
        backgrounds: [
            { ...emptyBackground, id: "siren-herd", name: "Herd", freebiePoints: 1, advantages: [] },
            { ...emptyBackground, id: "siren-fame", name: "Fame", freebiePoints: 1, advantages: [] },
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'siren-Enemy', name: "Enemy", freebiePoints: 1, note: "(spurned lover or jealous partner)" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "charisma", skill: "subterfuge" }
    },
    "": {
        name: "",
        summary: "",
        backgrounds: [],
        meritsAndFlaws: [],
        humanityChange: 0,
    },
}