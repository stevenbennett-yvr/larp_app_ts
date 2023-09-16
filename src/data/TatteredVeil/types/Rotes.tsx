import { z } from 'zod'
import { Awakened } from './Awakened'
import { ArcanaKey, currentArcanumLevel, arcana } from './Arcanum'
import { AttributesKey, nWoD1eCurrentAttributeLevel, allAttributes } from '../../nWoD1e/nWoD1eAttributes'
import { nWoD1eCurrentSkillLevel, allSkills, SkillsKey } from '../../nWoD1e/nWoD1eSkills'
import roteDataJson from '../source/RotesData.json'

export const roteRefSchema = z.object({
  name: z.string(),
  creationPoints: z.number(),
  freebiePoints: z.number(),
  experiencePoints: z.number()
})
export type RoteRef = z.infer<typeof roteRefSchema>

export const roteRefs: RoteRef[] = roteDataJson.map((rote) => ({
  name: rote.name,
  creationPoints: 0,
  freebiePoints: 0,
  experiencePoints: 0,
}))

export const roteSchema = z.object({
  arcanum: z.string(),
  level: z.number(),
  name: z.string(),
  source: z.string(),
  cost: z.string(),
  duration: z.string(),
  practice: z.string(),
  description: z.string(),
  aspect: z.string(),
  otherArcana: z.string(),
  rotePool: z.string(),
})
export type Rote = z.infer<typeof roteSchema>

export const roteData: Rote[] = roteDataJson.map((rote) => ({
  ...rote
}));

export const getRoteByName = (name: string): Rote => {
  let roteInfo = roteData.find((rote) => rote.name === name);
  if (!roteInfo) {
    return {
    arcanum:'',
    level: 0,
    name: '',
    source: '',
    cost: '',
    duration: '',
    practice: '',
    description: '',
    aspect: '',
    otherArcana: '',
    rotePool: '',
    }
  } else {
    return roteInfo
  }
}

