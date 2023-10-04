import { z } from "zod";
import { Kindred } from "./Kindred";
import { v5xp } from "../V5Experience";
import { getNumberBelow } from "../../../utils/getNumberBelow";

const generationSchema = z.object({
    surgeBonus: z.number(),
    mend: z.number(),
    defnese: z.number(),
    rouseBonus: z.number(),
    baneSeverity: z.number(),
    feedingPenalty: z.string(),
    list: z.string(),
})


export type BloodPotency = z.infer<typeof generationSchema>

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

export const findMaxBloodPotency = (kindred:Kindred) => {
    const bpData = kindred.bloodPotency; // Get the attribute data
    
    const { experiencePoints } = bpData;
    const { level } = v5BloodPotencyLevel(kindred);

    let max = undefined;
    if (level === 5) {
      max = experiencePoints;
    }
    return max;
  };

  type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
export const handleBloodPotencyChange = (kindred: Kindred, setKindred: Function, type: VariableKeys, value: number): void => {
  const { totalXpNeeded, pastXpNeeded } = v5BloodPotencyLevel(kindred);
  let updatedBloodPotency = { ...kindred.bloodPotency };
  if (type === "experiencePoints") {
    let xp = value > kindred.bloodPotency.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value);
    updatedBloodPotency = {
      ...updatedBloodPotency,
      [type]: xp,
    };
  } else {
    updatedBloodPotency = {
      ...updatedBloodPotency,
      [type]: value,
    };
  }
  const updatedAwakened = {
    ...kindred,
    bloodPotency: updatedBloodPotency,
  };
  setKindred(updatedAwakened);
};


export const bloodPotencies: Record<number, BloodPotency> ={
    0: {
        surgeBonus: 1,
        mend: 1,
        defnese: 0,
        rouseBonus: 0,
        baneSeverity: 0,
        feedingPenalty: "",
        list: "<ul><li>Damage is taken as a mortal unless you have Thin-Blood Merit: Vampiric Resilience.</li><li>Rouse your Blood to heal one point of Normal Damage with Thin-Blood Merit: Vampiric Resilience.</li><li>No clan means no Bane Severity.</li><li>No Blood Bonds or ghouls without Thin-Blood Merit: Catenating Blood.</li><li>No Embracing vampires without Thin-Blood Merit: Catenating Blood.</li><li>Susceptible to Hunger Frenzy like true vampires.</li><li>Fear and Rage Frenzy from supernatural effects, or Thin-Blood Flaw: Bestial Temper.</li><li>One point of Normal Damage per turn in direct sunlight.</li></ul>",
    },
    1: {
        surgeBonus: 1,
        mend: 1,
        defnese: 0,
        rouseBonus: 1,
        baneSeverity: 1,
        feedingPenalty: "",
        list: "",
    },
    2: {
        surgeBonus: 1,
        mend: 2,
        defnese: 0,
        rouseBonus: 1,
        baneSeverity: 2,
        feedingPenalty: "Can only Slake 1 Hunger & must Slake from Large animals.",
        list: "",
    },
    3: {
        surgeBonus: 2,
        mend: 2,
        defnese: 0,
        rouseBonus: 2,
        baneSeverity: 3,
        feedingPenalty: "Animal & bagged blood Slakes no hunger",
        list: "",
    },
    4: {
        surgeBonus: 2,
        mend: 3,
        defnese: 1,
        rouseBonus: 2,
        baneSeverity: 3,
        feedingPenalty: "Cannot Slake blood from Sipping from a Human. Can only Slake 1 Hunger per Non Harmful drink",
        list: "",
    },
    5: {
        surgeBonus: 3,
        mend: 3,
        defnese: 1,
        rouseBonus: 3,
        baneSeverity: 4,
        feedingPenalty: "Must drain & kill a human to reduce Hunger below 2.",
        list: "",
    }
}