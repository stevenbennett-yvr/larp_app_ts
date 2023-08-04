import { z } from "zod";
import { Awakened } from "./Awakened";
import ArcanumDeath from '../resources/arcanum/ArcanumDeath.webp';
import ArcanumFate from '../resources/arcanum/ArcanumFate.webp';
import ArcanumForces from '../resources/arcanum/ArcanumForces.webp';
import ArcanumLife from '../resources/arcanum/ArcanumLife.webp';
import ArcanumMatter from '../resources/arcanum/ArcanumMatter.webp';
import ArcanumMind from '../resources/arcanum/ArcanumMind.webp';
import ArcanumPrime from '../resources/arcanum/ArcanumPrime.webp';
import ArcanumSpace from '../resources/arcanum/ArcanumSpace.webp';
import ArcanumSpirit from '../resources/arcanum/ArcanumSpirit.webp';
import ArcanumTime from '../resources/arcanum/ArcanumTime.webp';
import {currentGnosisLevel} from './Gnosis'
import { getNumberBelow } from "./utils";

export const arcanumSchema = z.object({
    type: z.union([
        z.literal("Ruling"),
        z.literal("Inferior"),
        z.literal("Common")
    ]),
    creationPoints: z.number().min(0).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
})

export type Arcanum = z.infer<typeof arcanumSchema>

export const arcanaSchema = z.object({
    death: arcanumSchema,
    fate: arcanumSchema,
    forces: arcanumSchema,
    life: arcanumSchema,
    matter: arcanumSchema,
    mind: arcanumSchema,
    prime: arcanumSchema,
    space: arcanumSchema,
    spirit: arcanumSchema,
    time: arcanumSchema,
})

export type Arcana = z.infer<typeof arcanaSchema>;
export const arcana: ArcanaKey[] =  [  "prime", "forces", "fate", "time", "mind", "space", "spirit", "life", "death", "matter" ]

export const arcanaKeySchema = arcanaSchema.keyof()
export type ArcanaKey = z.infer<typeof arcanaKeySchema>

export type ArcanaDescription = {
  name: string;
  summary: string;
  realm: string;
  attunement: string;
  logo: string;
  color: string;
};

export const arcanaDescriptions: Record<ArcanaKey, ArcanaDescription> = {
    death: {
        name: "Death",
        summary: "Death is a powerful Arcanum that allows mages to control darkness, decay, ghosts, and the soul. It grants them mastery over the primal and frightening mysteries of death.",
        realm: "Stygia",
        attunement: "Subtle",
        logo: ArcanumDeath,
        color: "#705746"
    },
    fate: {
        name: "Fate",
        summary: `Fate is an Arcanum that grants mages the power to manipulate destiny, create fortune or misfortune, and impose oaths, blessings, and curses. It allows them to control the threads of fate and influence the course of events.`,
        realm: "Arcadia",
        attunement: "Subtle",
        logo: ArcanumFate,
        color: "#469990"
    },
    forces: {
        name: "Forces",
        summary: `Forces is an Arcanum that encompasses the manipulation of light, heat, energy, and the fundamental forces of the universe. It grants mages control over elements, physics, and natural phenomena, allowing them to command storms, tides, and even harness the power of the atom.`,
        realm: "Aether",
        attunement: "Gross",
        logo: ArcanumForces,
        color: "#EE8130"
    },
    life: {
        name: "Life",
        summary: "Life is the Arcanum that governs the vital essence and animation of living beings. It allows mages to heal, transform, and manipulate life forms, from curing diseases and mending injuries to enhancing physical abilities and altering appearances. It encompasses the power to control the processes of life, including its acceleration, deceleration, and reversal.",
        realm: "Primal Wild",
        attunement: "Gross",
        logo: ArcanumLife,
        color: "#7AC74C"
    },
    matter: {
        name: "Matter",
        summary: "Matter is the Arcanum that governs the manipulation of inanimate material in the world. It grants mages the ability to control and transmute raw elements, alloys, and various substances, ranging from water and wood to metals and polymers. With mastery over Matter, mages can shape and transform the building blocks of the physical world according to their will.",
        realm: "Stygia",
        attunement: "Gross",
        logo: ArcanumMatter,
        color: "#B6A136"
    },
    mind: {
        name: "Mind",
        summary: "Mind is the Arcanum that delves into the realm of thoughts, emotions, and the shared consciousness of all beings capable of perception and cognition. It allows mages to connect with the universal mind and explore concepts such as communication, telepathy, mental projection, and even control over the thoughts and actions of others.",
        realm: "Pandemonium",
        attunement: "Subtle",
        logo: ArcanumMind,
        color: "#F95587"
    },
    prime: {
        name: "Prime",
        summary: "Prime is the Arcanum that encompasses the fundamental essence of magic itself. It is the energy that flows through all things in the material world, serving as the foundation for all magical practices.",
        realm: "Aether",
        attunement: "Subtle",
        logo: ArcanumPrime,
        color: "#6F35FC"
    },
    space: {
        name: "Space",
        summary: "Space is the Arcanum that governs the connections and relationships between objects, people, and places. It allows mages to bridge distances, perceive distant locations, create mystical links through sympathy, and protect spaces with powerful wards.",
        realm: "Pandemonium",
        attunement: "Gross",
        logo: ArcanumSpace,
        color: "#A98FF3"
    },
    spirit: {
        name: "Spirit",
        summary: "The Spirit Arcanum grants mages the ability to interact with and understand the spiritual realms, serving as intermediaries between different planes of existence.",
        realm: "Primal Wild",
        attunement: "Subtle",
        logo: ArcanumSpirit,
        color: "#C22E28"
    },
    time: {
        name: "Time",
        summary: "The Time Arcanum grants mages the ability to manipulate the flow of time, allowing them to engage in divination, foresee prophecies, and control the speed at which events unfold. It is a complex Arcanum that enables mages to redefine the interaction of other Arcana with the linear progression of events.",
        realm: "Arcadia",
        attunement: "Gross",
        logo: ArcanumTime,
        color: "#A33EA1"
    },
}
  
