import { z } from "zod";
import { Awakened } from "./Awakened";
import { getNumberBelow } from "../../../utils/getNumberBelow";

export const gnosisSchema = z.object({
    creationPoints: z.number().min(1).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
  });

export const currentGnosisLevel = (awakened: Awakened) => {
    let { creationPoints, experiencePoints } = awakened.gnosis
    let totalXpNeeded = 0
    let pastXpNeeded = [0]
    let level = 1
    if (experiencePoints === 0){
      level += (creationPoints/3);
      let totalXpNeeded = (level + 1) * 8;
      pastXpNeeded.push(totalXpNeeded)
      return {level, totalXpNeeded, pastXpNeeded};
    }
    else {
      level += (creationPoints/3);
      let xpNeeded = (level + 1) * 8;
      totalXpNeeded += xpNeeded;
      pastXpNeeded.push(totalXpNeeded)
      while (experiencePoints >= xpNeeded) {
        level++
        experiencePoints -= xpNeeded
        xpNeeded = (level + 1) * 8;
        totalXpNeeded += xpNeeded
        pastXpNeeded.push(totalXpNeeded)
      }
      return {level, totalXpNeeded, pastXpNeeded}
    }
  } 

  export const findMaxGnosis = (awakened: Awakened) => {
    const gnosisData = awakened.gnosis; // Get the attribute data
    
    const { experiencePoints } = gnosisData;
    const { level } = currentGnosisLevel(awakened);

    let max = undefined;
    if (level === 6) {
      max = experiencePoints;
    }
    return max;
  };

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
export const handleGnosisChange = (awakened: Awakened, setAwakened: Function, type: VariableKeys, value: number): void => {
  const { totalXpNeeded, pastXpNeeded } = currentGnosisLevel(awakened);
  let updatedGnosis = { ...awakened.gnosis };
  if (type === "experiencePoints") {
    let xp = value > awakened.gnosis.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value);
    updatedGnosis = {
      ...updatedGnosis,
      [type]: xp,
    };
  } else {
    updatedGnosis = {
      ...updatedGnosis,
      [type]: value,
    };
  }
  const updatedAwakened = {
    ...awakened,
    gnosis: updatedGnosis,
  };
  setAwakened(updatedAwakened);
};

  export type Gnosis = z.infer<typeof gnosisSchema>;


  export const gnosisAdvantageSchema = z.object({
    mana: z.string(),
    activeSpells: z.number(),
    aura: z.string(),
    paradoxPool: z.number(),
    extendedCasting: z.string(),
    combinedSpells: z.number(),
    legacy: z.string(),
    aimedSpell: z.string(),
    arcanaMastery: z.number().array()
  });

  type GnosisAdvantage = z.infer<typeof gnosisAdvantageSchema>

export const Gnoses: Record<number, GnosisAdvantage> = {
  1: {
    mana: "10/1",
    activeSpells: 4,
    aura: "",
    paradoxPool: 1,
    extendedCasting: "3 hours/10 min",
    combinedSpells: 0,
    legacy: "No",
    aimedSpell: "10/20/40",
    arcanaMastery: [3, 3, 3, 3, 2, 2, 2, 1, 1, 1]
  },
  2: {
    mana: "11/2",
    activeSpells: 5,
    aura: "",
    paradoxPool: 1,
    extendedCasting: "3 hours/20 min",
    combinedSpells: 0,
    legacy: "No",
    aimedSpell: "20/40/80",
    arcanaMastery: [4, 4, 3, 3, 3, 2, 2, 2, 1, 1]
  },
  3: {
    mana: "12/3",
    activeSpells: 6,
    aura: "",
    paradoxPool: 2,
    extendedCasting: "1 hour/30 min",
    combinedSpells: 2,
    legacy: "Join",
    aimedSpell: "30/60/120",
    arcanaMastery: [5, 4, 4, 3, 3, 3, 3, 2, 2, 1]
  },
  4: {
    mana: "13/4",
    activeSpells: 7,
    aura: "",
    paradoxPool: 2,
    extendedCasting: "1 hour/40 min",
    combinedSpells: 2,
    legacy: "Create",
    aimedSpell: "40/80/160",
    arcanaMastery: [5, 5, 4, 4, 3, 3, 3, 2, 2, 2]
  },
  5: {
    mana: "14/5",
    activeSpells: 8,
    aura: "",
    paradoxPool: 3,
    extendedCasting: "30 min/50 min",
    combinedSpells: 2,
    legacy: "Create",
    aimedSpell: "50/100/200",
    arcanaMastery: [5, 5, 5, 4, 4, 3, 3, 3, 2, 2]
  },
  6: {
    mana: "15/6",
    activeSpells: 9,
    aura: "+1",
    paradoxPool: 3,
    extendedCasting: "30 min/1 hour",
    combinedSpells: 3,
    legacy: "Create",
    aimedSpell: "60/120/200",
    arcanaMastery: [6, 5, 5, 5, 4, 3, 3, 3, 3, 2]
  }
}