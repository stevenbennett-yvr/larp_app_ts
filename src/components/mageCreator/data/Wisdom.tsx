import {z} from "zod";
import { Awakened } from "./Awakened";
import { getNumberBelow } from "./utils";

export const wisdomSchema = z.object({
    creationPoints: z.number().default(7),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
  });
  
  export type Wisdom = z.infer<typeof wisdomSchema>;

  export const wisdomAdvantageSchema = z.object({
    spiritMod: z.number(),
    abyssMod: z.number(),
    diceRoll: z.number(),
    bedlamDuration: z.string(),
    paradoxDuration: z.string(),
    hubris: z.string(),
  });

  type WisdomAdvantage = z.infer<typeof wisdomAdvantageSchema>

export const Wisdoms: Record<number, WisdomAdvantage> = {
  1: {
    spiritMod: -1,
    abyssMod: -1,
    diceRoll: 2,
    bedlamDuration: "2 Days",
    paradoxDuration: "1 Month",
    hubris: "Stealing a soul. Utter perversion, heinous act (mass murder).",
  },
  2: {
    spiritMod: -1,
    abyssMod: -1,
    diceRoll: 2,
    bedlamDuration: "24 Hours",
    paradoxDuration: "1 Week",
    hubris: "Intentionally preventing an Awakening. Using magic to murder someone. Casual/callous crime (serial murder).",

  },
  3: {
    spiritMod: 0,
    abyssMod: 0,
    diceRoll: 2,
    bedlamDuration: "12 Hours",
    paradoxDuration: "2 Days",
    hubris: "Forcefully abducting and/or exiling another person (mage or Sleeper) into the Shadow Realm, or causing her to become possessed by a spirit against her will. Planned crime without using magic (murder).",

  },
  4: {
    spiritMod: 0,
    abyssMod: 0,
    diceRoll: 3,
    bedlamDuration: "2 Hours",
    paradoxDuration: "24 Hours",
    hubris: "Using magic to harm someone. Draining another’s Mana against his will. Creating a soul stone (and hence, limiting one’s Gnosis potential; see “Soul Stones,” p.277). Impassioned crime (manslaughter).	",

  },
  5: {
    spiritMod: 0,
    abyssMod: 0,
    diceRoll: 3,
    bedlamDuration: "One Scene",
    paradoxDuration: "One Scene",
    hubris: "Magically transforming a person into a lesser being (turning a man into a pig) against his will. Intentional, mass property damage (arson).",
  },
  6: {
    spiritMod: 0,
    abyssMod: 0,
    diceRoll: 3,
    bedlamDuration: "One Scene",
    paradoxDuration: "One Scene",
    hubris: "Forcibly binding an unwilling sentient being or spirit to a place (such as through Mind or Spirit magic) or task (such as casting a Fate geas upon a subject). Grand theft (burglary).",
  },
  7: {
    spiritMod: 0,
    abyssMod: 0,
    diceRoll: 4,
    bedlamDuration: "One Scene",
    paradoxDuration: "One Scene",
    hubris: "Laying a curse on someone. Petty theft (shoplifting).",
  },
  8: {
    spiritMod: 0,
    abyssMod: 0,
    diceRoll: 4,
    bedlamDuration: "One Scene",
    paradoxDuration: "One Scene",
    hubris: "Magically coercing another so that he violates his own moral code (i.e., he is forced to make a degeneration roll). Injury to another (accidental or otherwise).",
  },
  9: {
    spiritMod: 1,
    abyssMod: 1,
    diceRoll: 5,
    bedlamDuration: "One Scene",
    paradoxDuration: "One Scene",
    hubris: "Magically coercing another so that he acts against his own free will (he does not want to perform the actions the magic makes him do). Minor selfish act (with holding charity).",
  },
  10: {
    spiritMod: 1,
    abyssMod: 1,
    diceRoll: 5,
    bedlamDuration: "One Scene",
    paradoxDuration: "One Scene",
    hubris: "Using magic to accomplish a task that could be achieved just as well without it (i.e., boiling tea with Forces instead using the nearby stove). Selfish thoughts.",
  }
}

export const currentWisdomLevel = (awakened: Awakened) => {
    let { creationPoints, freebiePoints, experiencePoints } = awakened.wisdom
    let totalXpNeeded = 0
    let pastXpNeeded = [0]
    let level = creationPoints + freebiePoints
    if (experiencePoints === 0){
      let totalXpNeeded = (level + 1) * 3;
      pastXpNeeded.push(totalXpNeeded)
      return {level, totalXpNeeded, pastXpNeeded}
    } else {
      let xpNeeded = (level + 1) * 3;
      totalXpNeeded += xpNeeded
      pastXpNeeded.push(totalXpNeeded)
      while (experiencePoints >= xpNeeded) {
        level++
        experiencePoints -= xpNeeded
        xpNeeded = (level + 1) * 3;
        totalXpNeeded += xpNeeded
        pastXpNeeded.push(totalXpNeeded)
      }
      return {level, totalXpNeeded, pastXpNeeded}
    }
  }

export const findMaxWisdom = (awakened: Awakened) => {
    const { experiencePoints } = awakened.wisdom;
    const { level } = currentWisdomLevel(awakened);
  
    let max = undefined;
    if (level === 10) {
      max = experiencePoints;
    }
    return max;
  };

  type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
  export const handleWisdomChange = (awakened: Awakened, setAwakened: Function, type: VariableKeys, value: number): void => {
    const { totalXpNeeded, pastXpNeeded } = currentWisdomLevel(awakened);
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
  