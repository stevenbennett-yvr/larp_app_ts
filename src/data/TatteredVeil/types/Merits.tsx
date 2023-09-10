import { z } from "zod";
import { Awakened } from "./Awakened";
import { allAttributes, nWoD1eCurrentAttributeLevel, AttributesKey } from "../../nWoD1e/nWoD1eAttributes";
import { SkillsKey, nWoD1eCurrentSkillLevel, allSkills } from "../../nWoD1e/nWoD1eSkills";
import { currentGnosisLevel } from "./Gnosis"
import meritDataJson from '../source/mageMerits.json'
import { getNumberBelow } from "../../../utils/getNumberBelow";

export const meritRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  creationPoints: z.number(),
  freebiePoints: z.number(),
  experiencePoints: z.number(),
  note: z.string()
})
export type MeritRef = z.infer<typeof meritRefSchema>

export const meritRefs: MeritRef[] = meritDataJson.map((merit) => ({
  id: `merit_${merit.name}`,
  name: merit.name,
  creationPoints: 0,
  freebiePoints: 0,
  experiencePoints: 0,
  note: ""
}))

export const meritSchema = z.object({
  type: z.string(),
  name: z.string(),
  id: z.string(),
  rating: z.string(),
  prerequisites: z.string(),
  description: z.string(),
  source: z.string(),
})
export type Merit = z.infer<typeof meritSchema>

export const meritData: Merit[] = meritDataJson.map((merit, index) => ({
  ...merit,
  id: `merit_${index}`,
}));

export const getMeritByName = (name: string): Merit => {
  let meritInfo = meritData.find((merit) => merit.name === name);
  if (!meritInfo) {
    return {
      type: "",
      name: "",
      id: "",
      rating: "",
      prerequisites: "",
      description: "",
      source: "",
    }
  } else {
    return meritInfo
  }
};

export const defineMeritRating = (rating: string) => {
  let maxCost = 5;
  let minCost = 0;
  let orBool = false;
  let plusBool = false;
  let orToBool = false;

  if (!rating.includes(' or ') && !rating.includes(' to ') && !rating.includes(' + ')) {
    const matches = rating.match(/•/g);
    if (matches !== null) {
      const cost = matches.length;
      maxCost = cost;
      minCost = cost;
    }
  }

  if (rating.includes('+')) {
    const matches = rating.match(/•/g);
    if (matches !== null) {
      minCost = matches.length;
      maxCost = 5;
      plusBool = true;
    }
  }

  if (rating.includes(' or ')) {
    const costs = rating.split(" or ");
    const matches1 = costs[0].match(/•/g);
    const matches2 = costs[1].match(/•/g);
    if (matches1 !== null && matches2 !== null) {
      minCost = matches1.length;
      maxCost = matches2.length;
      orBool = true;
    }
  }

  if (rating.includes(' to ')) {
    const costs = rating.split(' to ')
    const matches1 = costs[0].match(/•/g);
    const matches2 = costs[1].match(/•/g);
    if (matches1 !== null && matches2 !== null) {
      minCost = matches1.length;
      maxCost = matches2.length;
    }
  }

  if (rating.includes('orto')) {
    orToBool = true;
  }

  return { minCost, maxCost, orBool, plusBool, orToBool }
};

