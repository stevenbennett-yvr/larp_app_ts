import { z } from 'zod';
import { Kindred } from './Kindred';
import { v5DisciplineLevel } from './V5Disciplines';

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
    //1
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
        summary: "This Ceremony allows a necromancer to sense the presence of corpses and immediately identify their time and cause of death.",
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
    //2
    {
        name: "Awaken Homuncular Servant",
        summary: "This Ceremony allows the Oblivion to create and control a Homunculus made from corpse parts.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "Body parts or an animal carcass, the weapon used to kill the aforementioned person or animal, and the evacuated bodily fluids present at the animal or human's death",
        level: 2,
    },
    {
        name: "Blinding the Alloy Eye",
        summary: "With aid from spirits of the dead, this Ceremony makes it impossible to electronically surveil the caster.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "A small piece of aluminum mesh",
        level: 2,
    },
    {
        name: "Compel Spirit",
        summary: "This Ceremony allows the Oblivion user to control and dominate a wraith.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "An unbroken mirror. The target Wraith's attention.",
        level: 2,
    },
    {
        name: "Sin Eater",
        summary: " This Ceremony allows the necromancer to Slake Hunger when other vampires nearby gain Stains.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "The destroyed and burnt remnants of an obvious religious item.",
        level: 2,
    },
    //3
    {
        name: "Black Blood",
        summary: "This Ceremony allows the Oblivion user to deaden the life-giving properties of her own Blood to the point that those who would feed from her Slake no Hunger.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "Nightshade and squid ink.",
        level: 3,
    },
    {
        name: "Chill of Oblivion",
        summary: "This Ceremony allows the Oblivion user to snuff out small fires and deaden himself to the effects of Terror Frenzy.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "A one-foot cube of ice.",
        level: 3,
    },
    {
        name: "Forsaken Edifice",
        summary: "This Ceremony allows the Oblivion user to infuse a location with the numbing aura of the dead lands, concealing it from mundane notice.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "Mushroom seeds, moonflower seeds, and a building empty of all inhabitants",
        level: 3,
    },
    {
        name: "Shambling Hordes",
        summary: "This Ceremony allows the Oblivion user to animate corpses into mindless warriors.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "A number of human corpses, up to the necromancer’s dots in Oblivion, and a living mortal sacrifice.",
        level: 3,
    },
    //4
    {
        name: "Bastone Diabolico",
        summary: "This Ceremony allows the Oblivion user to create a weapon that is proficient in harming wraiths and zombies.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "Human thigh bone.",
        level: 4,
    },
    {
        name: "Bind Spirit",
        summary: "This Ceremony allows the Oblivion user to anchor a powerful wraith to a location or to permanently torment an enemy.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "A wraith’s fetter and sufficient salt to surround a location",
        level: 4,
    },
    {
        name: "Faces of the Dead",
        summary: "This Ceremony allows the necromancer to don the skin of a human creating a perfect disguise.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "An obsidian dagger and either a freshly-dead corpse with no damage to the skin or a live person",
        level: 4,
    },
    {
        name: "Heart's Bane",
        summary: "Once complete, this Ceremony imbues any sharp item the caster touches with the ability to stake a vampire, while enhancing the caster’s accuracy with a wooden stake.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "a needle made of bone, and a human eye",
        level: 4,
    },
    //5
    {
        name: "Ethereal Horde",
        summary: "This Ceremony creates a spirit beacon that summons all wraiths in a one mile radius.",
        rouseChecks: 1,
        requiredTime: "one complete evening",
        dicePool: "",
        ingredients: "A human skull from a human sacrifice engraved with arcane sigils and runes",
        level: 5,
    }, 
    {
        name: "Chalchiuhtotolin’s Judgment",
        summary: "More commonly called the Curse of the Jade Turkey, this Ceremony levies a wasting disease on its target.",
        rouseChecks: 1,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "A dagger made of obsidian or flint, a clay pot of rotting fruit, and an item personal to the target victim",
        level: 5,
    }, 
    {
        name: "Alone in the Dark",
        summary: "This Ceremony allows the necromancer to remove lingering effects left behind when interacting with the world of the living",
        rouseChecks: 1,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "A tub of saltwater",
        level: 5,
    }, 
    {
        name: "Avatar of Rot",
        summary: "This Ceremony allows the Oblivion user to emulate waves of decay and entropy, rotting nearby inanimate objects and thwarting restorative effects",
        rouseChecks: 1,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "At least one pound of rotting flesh, as well as a few ounces of nightshade, hemlock, snakeroot, and the fresh stomach of a medium-sized animal or mortal",
        level: 5,
    }, 
]

export const ceremonyRefs: CeremonyRef[] = Ceremonies.map((ceremony) => ({
    name: ceremony.name,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
}))

export const cleanCeremonies = (character:Kindred) => {
    let updatedCeremonies = character.ceremonies.filter((c) => {
        let ceremonyInfo = Ceremonies.find((cd) => cd.name === c.name);
        if (!ceremonyInfo) {
            return false; // Filter out rituals with missing info
        }
        return ceremonyInfo.level < v5DisciplineLevel(character, "oblivion").level;
    });
    return updatedCeremonies
}