export const getFilteredRotes = (awakened: Awakened): Rote[] => {
  const userArcana = [] as { arcana: ArcanaKey; number: number }[];
  for (const arcanum in awakened.arcana) {
    if (currentArcanumLevel(awakened, arcanum as ArcanaKey).level !== 0) {
      const level = currentArcanumLevel(awakened, arcanum as ArcanaKey).level;
      userArcana.push({ arcana: arcanum as ArcanaKey, number: level });
    }
  }

  const filteredRotes = roteData.filter((rote) => {
    const requiredArcanum = rote.arcanum?.toLowerCase()
    const level = rote.level
    const matchingArcana = userArcana.find((a) => a.arcana === requiredArcanum)
    let matchingOtherArcana = false;

    if (!rote.otherArcana) {
      matchingOtherArcana = true;
    } else {
      const otherRequired = rote.otherArcana.includes(", ")
        ? rote.otherArcana.toLowerCase().split(", ")
        : [rote.otherArcana.toLowerCase()];

      if (otherRequired.length > 1 || otherRequired[0].includes(" or ")) {
        let matchingArray = [] as Boolean[]
        otherRequired.forEach((req) => {
          let items = req.split(" or ");
          if (items.length > 1) {
            let orArray = [] as Boolean[]
            items.forEach((item) => {
              const [reqArcana, reqDotStr] = item.split(" ");
              if (reqArcana && reqDotStr) {
                const reqDots = parseInt(reqDotStr)
                const matchingUserArcana = userArcana.find(
                  (a) => a.arcana === reqArcana && a.number >= reqDots
                )
                orArray.push(Boolean(matchingUserArcana))
              }
            });
            matchingOtherArcana = (orArray.includes(true) ? true : false)
          } else {
            const [reqArcana, reqPointsStr] = req.split(" ");
            if (reqArcana && reqPointsStr) {
              const reqPoints = parseInt(reqPointsStr);
              const matchingUserArcana = userArcana.find(
                (a) => a.arcana === reqArcana && a.number >= reqPoints
              );
              matchingArray.push(Boolean(matchingUserArcana));
            }
            if (matchingArray.includes(false)) {
              matchingOtherArcana = false;
            }
          }
        })
      } else {
        // Handle single condition
        const [reqArcana, reqPointsStr] = otherRequired[0].split(" ");
        if (reqArcana && reqPointsStr) {
          const reqPoints = parseInt(reqPointsStr);
          const matchingUserArcana = userArcana.find(
            (a) => a.arcana === reqArcana && a.number >= reqPoints
          );
          matchingOtherArcana = Boolean(matchingUserArcana);
        }
      }
    }
    return matchingArcana && matchingOtherArcana && matchingArcana.number >= level;
  })

  return filteredRotes
}
export function calculatePool(rotePool: string, awakened: Awakened) {
  rotePool = rotePool.replace(/( vs| -).*/g, '');
  let pool = 0;
  const poolList = rotePool.split(' + ');
  poolList.forEach((variable) => {
    let items = variable.toLowerCase().split(' or ');

    if (items.length > 1) {
      let maxOrValue = 0;
      items.forEach((item) => {
        let orValue = 0;
        if (item === "perception") {
          orValue = nWoD1eCurrentAttributeLevel(awakened, 'wits').level + nWoD1eCurrentAttributeLevel(awakened, 'composure').level
        }
        if (allAttributes.includes(item as AttributesKey)) {
          const attribute = item as AttributesKey
          orValue = Math.max(orValue, nWoD1eCurrentAttributeLevel(awakened, attribute).level);
        }
        else if (allSkills.includes(item as SkillsKey)) {
          const skill = item as SkillsKey
          orValue = Math.max(orValue, nWoD1eCurrentSkillLevel(awakened, skill).level + (nWoD1eCurrentSkillLevel(awakened, skill).roteSkill ? 1 : 0));
        }
        else if (arcana.includes(item as ArcanaKey)) {
          let arcanumName = item as ArcanaKey
          orValue = Math.max(orValue, currentArcanumLevel(awakened, arcanumName).level);
        };
        maxOrValue = Math.max(maxOrValue, orValue);
      });
      pool += maxOrValue;
    } else {
      let item = variable.toLowerCase();
      if (item === "perception") {
        pool += nWoD1eCurrentAttributeLevel(awakened, 'wits').level + nWoD1eCurrentAttributeLevel(awakened, 'composure').level
      }
      if (allAttributes.includes(item as AttributesKey)) {
        const attribute = item as AttributesKey
        pool += nWoD1eCurrentAttributeLevel(awakened, attribute).level;
      }
      else if (allSkills.includes(item as SkillsKey)) {
        const skill = item as SkillsKey
        pool += nWoD1eCurrentSkillLevel(awakened, skill).level + (nWoD1eCurrentSkillLevel(awakened, skill).roteSkill ? 1 : 0)
      }
      else if (arcana.includes(item as ArcanaKey)) {
        let arcanumName = item as ArcanaKey
        pool += currentArcanumLevel(awakened, arcanumName).level
      };
    }
  });
  return pool;
}

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";

export const handleRoteChange = (
  awakened: Awakened,
  setAwakened: Function,
  rote: RoteRef,
  type: VariableKeys,
  newPoints: number
): void => {
  const existingRote = awakened.rotes.find((r) => r.name === rote.name);

  if (existingRote) {
    if (newPoints === 0) {
      const updatedRotes = awakened.rotes.filter((r) => r.name !== rote.name);
      setAwakened({ ...awakened, rotes: updatedRotes });
    } else {
      const updatedRotes = awakened.rotes.map((r) =>
        r.name === rote.name ? { ...r, [type]: newPoints } : r
      );
      setAwakened({ ...awakened, rotes: updatedRotes });
    }
  } else {
    setAwakened({
      ...awakened,
      rotes: [...awakened.rotes, { ...rote, [type]: newPoints }],
    });
  }
};

export const removeRote = (
  awakened: Awakened,
  setAwakened: Function,
  rote: RoteRef,
): void => {
  const updatedRotes = awakened.rotes.filter((r) => r.name !== rote.name);
  setAwakened({ ...awakened, rotes: updatedRotes });
}


export const checkRoteCreationPoints = (awakened: Awakened) => {
  let dotsTotal = 0;

  Object.values(awakened.rotes).forEach((rote) => {
    let dots = rote.creationPoints;
    dotsTotal += dots;
  });

  return dotsTotal === 6
};