export const currentMeritLevel = (meritRef: MeritRef) => {
  let totalXpNeeded = 0;
  let pastXpNeeded = [0];
  const meritInfo = getMeritByName(meritRef.name)
  let { experiencePoints, creationPoints, freebiePoints } = meritRef;

  const { minCost, maxCost, orBool, plusBool, orToBool } = defineMeritRating(meritInfo.rating);
  let level = Math.max(minCost, meritRef.creationPoints + meritRef.freebiePoints);

  if (level === maxCost && !orBool && !orToBool) {
    let xpNeeded = minCost * 2;
    totalXpNeeded = xpNeeded;
    pastXpNeeded.push(totalXpNeeded);
    return { level, totalXpNeeded, pastXpNeeded };
  }

  if (orToBool) {
    if (!creationPoints && !freebiePoints) {
      level = minCost;
      let minXp = minCost * 2;
      totalXpNeeded = minXp;
      pastXpNeeded.push(minXp);
    } else {
      level = creationPoints + freebiePoints;
    }
    let xpNeeded = (level + 1) * 2;
    totalXpNeeded = xpNeeded;

    while (experiencePoints >= xpNeeded) {
      level++;
      xpNeeded = (level + 1) * 2;
      totalXpNeeded = xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
    }
    return { level, totalXpNeeded, pastXpNeeded };
  }

  if (orBool && !orToBool) {
    if (!creationPoints && !freebiePoints) {
      let minXp = minCost * 2;
      let maxXp = maxCost * 2;
      let totalXpNeeded = maxXp;
      pastXpNeeded.push(minXp);
      if (experiencePoints > minXp) {
        level = maxCost;
        totalXpNeeded = maxXp + minXp;
        pastXpNeeded.push(totalXpNeeded);
      }
      return { level, totalXpNeeded, pastXpNeeded };
    } else {
      level = creationPoints + freebiePoints;
      let minXp = 0
      let maxXp = (maxCost - level) * 2
      let totalXpNeeded = maxXp
      pastXpNeeded.push(minXp)
      if (experiencePoints > minXp) {
        level = maxCost
        totalXpNeeded = maxXp
        pastXpNeeded.push(totalXpNeeded)
      }
      return { level, totalXpNeeded, pastXpNeeded };
    }
  }

  if (plusBool && !orToBool) {
    if (!creationPoints || !freebiePoints) {
      level = minCost;
      let minXp = minCost * 2;
      totalXpNeeded += minXp;
      pastXpNeeded.push(minXp);
    } else {
      level = creationPoints + freebiePoints;
    }
    let xpNeeded = (level + 1) * 2;
    totalXpNeeded += xpNeeded;
    pastXpNeeded.push(totalXpNeeded);

    while (experiencePoints >= xpNeeded) {
      level++;
      experiencePoints -= xpNeeded;
      xpNeeded = (level + 1) * 2;
      totalXpNeeded += xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
    }

    return { level, totalXpNeeded, pastXpNeeded };
  } else {
    if (!creationPoints && !freebiePoints) {
      totalXpNeeded += 2;
      pastXpNeeded.push(totalXpNeeded);
    }
    let xpNeeded = (level + 1) * 2;
    totalXpNeeded += xpNeeded;
    pastXpNeeded.push(totalXpNeeded);

    if (experiencePoints < xpNeeded && creationPoints + freebiePoints > 0) {
      level = creationPoints + freebiePoints; // Set level to 0 for the initial purchase
      return { level, totalXpNeeded, pastXpNeeded };
    }

    // Check if xp is less than the first xpNeeded value
    if (experiencePoints < xpNeeded) {
      level = 1; // Set level to 0 for the initial purchase
      return { level, totalXpNeeded, pastXpNeeded };
    }

    while (experiencePoints >= xpNeeded) {
      level++;
      experiencePoints -= xpNeeded;
      xpNeeded = (level + 1) * 2;
      totalXpNeeded += xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
    }

    return { level, totalXpNeeded, pastXpNeeded };
  }
};


