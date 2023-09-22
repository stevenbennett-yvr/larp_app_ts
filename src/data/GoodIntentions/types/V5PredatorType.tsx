import { z } from "zod";
import { v5BackgroundRefSchema, emptyBackground, emptyAdvantage } from "./V5Backgrounds";
import { v5attributesKeySchema } from "./V5Attributes";
import { v5skillsKeySchema } from "./V5Skills";

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
    meritsAndFlaws: z.object({ name: z.string(), level: z.number().int(), summary: z.string() }).array(),
    humanityChange: z.number().int(),
    huntingPool: huntingPoolSchema.optional(),
})
export type PredatorType = z.infer<typeof predatorTypeSchema>


export const PredatorTypes: Record<PredatorTypeName, PredatorType> = {
    Alleycat: {
        name: "Alleycat",
        summary: "Ambush prey in alleys",
        backgrounds: [
            { ...emptyBackground, id: "alleycat-contacts", name: "Contacts", freebiePoints: 2 },
            { ...emptyBackground, id: "alleycat-resources", name: "Resources", freebiePoints: 1, advantages: [{...emptyAdvantage, name: "Cash Money", freebiePoints: 1}] },
        ],
        meritsAndFlaws: [],
        humanityChange: -1,
        huntingPool: { attribute: "wits", skill: "streetwise"}
    },
    Bagger: {
        name: "Bagger",
        summary: "Feed on blood bags",
        backgrounds: [ 
            {...emptyBackground, id: "bagger-contacts", name: "Contacts", sphere: "underworld", freebiePoints: 2 }
        ],
        meritsAndFlaws: [{ name: "Iron Gullet", level: 3, summary: "able to feed on rancid blood" }, { name: "Enemy", level: 2, summary: "Someone believes you owe them" }],
        humanityChange: 0,
        huntingPool: { attribute:"intelligence", skill:"larceny" }
    },
    Cleaver: {
        name: "Cleaver",
        summary: "Feed on friends and family",
        backgrounds: [
            {...emptyBackground, id: "bagger-cleaver", name:"Herd", freebiePoints:2},
            {...emptyBackground, id: "bagger-cleaver", name:"Mask", freebiePoints:2},
        ],
        meritsAndFlaws: [{ name: "Dark Secret", level: 1, summary: "Cleaver" }],
        humanityChange: 0,
        huntingPool: { attribute:"manipulation", skill: "subterfuge"}
    },
    Consensualist: {
        name: "Consensualist",
        summary: "Take blood only from the willing",
        backgrounds: [
            {...emptyBackground, id: "consensualist-herd", name:"Herd", freebiePoints:3 }
        ],
        meritsAndFlaws: [{ name: "Masquerade Breacher", level: 1, summary: "" }, { name: "Prey Exclusion", level: 1, summary: "Can't feed on the non-consenting" }],
        humanityChange: 1,
        huntingPool: { attribute: "manipulation", skill:"persuasion"},
    },
    Extortionist: {
        name: "Extortionist",
        summary: "Strong-arm prey into giving you their blood",
        backgrounds: [
            {...emptyBackground, id: "extortionist-resources", name: "Resources", freebiePoints:1},
            {...emptyBackground, id: "extortionist-contacts", name: "Contacts"},
            {...emptyBackground, id: "extortionist-allies", name: "Allies"},
        ],
        meritsAndFlaws: [{ name: "Enemy", level: 2, summary: "(Police or Victim)" }],
        humanityChange: 0,
        huntingPool: { attribute: "manipulation", skill: "intimidation"}
    },
    Farmer: {
        name: "Farmer",
        summary: "Feed on animals",
        backgrounds: [
            {...emptyBackground, id: "farmer-haven", name: "Haven", freebiePoints:2, advantages: [{...emptyAdvantage, name: "Zoo", freebiePoints:2}]},
        ],
        meritsAndFlaws: [{ name: "Farmer", level: 2, summary: "feeding on non-animal blood costs you 2 willpower" }],
        humanityChange: 1,
        huntingPool: { attribute: "composure", skill: "animal ken"},        
    },
    Ferryman: {
        name: "Ferryman",
        summary: "Use your retainers to herd prey into your maw for the kill",
        backgrounds: [
            {...emptyBackground, id: "ferryman-ally", name:"Ally", freebiePoints:2, advantages:[{...emptyAdvantage, name:"Retainer", freebiePoints:2}]}
        ],
        meritsAndFlaws: [],
        humanityChange: 0,
    },
    Graverobber: {
        name: "Graverobber",
        summary: "Feed on fresh corpses and mourning families",
        backgrounds: [
            {...emptyBackground, id: "graverobber-haven", name:"Haven", freebiePoints:1, advantages:[{...emptyAdvantage, name:"Walk-In Freezer", freebiePoints:1}]}
        ],
        meritsAndFlaws: [{ name: "Iron Gullet", level: 3, summary: "able to feed on rancid blood" }, { name: "Obvious Predator", level: 2, summary: "mortals are scared of you, can't keep Herd" }],
        humanityChange: 0,
        huntingPool: {attribute:"wits", skill:"medicine"},
    },
    Hitcher: {
        name: "Hitcher",
        summary: "Hunt prey on desolate roads",
        backgrounds: [
                {...emptyBackground, id:"hitcher-haven", name:"Haven", freebiePoints:1, advantages:[{...emptyAdvantage, name:"Garage", freebiePoints:1}]},
                {...emptyBackground, id:"hitcher-resources", name:"Resources", freebiePoints:1, advantages:[{...emptyAdvantage, name:"Goods and Services", freebiePoints:1}]}
            ],
        meritsAndFlaws: [{ name: "Prey Exclusion", level: 1, summary: "" }],
        humanityChange: 0,
        huntingPool: { attribute:"wits", skill:"etiquette"},
    },
    Osiris: {
        name: "Osiris",
        summary: "Feed on your followers",
        backgrounds: [
            {...emptyBackground, id:"osiris-mask", name:"Mask", freebiePoints:2},
        ],
        meritsAndFlaws: [{ name: "Spend these between Enemies and Mythic Flaws", level: 2, summary: "" }],
        humanityChange: 0,
        huntingPool: { attribute:"manipulation",skill:"subterfuge" }
    },
    Sandman: {
        name: "Sandman",
        backgrounds: [
            {...emptyBackground, id:"sandman-mask", name:"Mask", freebiePoints:0},
        ],
        summary: "Break into homes and feed on sleeping prey",
        meritsAndFlaws: [{ name: "Prey Exclusion", level: 1, summary: "Conscious Mortals " }],
        humanityChange: 0,
        huntingPool: { attribute:"dexterity", skill:"stealth"}
    },
    "Scene Queen": {
        name: "Scene Queen",
        summary: "Feed in your scene / subculture",
        backgrounds: [
            {...emptyBackground, id:"sceneQueen-mask", name:"Mask", freebiePoints:2},
            {...emptyBackground, id:"sceneQueen-fame", name:"Fame", freebiePoints:1},
            {...emptyBackground, id:"sceneQueen-herd", name:"Herd", freebiePoints:2},
        ],
        meritsAndFlaws: [],
        humanityChange: 0,
        huntingPool: { attribute:"charisma", skill: "etiquette"},
    },

    Siren: {
        name: "Siren",
        summary: "Seduce prey and take their blood",
        backgrounds: [
            {...emptyBackground, id:"siren-herd", name:"Herd", freebiePoints:0},
            {...emptyBackground, id:"siren-fame", name:"Fame", freebiePoints:0},
        ],
        meritsAndFlaws: [{ name: "Enemy", level: 1, summary: "(spurned lover or jealous partner)" }],
        humanityChange: 0,
        huntingPool: { attribute:"charisma", skill:"subterfuge" }
    },
    "": {
        name: "",
        summary: "",
        backgrounds:[],
        meritsAndFlaws: [],
        humanityChange: 0,
    },
}