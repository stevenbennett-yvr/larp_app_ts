import { z } from 'zod';

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
    {
        name:"Counterfeit Power (Level 1)",
        summary: "Blood alchemists with two dots of Blood Alchemy may develop Formulae that counterfeit Level 1 Discipline powers.",
        ingredients: "Alchemist's Blood, Blood Resonance listed for the Discipline from which the counterfeit power belongs.",
        rouseChecks: 0,
        dicePool: "As per Power",
        level: 2,
        duration: "As per Power"
    },
    {
        name:"Envelop",
        summary: "You have learned a Formula to collect those tiny bits of mist from the air around you and coalesce them into something you can direct. ",
        ingredients: "Alchemist's Blood, Melancholic blood, Phlegmatic blood",
        rouseChecks: 1,
        dicePool: "Wits + Science vs. Stamina + Survival",
        level: 2,
        duration: "15m"
    },
    {
        name:"Counterfeit Power (Level 2)",
        summary: "Blood alchemists with three dots of Blood Alchemy may develop Formulae that counterfeit Level 2 Discipline powers.",
        ingredients: "Alchemist's Blood, Blood Resonance listed for the Discipline from which the counterfeit power belongs.",
        rouseChecks: 0,
        dicePool: "As per Power",
        level: 3,
        duration: "As per Power"
    },
    {
        name:"Defractionate",
        summary: "You’ve developed a solution to the problem of a tasteless bloodbag—a Formula that lets anyone feed from a blood bag as if it’s from a human body. It may not taste as good, but it gets the job done.",
        ingredients: "Alchemist's Blood, Sanguine blood, Melancholic blood",
        rouseChecks: 0,
        dicePool: "Wits + Science vs. Stamina + Survival",
        level: 3,
        duration: "24hours or indefinite if refrigerated"
    },
    {
        name:"Counterfeit Power (Level 3)",
        summary: "Blood alchemists with four dots of Blood Alchemy may develop Formulae that counterfeit Level 3 Discipline powers.",
        ingredients: "Alchemist's Blood, Blood Resonance listed for the Discipline from which the counterfeit power belongs, a drop of Blood from a vampire who possesses at least one dot in the counterfeit Discipline or from whom the Discipline is in-clan.",
        rouseChecks: 0,
        dicePool: "As per Power",
        level: 4,
        duration: "As per Power"
    },
    {
        name:"Counterfeit Power (Level 4)",
        summary: "Blood alchemists with five dots of Blood Alchemy may develop Formulae that counterfeit Level 4 Discipline powers.",
        ingredients: "Alchemist's Blood, Blood Resonance listed for the Discipline from which the counterfeit power belongs, a drop of Blood from a vampire who possesses at least one dot in the counterfeit Discipline or from whom the Discipline is in-clan.",
        rouseChecks: 0,
        dicePool: "As per Power",
        level: 5,
        duration: "As per Power"
    },
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