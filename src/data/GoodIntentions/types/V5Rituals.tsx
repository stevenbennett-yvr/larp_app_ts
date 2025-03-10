import { z } from 'zod';
import { v5DisciplineLevel } from './V5Disciplines';
import { Kindred } from './Kindred';

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
    //1
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
        summary: "This type of ward guards against ghoul trespassers.",
        rouseChecks: 1,
        requiredTime: "5min",
        dicePool: "",
        ingredients: "",
        level: 1,
    },
    //2
    {
        name: "Illuminate the Trail of Prey",
        summary: "Allows the caster to follow the trail of a specific person.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "Wits + Occult vs. Composure + Resolve",
        ingredients: "A white satin ribbon",
        level: 2,
    },
    {
        name: "Instantaneous Materialization",
        summary: "This Ritual allows the caster to magically teleport one pre-prepared object to her hand instantly from anywhere within the city.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "One item no larger than a guitar case, leaves from an ash tree.",
        level: 2,
    },
    {
        name: "Ward Against Spirits",
        summary: "This type of ward guards against spirit (wraiths, spectres, umbral spirits) trespassers.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "A handful of salt.",
        level: 2,
    },
    {
        name: "Phantom Whispers",
        summary: "Leave behind an auditory message to be triggered by a specific person or next person to touch an object or tread upon a specific place.",
        rouseChecks: 1,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "Ground-up dust of a conch shell.",
        level: 2,
    },
    {
        name: "Warding Circle Against Ghouls",
        summary: "This type of warding circle guards against ghoul trespassers.",
        rouseChecks: 3,
        requiredTime: "10min",
        dicePool: "",
        ingredients: "human bone, dipped in the blood",
        level: 2,
    },
    //3
    {
        name: "Dagon's Call",
        summary: "This allows the ritualist to cause the blood vessels of a character who has been exposed to her Blood that night to rupture from afar.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "Resolve + Occult vs. Stamina + Resolve",
        ingredients: "A Ritual dagger inlaid with gold leaf",
        level: 3,
    },
    {
        name: "Firewalker",
        summary: "This allows the ritualist to have temporary protection against fire.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "One of the caster’s fingertips, a chalice inlaid with gold",
        level: 3,
    },
    {
        name: "Perfect Forgery",
        summary: "This Ritual allows the caster to touch an object and create a perfect simulacrum of it moments later.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "Liquid silver and a mirror ground to dust",
        level: 3,
    },
    {
        name: "Ward Against Shifters",
        summary: "This type of ward guards against werewolves and other were-creature trespassers.",
        rouseChecks: 1,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "A handful of silver dust",
        level: 3,
    },
    {
        name: "Warding Circle Against Spirits",
        summary: "This type of warding circle guards against spirit trespassers.",
        rouseChecks: 3,
        requiredTime: "15min",
        dicePool: "",
        ingredients: "A human bone, dipped in blood",
        level: 3,
    },
    //4
    {
        name: "Defense of the Sacred Haven",
        summary: "This Ritual allows the caster to mystically protect her haven from intruding sunlight and to alert her should trespassers attempt to break in.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "A number of rouse checks equal to Haven size",
        level: 4,
    },
    {
        name: "Defense of the Sacred Haven",
        summary: "This Ritual allows the caster to mystically protect her haven from intruding sunlight and to alert her should trespassers attempt to break in.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "A number of rouse checks equal to Haven size",
        level: 4,
    },
    {
        name: "Incorporeal Passage",
        summary: "The caster's form becomes ghost-like.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "A mirror",
        level: 4,
    },
    {
        name: "Splinter Servant",
        summary: "This Ritual allows the caster to magically animate a ritually-prepared stake to attack a target on its own.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "A stake from a tree planted in a cemetery, wax, and twine steeped in nightshade",
        level: 4,
    },
    {
        name: "Ward Against Cainites",
        summary: "This type of ward guards against vampires.",
        rouseChecks: 1,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "Ash warm from a still-burning fire",
        level: 4,
    },
    {
        name: "Warding Circle Against Shifters",
        summary: "This type of warding circle guards against werewolves and were-creature trespassers.",
        rouseChecks: 3,
        requiredTime: "20min",
        dicePool: "",
        ingredients: "A silver knife dipped in a mixture of Blood and wolfsbane",
        level: 4,
    },
    //5
    {
        name: "Blade of Eternal Thirst",
        summary: "This Ritual allows the caster to ensorcel a bladed weapon to steal blood from its victims.",
        rouseChecks: 1,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "A dagger carved from a human bone",
        level: 5,
    },
    {
        name: "Cobra's Favor",
        summary: "This Ritual allows the ritualist to enchant her own Blood, transforming it into a powerful toxin.",
        rouseChecks: 1,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "An herbal poultice and the venom of a snake",
        level: 5,
    },
    {
        name: "Escape to True Sanctuary",
        summary: "The ritualist can create two mystic circles that allow her one-way instantaneous travel between the two locations.",
        rouseChecks: 1,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "Two charred circles, drawn three feet in diameter, consecrated in Blood over three days",
        level: 5,
    },
    {
        name: "Shaft of Belated Dissolution",
        summary: "A stake enchanted with this Ritual intentionally splinters upon use, with the splinter burrowing to the target's heart on its own.",
        rouseChecks: 2,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "A mundane stake carved from rowan wood",
        level: 5,
    },
    {
        name: "Warding Circle Against Cainites",
        summary: ": This type of warding circle guards against vampires other than the caster.",
        rouseChecks: 3,
        requiredTime: "25min",
        dicePool: "",
        ingredients: "The ritualist inscribes the warding circle with a rowan stick dipped in a mixture of Blood and warm ash from a still-burning fire. ",
        level: 5,
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

export const cleanRituals = (kindred:Kindred) => {
    let updatedRituals = kindred.rituals.filter((r:RitualRef) => {
        let ritualInfo = Rituals.find((rd) => rd.name === r.name);
        if (!ritualInfo) {
            return false; // Filter out rituals with missing info
        }
        return ritualInfo.level < v5DisciplineLevel(kindred, "blood sorcery").level;
    });
    return updatedRituals
}