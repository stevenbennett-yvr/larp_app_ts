import { z } from 'zod'
import { Awakened } from './Awakened'
import { ArcanaKey, currentArcanumLevel, arcana } from './Arcanum'
import { currentAttributeLevel, allAttributes, AttributeNames } from './Attributes'
import { currentSkillLevel, allSkills, SkillNames } from './Skills'
import roteDataJson from './RotesData.json'

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
    creationPoints: z.number(),
    freebiePoints: z.number(),
    experiencePoints: z.number()
})
export type Rote = z.infer<typeof roteSchema>

export const roteData: Rote[] = roteDataJson.map((rote) => ({
    ...rote,
    creationPoints: 0,
    freebiePoints: 0,
    experiencePoints: 0,
  }));


export const getFilteredRotes = (awakened: Awakened, roteData: Rote[]): Rote[] => {
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
              matchingOtherArcana = (orArray.includes(true)? true: false)
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
            orValue = currentAttributeLevel(awakened, 'wits').level + currentAttributeLevel(awakened, 'composure').level
          }
          if (allAttributes.includes(item as AttributeNames)) {
            orValue = Math.max(orValue, currentAttributeLevel(awakened, item).level);
          }
          else if (allSkills.includes(item as SkillNames)) {
            orValue = Math.max(orValue, currentSkillLevel(awakened, item).level + (currentSkillLevel(awakened, item).roteSkill ? 1 : 0));
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
          pool += currentAttributeLevel(awakened, 'wits').level + currentAttributeLevel(awakened, 'composure').level
        }
        if (allAttributes.includes(item as AttributeNames)) {
          pool += currentAttributeLevel(awakened, item).level;
          }
        else if (allSkills.includes(item as SkillNames)) {
          pool +=  currentSkillLevel(awakened, item).level + (currentSkillLevel(awakened, item).roteSkill ? 1 : 0)
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
    rote: Rote,
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


  export const checkRoteCreationPoints = (awakened:Awakened) => {
    let dotsTotal = 0;
  
    Object.values(awakened.rotes).forEach((rote) => {
      let dots = rote.creationPoints;
      dotsTotal += dots;
    });

    return dotsTotal === 6
  };