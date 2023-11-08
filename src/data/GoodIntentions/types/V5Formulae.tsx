import { z } from 'zod';
import { allPowers } from './V5Powers';
import { Kindred } from './Kindred';
import { v5DisciplineLevel } from './V5Disciplines';

export const formulaSchema = z.object({
    name: z.string(),
    summary: z.string(),
    rouseChecks: z.number().min(0).int(),
    ingredients: z.string(),
    dicePool: z.string(),
    level: z.number().min(1).int(),
    duration: z.string(),
})
export type Formula = z.infer<typeof formulaSchema>

export const Formulae: Formula[] = [
    {
        name:"Far Reach",
        summary: "You’ve learned a Formula that can give you supercharged telekinetic abilities for a short amount of time.",
        ingredients: "Alchemist's Blood, Choleric blood",
        rouseChecks: 1,
        dicePool: "Resolve + Science vs. Strength + Athletics",
        level: 1,
        duration: "10m"
    },
    {
        name:"Haze",
        summary: "This Formula allows you to create a thick, hazy fog on demand, obscuring a room or those within it.",
        ingredients: "Alchemist's Blood, Phlegmatic blood",
        rouseChecks: 1,
        dicePool: "",
        level: 1,
        duration: "Once scene"
    },
    ...allPowers.filter(power=>power.level===1).map(power => (
        {
        name: `Counterfeit ${power.name}`,
        summary: `Blood alchemists with two dots of Blood Alchemy may develop Formulae that counterfeits ${power.name}.`,
        ingredients: `Alchemist's Blood, Blood Resonance listed for the Discipline ${power.discipline}`,
        rouseChecks: 0,
        dicePool: "As per Power",
        level: power.level + 1, // You can adjust the level as needed
        duration: "As per Power",
      })),
    {
        name:"Envelop",
        summary: "You have learned a Formula to collect those tiny bits of mist from the air around you and coalesce them into something you can direct. ",
        ingredients: "Alchemist's Blood, Melancholic blood, Phlegmatic blood",
        rouseChecks: 1,
        dicePool: "Wits + Science vs. Stamina + Survival",
        level: 2,
        duration: "15m"
    },
    ...allPowers.filter(power=>power.level===2).map(power => (
        {
        name: `Counterfeit ${power.name}`,
        summary: `Blood alchemists with three dots of Blood Alchemy may develop Formulae that counterfeits ${power.name}.`,
        ingredients: `Alchemist's Blood, Blood Resonance listed for the Discipline ${power.discipline}`,
        rouseChecks: 0,
        dicePool: "As per Power",
        level: power.level + 1, // You can adjust the level as needed
        duration: "As per Power",
      })),
    {
        name:"Defractionate",
        summary: "You’ve developed a solution to the problem of a tasteless bloodbag—a Formula that lets anyone feed from a blood bag as if it’s from a human body. It may not taste as good, but it gets the job done.",
        ingredients: "Alchemist's Blood, Sanguine blood, Melancholic blood",
        rouseChecks: 0,
        dicePool: "Wits + Science vs. Stamina + Survival",
        level: 3,
        duration: "24hours or indefinite if refrigerated"
    },
    ...allPowers.filter(power=>power.level===3).map(power => (
        {
        name: `Counterfeit ${power.name}`,
        summary: `Blood alchemists with four dots of Blood Alchemy may develop Formulae that counterfeits ${power.name}.`,
        ingredients: `Alchemist's Blood, Blood Resonance listed for the Discipline ${power.discipline}`,
        rouseChecks: 0,
        dicePool: "As per Power",
        level: power.level + 1, // You can adjust the level as needed
        duration: "As per Power",
      })),
    ...allPowers.filter(power=>power.level===4).map(power => (
        {
        name: `Counterfeit ${power.name}`,
        summary: `Blood alchemists with five dots of Blood Alchemy may develop Formulae that counterfeits ${power.name}.`,
        ingredients: `Alchemist's Blood, Blood Resonance listed for the Discipline ${power.discipline}`,
        rouseChecks: 0,
        dicePool: "As per Power",
        level: power.level + 1, // You can adjust the level as needed
        duration: "As per Power",
      })),
    {
        name:"Awaken the Sleeper",
        summary: "With this Formula, Blood Potency no longer matters; you can force anyone awake from a Torpid state. ",
        ingredients: "Alchemist's Blood, Choleric blood, Sanguine blood",
        rouseChecks: 0,
        dicePool: "",
        level: 5,
        duration: "24hours or indefinite if refrigerated"
    },
]

export const formulaRefSchema = z.object({
    name: z.string(),
    creationPoints: z.number().min(0).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
})

export type FormulaRef = z.infer<typeof formulaRefSchema>

export const formulaRefs: FormulaRef[] = Formulae.map((formula) => ({
    name: formula.name,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
}))

export const cleanFormulae = (character:Kindred) => {
    let updatedFormulae = character.formulae.filter((c) => {
        let formulaInfo = Formulae.find((fd) => fd.name === c.name);
        if (!formulaInfo) {
            return false; // Filter out rituals with missing info
        }
        return formulaInfo.level < v5DisciplineLevel(character, "thin-blood alchemy").level;
    });
    return updatedFormulae
}