export const emptyArcana: Arcana = {
    death: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    fate: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    forces: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    life: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    matter: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    mind: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    prime: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    space: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    spirit: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    time: {type:"Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
}

export const currentArcanumLevel = (awakened:Awakened, arcanum:ArcanaKey) => {
    const { creationPoints, freebiePoints, experiencePoints, type } = awakened.arcana[arcanum]
    let xp = experiencePoints
    let totalXpNeeded = 0
    let pastXpNeeded = [0]
    if (xp === 0) {
      let level = creationPoints + freebiePoints;
      let totalXpNeeded = (level + 1) * (type==="Ruling"? 6: type==="Inferior"? 8: 7);
      pastXpNeeded.push(totalXpNeeded)
      return {level, totalXpNeeded, pastXpNeeded};
    } 
    else {
      let level = creationPoints + freebiePoints;
      let xpNeeded = (level + 1) * (type==="Ruling"? 6: type==="Inferior"? 8: 7);
      totalXpNeeded += xpNeeded
      pastXpNeeded.push(totalXpNeeded)
      while (xp >= xpNeeded) {
        level++;
        xp -= xpNeeded;
        xpNeeded = (level + 1) * (type==="Ruling"? 6: type==="Inferior"? 8: 7);
        totalXpNeeded += xpNeeded
        pastXpNeeded.push(totalXpNeeded)
      }
      return {level, totalXpNeeded, pastXpNeeded};
    }
  }

  //
  export const getArcanaLevels = (awakened: Awakened): number[] => {
    const arcana = awakened.arcana; // Use 'arcana' instead of 'arcanas'
    const levelArray: number[] = [];
    Object.keys(arcana).forEach((arcanum) => {
        let arcanumName = arcanum as ArcanaKey 
        const level = currentArcanumLevel(awakened, arcanumName).level;
        levelArray.push(level);
    });
    levelArray.sort((a, b) => b - a);
    return levelArray;
  };
  
  function getOccurrence(array: number[], value: number) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
  }

