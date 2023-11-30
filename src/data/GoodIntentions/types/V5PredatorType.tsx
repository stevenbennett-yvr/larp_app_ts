import { z } from "zod";
import { v5BackgroundRefSchema, emptyBackground, emptyAdvantage } from "./V5Backgrounds";
import { sphereOfInfluenceSchema } from "./V5Spheres";
import { v5attributesKeySchema } from "./V5Attributes";
import { v5skillsKeySchema } from "./V5Skills";
import { v5MeritFlawRefSchema, emptyMeritFlaw } from "./V5MeritsOrFlaws";

export const predatorTypeNameSchema = z.union([
    z.literal("Alleycat"),
    z.literal("Bagger"),
    z.literal("Cleaver"),
    z.literal("Consentualist"),
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

export const allPredatorTypes : PredatorTypeName[] = [
    "Alleycat",
    "Bagger",
    "Cleaver",
    "Consentualist",
    "Extortionist",
    "Farmer",
    "Ferryman",
    "Graverobber",
    "Hitcher",
    "Osiris",
    "Sandman",
    "Scene Queen",
    "Siren",
]

export const selectableBackgroundsSchema = z.object({
    options: v5BackgroundRefSchema.array(),
    totalPoints: z.number().int(),
})

export const selectableMeritFlawSchema = z.object({
    options: v5MeritFlawRefSchema.array(),
    totalPoints: z.number().int(),
})

export const huntingPoolSchema =
        z.object({
            attribute: v5attributesKeySchema,
            skill: v5skillsKeySchema,
        }
    )

export const predatorTypeSchema = z.object({
    name: predatorTypeNameSchema,
    summary: z.string(),
    backgrounds: v5BackgroundRefSchema.array(),
    advantagePoints: z.number().optional(),
    meritsAndFlaws: v5MeritFlawRefSchema.array(),
    humanityChange: z.number().int(),
    huntingPool: huntingPoolSchema.optional(),
    selectableSpheres: sphereOfInfluenceSchema.array(),
    selectableBackground: selectableBackgroundsSchema,
    selectableMeritFlaw: selectableMeritFlawSchema,
})
export type PredatorType = z.infer<typeof predatorTypeSchema>


export const PredatorTypes: Record<PredatorTypeName, PredatorType> = {
    Alleycat: {
        name: "Alleycat",
        summary: "Ambush prey in alleys",
        backgrounds: [
            { ...emptyBackground, id: "alleycat-contacts", note:"Allycat Contacts", name: "Contacts", predatorTypeFreebiePoints: 2, advantages: [], sphere: ["underworld", "street"] },
            { ...emptyBackground, id: "alleycat-resources", note:"Allycat Resournces", name: "Resources", predatorTypeFreebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Cash Money", freebiePoints: 1 }] },
        ],
        meritsAndFlaws: [],
        humanityChange: -1,
        huntingPool: { attribute: "wits", skill: "streetwise" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],
    },
    Bagger: {
        name: "Bagger",
        summary: "Feed on blood bags",
        backgrounds: [
            { ...emptyBackground, id: "bagger-contacts", note:"Bagger Contacts", name: "Contacts", sphere: ["underworld"], predatorTypeFreebiePoints: 2, advantages: [] }
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'bagger-IronGullet', name: "Iron Gullet", freebiePoints: 3, note: "able to feed on rancid blood" },
            { ...emptyMeritFlaw, id: 'bagger-Enemy', name: "Enemy", freebiePoints: 2, note: "Someone believes you owe them" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "intelligence", skill: "larceny" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Cleaver: {
        name: "Cleaver",
        summary: "Feed on friends and family",
        backgrounds: [
            { ...emptyBackground, id: "cleaver-herd", note:"Cleaver Herd", name: "Herd", predatorTypeFreebiePoints: 2, advantages: [] },
            { ...emptyBackground, id: "cleaver-mask", note:"Cleaver Mask", name: "Mask", predatorTypeFreebiePoints: 2, advantages: [] },
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'bagger-DarkSecret', name: "Dark Secret", freebiePoints: 1, note: "You are a cleaver" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "manipulation", skill: "subterfuge" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Consentualist: {
        name: "Consentualist",
        summary: "Take blood only from the willing",
        backgrounds: [
            { ...emptyBackground, id: "consentualist-herd", note:"consentualist Herd", name: "Herd", freebiePoints: 3, advantages: [] }
        ],
        advantagePoints: 1,
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'consentualist-DarkSecret', name: "Dark Secret", freebiePoints: 1, note: "Masquerade Breacher" },
            { ...emptyMeritFlaw, id: 'consentualist-PreyExclusion', name: "Prey Exclusion", freebiePoints: 1, note: "Can't feed on the non-consenting" },
        ],
        humanityChange: 1,
        huntingPool: { attribute: "manipulation", skill: "persuasion" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Extortionist: {
        name: "Extortionist",
        summary: "Strong-arm prey into giving you their blood",
        backgrounds: [
            { ...emptyBackground, id: "extortionist-resources", note: "Extortionist Resources", name: "Resources", predatorTypeFreebiePoints: 1, advantages: [] },
        ],
        advantagePoints: 1,
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'extortionist-Enemy', name: "Enemy", freebiePoints: 2, note: "(Police or Victim)" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "manipulation", skill: "intimidation" },
        selectableBackground: { options: [
            { ...emptyBackground, id: "extortionist-contacts", note:"Extortoinist Contacts", name: "Contacts", predatorTypeFreebiePoints: 0, sphere: [""], advantages: [] },
            { ...emptyBackground, id: "extortionist-allies", note:"Extortoinist Contacts", name: "Allies", predatorTypeFreebiePoints: 0, sphere: [""], advantages: [] }, 
        ], totalPoints: 3},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Farmer: {
        name: "Farmer",
        summary: "Feed on animals",
        backgrounds: [
            { ...emptyBackground, id: "farmer-haven", note:"Farmer Haven", name: "Haven", predatorTypeFreebiePoints: 2, advantages: [{ ...emptyAdvantage, name: "Zoo", freebiePoints: 2 }] },
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'farmer-Farmer', name: "Farmer", freebiePoints: 2, note: "feeding on non-animal blood costs you 2 willpower" },
        ],
        humanityChange: 1,
        huntingPool: { attribute: "composure", skill: "animal ken" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

        },
    Ferryman: {
        name: "Ferryman",
        summary: "Use your retainers to herd prey",
        backgrounds: [
            { ...emptyBackground, id: "ferryman-allies", note:"Ferryman Retainer", name: "Allies", predatorTypeFreebiePoints: 2, advantages: [{ ...emptyAdvantage, name: "Retainer", freebiePoints: 2 }], sphere: [] }
        ],
        meritsAndFlaws: [],
        humanityChange: 0,
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Graverobber: {
        name: "Graverobber",
        summary: "Feed on fresh corpses and mourning families",
        backgrounds: [
            { ...emptyBackground, id: "graverobber-haven", note:"Graverobber Haven", name: "Haven", predatorTypeFreebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Walk-In Freezer", freebiePoints: 1 }] }
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'graverobber-IronGullet', name: "Iron Gullet", freebiePoints: 3, note: "able to feed on rancid blood" },
            { ...emptyMeritFlaw, id: 'graverobber-ObviousPredator', name: "Obvious Predator", freebiePoints: 2, note: "mortals are scared of you, can't keep Herd" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "wits", skill: "medicine" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Hitcher: {
        name: "Hitcher",
        summary: "Hunt prey on desolate roads",
        backgrounds: [
            { ...emptyBackground, id: "hitcher-haven", note:"Hitcher Haven", name: "Haven", predatorTypeFreebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Garage", freebiePoints: 1 }] },
            { ...emptyBackground, id: "hitcher-resources", note:"Hitcher Resources", name: "Resources", predatorTypeFreebiePoints: 1, advantages: [{ ...emptyAdvantage, name: "Liquidity", freebiePoints: 1 }] }
        ],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'hitcher-PreyExclusion', name: "Prey Exclusion", freebiePoints: 1, note: "Of our choice." },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "wits", skill: "etiquette" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Osiris: {
        name: "Osiris",
        summary: "Feed on your followers",
        backgrounds: [
            { ...emptyBackground, id: "osiris-mask", name: "Mask", predatorTypeFreebiePoints: 2, advantages: [] },
        ],
        meritsAndFlaws: [
        ],
        humanityChange: 0,
        huntingPool: { attribute: "manipulation", skill: "subterfuge" },
        selectableBackground: { options: [
            {...emptyBackground, id: "osiris-herd", name:"Herd" },
            {...emptyBackground, id: "osiris-fame", name:"Fame" }
        ], totalPoints: 3},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    Sandman: {
        name: "Sandman",
        backgrounds: [
        ],
        summary: "Break into homes and feed on sleeping prey",
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'sandman-PreyExclusion', name: "Prey Exclusion", freebiePoints: 1, note: "Conscious Mortals." },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "dexterity", skill: "stealth" },
        selectableBackground: { options: [
            { ...emptyBackground, id: "sandman-mask1", name: "Mask" },
            { ...emptyBackground, id: "sandman-mask2", name: "Mask" },
            { ...emptyBackground, id: "sandman-mask3", name: "Mask" },
            { ...emptyBackground, id: "sandman-mask4", name: "Mask" },
        ], totalPoints: 4},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    "Scene Queen": {
        name: "Scene Queen",
        summary: "Feed in your scene / subculture",
        backgrounds: [
            { ...emptyBackground, id: "sceneQueen-mask", name: "Mask", predatorTypeFreebiePoints: 2, advantages: [] },
            { ...emptyBackground, id: "sceneQueen-fame", name: "Fame", predatorTypeFreebiePoints: 1, advantages: [], note:"Applies to Mask Background" },
            { ...emptyBackground, id: "sceneQueen-herd", name: "Herd", predatorTypeFreebiePoints: 2, advantages: [] },
        ],
        meritsAndFlaws: [],
        humanityChange: 0,
        huntingPool: { attribute: "charisma", skill: "etiquette" },
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [
            { ...emptyMeritFlaw, id: "sceneQueen-enemy", name:"Enemy" },
            { ...emptyMeritFlaw, id: "sceneQueen-boundToTheEarth", name:"Bound to the Earth" },
            { ...emptyMeritFlaw, id: "sceneQueen-eeriePresence", name:"Eerie Presence" },
            { ...emptyMeritFlaw, id: "sceneQueen-folkloricBlock", name:"Folkloric Block" },
            { ...emptyMeritFlaw, id: "sceneQueen-Haunted", name:"Haunted" },
            { ...emptyMeritFlaw, id: "sceneQueen-Stigmata", name:"Stigmata" },
            { ...emptyMeritFlaw, id: "sceneQueen-TroubleMagnet", name:"Trouble Magnet" },
        ], totalPoints: 2},
        selectableSpheres: [],

    },
    Siren: {
        name: "Siren",
        summary: "Seduce prey and take their blood",
        backgrounds: [],
        meritsAndFlaws: [
            { ...emptyMeritFlaw, id: 'siren-Enemy', name: "Enemy", freebiePoints: 2, note: "(spurned lover or jealous partner)" },
        ],
        humanityChange: 0,
        huntingPool: { attribute: "charisma", skill: "subterfuge" },
        selectableBackground: { options: [
            { ...emptyBackground, id: "siren-herd", name: "Herd" },
            { ...emptyBackground, id: "siren-fame", name: "Fame" },
        ], totalPoints: 5},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
    "": {
        name: "",
        summary: "",
        backgrounds: [],
        meritsAndFlaws: [],
        humanityChange: 0,
        selectableBackground: { options: [], totalPoints: 0},
        selectableMeritFlaw: { options: [], totalPoints: 0},
        selectableSpheres: [],

    },
}

export const emptyPredatorType = {
    name: "",
    summary: "",
    backgrounds: [],
    meritsAndFlaws: [],
    humanityChange: 0,
    selectableBackground: { options: [], totalPoints: 0},
    selectableMeritFlaw: { options: [], totalPoints: 0},
    selectableSpheres: [],
}