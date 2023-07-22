import { z } from "zod";
import { Awakened } from "./Awakened";
import { allAttributes, currentAttributeLevel } from "./Attributes";
import { allSkills, currentSkillLevel } from "./Skills";
import { currentGnosisLevel } from "./Gnosis"
import meritDataJson from './mageMerits.json'

export const meritSchema = z.object({
    type: z.string(),
    name: z.string(),
    rating: z.string(),
    prerequisites: z.string(),
    description: z.string(),
    source: z.string(),
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number()
})
export type Merit = z.infer<typeof meritSchema>

export const meritData: Merit[] = meritDataJson.map((rote) => ({
    ...rote,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
  }));

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
  
export const currentMeritLevel = (meritInfo: Merit) => {
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
    let { experiencePoints, creationPoints, freebiePoints } = meritInfo;
  
    const { minCost, maxCost, orBool, plusBool, orToBool } = defineMeritRating(meritInfo.rating);
    let level = Math.max(minCost, meritInfo.creationPoints + meritInfo.freebiePoints);
  
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
  
    if (level === maxCost && !orBool && !orToBool) {
      let xpNeeded = minCost * 2;
      totalXpNeeded = xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
      return { level, totalXpNeeded, pastXpNeeded };
    }
  
    if (orBool && !orToBool) {
      if (creationPoints !== 0) {
        if (experiencePoints > 0) {
          let totalXpNeeded = maxCost * 2;
          level = maxCost;
          return { level, totalXpNeeded, pastXpNeeded };
        }
        if (experiencePoints < maxCost) {
          let totalXpNeeded = maxCost * 2;
          level = minCost;
          return { level, totalXpNeeded, pastXpNeeded };
        }
      } else {
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


  export const getFilteredMerits = (awakened : Awakened) : { filteredMerits: Merit[] } => {
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
    
                merits.forEach((merit) => {
                  if (item === merit.name.toLowerCase() && requiredValue <= currentMeritLevel(merit).level) 
                  { return; }
                })
                if (categoryValue in allAttributes) {
                  if (requiredValue <= currentAttributeLevel(awakened, categoryValue).level) {
                    return;
                  } else {
                    allRequirementsMet = false;
                  }
                //check skill requirement
                } if (categoryValue in allSkills) {
                  if (requiredValue <= currentSkillLevel(awakened, categoryValue).level) {
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
                let reqsMet  = false;
              
                for (const req of orReqs) {
                  const [category, value] = req.split(" •");
                  const categoryValue = category.toLowerCase();
                  const requiredValue = (value.match(/•/g) || []).length + 1;
              
                  // Check attribute requirement
                  if (categoryValue in allAttributes) {
                    if (requiredValue <= currentAttributeLevel(awakened, categoryValue).level) {
                      reqsMet  = true;
                      break;
                    }
                  }
                  // Check skill requirement
                  else if (categoryValue in allSkills) {
                    if (requiredValue <= currentSkillLevel(awakened, categoryValue).level) {
                      reqsMet  = true;
                      break;
                    }
                  }
                  // Check order requirement
                  else if (order.includes(item)) {
                    reqsMet  = true;
                    break;
                  }
    
                  else if (path.includes(item)) {
                    reqsMet  = true;
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
                  if (item.toLowerCase() === merits[key].name.toLowerCase()) {
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

    return { filteredMerits }
}