export const findMaxArcana = (awakened:Awakened, arcanum:ArcanaKey) => {
    const { experiencePoints } = awakened.arcana[arcanum]
    const xp = experiencePoints;
    const { level } = currentArcanumLevel(awakened, arcanum);
  
    let max = undefined;
    const gnosisLevel = (currentGnosisLevel(awakened).level)
    const arcanaLevels = getArcanaLevels(awakened)
  
    if (gnosisLevel === 1) {
      if (level === 3) {
      max = xp;
      }if (level === 2 && getOccurrence(arcanaLevels, 3) === 4) {
        max = xp;
        } if (getOccurrence(arcanaLevels, 2) === 4 && level === 1) {
          max = xp;
        }
    }
    if (gnosisLevel === 2) {
      if (level === 4) {
        max = xp;
        }if (level === 3 && getOccurrence(arcanaLevels, 4) === 2) {
          max = xp;
          } if (level === 2 && getOccurrence(arcanaLevels, 3) === 3) {
            max = xp;
          } if (level === 1 && getOccurrence(arcanaLevels, 2) === 3) {
            max = xp;
          }      
        }
    if (gnosisLevel === 3) {
      if (level === 5) {
        max = xp;
        }if (level === 4 && getOccurrence(arcanaLevels, 5) === 1) {
          max = xp;
          } if (level === 3 && getOccurrence(arcanaLevels, 4) === 2) {
            max = xp;
          } if (level === 2 && getOccurrence(arcanaLevels, 3) === 3) {
            max = xp;
          } if (level === 1 && getOccurrence(arcanaLevels, 2) === 3) {
            max = xp;
          }
    }
    if (gnosisLevel === 4) {
      if (level === 5) {
        max = xp;
        }if (level === 4 && getOccurrence(arcanaLevels, 5) === 2) {
          max = xp;
          } if (level === 3 && getOccurrence(arcanaLevels, 4) === 2) {
            max = xp;
          } if (level === 2 && getOccurrence(arcanaLevels, 3) === 3) {
            max = xp;
          }
    } if (gnosisLevel === 5) {
      if (level === 5) {
        max = xp;
        }if (level === 4 && getOccurrence(arcanaLevels, 5) === 3) {
          max = xp;
          } if (level === 3 && getOccurrence(arcanaLevels, 4) === 2) {
            max = xp;
          } if (level === 2 && getOccurrence(arcanaLevels, 3) === 3) {
            max = xp;
          }
    } if (gnosisLevel === 6) {
      if (level === 6) {
        max = xp;
        }if (level === 5 && getOccurrence(arcanaLevels, 6) === 1) {
          max = xp;
          }if (level === 4 && getOccurrence(arcanaLevels, 5) === 3) {
          max = xp;
          } if (level === 3 && getOccurrence(arcanaLevels, 4) === 2) {
            max = xp;
          } if (level === 2 && getOccurrence(arcanaLevels, 3) === 3) {
            max = xp;
          }
    }
    return max
  }
  

// function for changes to the Arcana
type VariableKeys = "type" | "creationPoints" | "freebiePoints" | "experiencePoints";
type ValidValue = number | "Common" | "Inferior" | "Ruling"
export const handleArcanumChange = (awakened: Awakened, setAwakened: Function, arcanum: ArcanaKey, variableKey: VariableKeys, value: ValidValue) => {
  const { totalXpNeeded, pastXpNeeded } = currentArcanumLevel(awakened, arcanum);
  const oldXp = awakened.arcana[arcanum].experiencePoints;

  let newValue = null
  if (typeof value === "number") {
    newValue = value > oldXp ? totalXpNeeded : getNumberBelow(pastXpNeeded, value);
  } else {
    newValue = value
    }

  const updatedArcana = {
    ...awakened.arcana,
    [arcanum]: {
      ...awakened.arcana[arcanum],
      [variableKey]: newValue,
    },
  };

  const updatedAwakened = {
    ...awakened,
    arcana: updatedArcana,
  };

  setAwakened(updatedAwakened); // Update the awakened object with the updatedArcana
};


export const checkArcanaCreationPointsTotal = (awakened: Awakened) => {
  const arcana = awakened.arcana;
  let total = 0;
  Object.keys(arcana).forEach((arcanum) => {
    const dots = arcana[arcanum as ArcanaKey].creationPoints;
    total += dots;
  });
  return total === 6;
};