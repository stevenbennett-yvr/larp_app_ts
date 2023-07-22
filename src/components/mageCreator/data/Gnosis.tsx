import { z } from "zod";
import { Awakened } from "./Awakened";

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


  export type Gnosis = z.infer<typeof gnosisSchema>;