export const getFilteredMerits = (awakened: Awakened): Merit[] => {
  const merits = awakened.merits;
  const order = awakened.order;
  const path = awakened.path;

  const filteredMerits: Merit[] = [];

  meritData.forEach((merit) => {
    const { prerequisites } = merit
    let canSelect = false;
    if (prerequisites !== "") {
      const requirement = prerequisites.split(", ");
      let allRequirementsMet = true;
      requirement.forEach((item) => {
        if (item.includes("•") && !item.includes(",") && !item.includes(" or ")) {
          const [category, value] = item.split(" •");
          const categoryValue = category.toLowerCase();
          const requiredValue = (value.match(/•/g) || []).length + 1;
          //check attribute requirement

          merits.forEach((meritRef) => {
            //getMerit data here based off reference
            let merit = getMeritByName(meritRef.name)
            if (item === merit.name.toLowerCase() && requiredValue <= currentMeritLevel(meritRef).level) { return; }
          })
          if (allAttributes.includes(categoryValue as AttributesKey)) {
            if (requiredValue <= nWoD1eCurrentAttributeLevel(awakened, categoryValue as AttributesKey).level) {
              return;
            } else {
              allRequirementsMet = false;
            }
            //check skill requirement
          } if (allSkills.includes(categoryValue as SkillsKey)) {
            if (requiredValue <= nWoD1eCurrentSkillLevel(awakened, categoryValue as SkillsKey).level) {
              return;
            } else {
              allRequirementsMet = false;
            }
            // check order
          } if (order.includes(item)) {
            return;
          } if (path.includes(item)) {
            return;
          } if (categoryValue === "gnosis") {
            if (requiredValue <= currentGnosisLevel(awakened).level) {
              return;
            }
          }
          else {
            allRequirementsMet = false;
          }
        }
        if (item.includes("•") && item.includes(" or ")) {
          const orReqs = item.split(" or ");
          let reqsMet = false;

          for (const req of orReqs) {
            const [category, value] = req.split(" •");
            const categoryValue = category.toLowerCase();
            const requiredValue = (value.match(/•/g) || []).length + 1;

            // Check attribute requirement
            if (allAttributes.includes(categoryValue as AttributesKey)) {
              if (requiredValue <= nWoD1eCurrentAttributeLevel(awakened, categoryValue as AttributesKey).level) {
                reqsMet = true;
                break;
              }
            }
            // Check skill requirement
            else if (allSkills.includes(categoryValue as SkillsKey)) {
              if (requiredValue <= nWoD1eCurrentSkillLevel(awakened, categoryValue as SkillsKey).level) {
                reqsMet = true;
                break;
              }
            }
            // Check order requirement
            else if (order.includes(item)) {
              reqsMet = true;
              break;
            }

            else if (path.includes(item)) {
              reqsMet = true;
              break;
            }

            else if (categoryValue === "gnosis") {
              if (requiredValue <= currentGnosisLevel(awakened).level) {
                reqsMet = true;
                break;
              }
            }
          }

          if (reqsMet) {
            allRequirementsMet = true;
            return; // Skip remaining requirements if any of the "or" requirements have not been met
          }
        }
        if (!item.includes("•") && !item.includes(",") && !item.includes(" or ")) {
          let meritMatch = false;
          for (const key in merits) {
            let merit = getMeritByName(merits[key].name)
            if (item.toLowerCase() === merit.name.toLowerCase()) {
              meritMatch = true;
              break;
            }
          }
          if (meritMatch || order.includes(item) || path.includes(item)) {
            return;
          } else {
            allRequirementsMet = false;
          }
        }
        else {
          allRequirementsMet = false;
        }
      });
      if (allRequirementsMet) {
        canSelect = true;
      }
    } else {
      canSelect = true;
    }
    if (canSelect) {
      filteredMerits.push(merit)
    }
  })

  return filteredMerits
}

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints" | "note";

export const handleMeritChange = (
  awakened: Awakened,
  setAwakened: Function,
  merit: MeritRef,
  type: VariableKeys,
  newPoints: number | string,
): void => {
  console.log(merit)
  const existingMerit = awakened.merits.find((m) => m.id === merit.id);
  if (existingMerit) {
    if (newPoints === 0 && type !== "experiencePoints") {
      const updatedMerits = awakened.merits.filter((m) => m.id !== merit.id);
      setAwakened({ ...awakened, merits: updatedMerits });
    } else {
      const updatedMerits = awakened.merits.map((m) =>
        m.id === merit.id ? { ...m, [type]: newPoints } : m
      );
      setAwakened({ ...awakened, merits: updatedMerits });
    }
  } else {
    setAwakened({
      ...awakened,
      merits: [...awakened.merits, { ...merit, [type]: newPoints }],
    });
  }
};


export const findMaxMerit = (meritRef: MeritRef) => {
  const xp = meritRef.experiencePoints;
  const { level } = currentMeritLevel(meritRef)
  let meritInfo = getMeritByName(meritRef.name)

  let max = undefined;
  if (level === 5 || level === defineMeritRating(meritInfo.rating).maxCost) {
    max = xp;
  }
  return max
}

// For the xp change buttons.
export const handleXpMeritChange = (awakened: Awakened, setAwakened: Function, meritRef: MeritRef, value: number) => {
  let { level, totalXpNeeded, pastXpNeeded } = currentMeritLevel(meritRef)
  let oldXp = meritRef.experiencePoints
  let meritInfo = getMeritByName(meritRef.name)
  if (level < defineMeritRating(meritInfo.rating).maxCost) {
    let xp = value > oldXp ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)
    handleMeritChange(awakened, setAwakened, meritRef, "experiencePoints", xp)
  } else if (level > defineMeritRating(meritInfo.rating).minCost) {
    let xp = value > oldXp ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)
    handleMeritChange(awakened, setAwakened, meritRef, "experiencePoints", xp)
  }
}

export const checkMeritCreationPoints = (awakened: Awakened) => {
  let totalCreationPoints = 0;

  Object.values(awakened.merits).forEach((merit) => {
    totalCreationPoints += merit.creationPoints === 5 ? 6 : merit.creationPoints;
  });

  totalCreationPoints += awakened.gnosis.creationPoints

  return totalCreationPoints === 7;
};