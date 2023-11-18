import { z } from "zod";
import { Kindred } from "./Kindred";
import { v5xp } from "./V5Costs";
import { getNumberBelow } from "../../../utils/getNumberBelow";

const humanitySchema = z.object({
    frenzyResist: z.number(),
    toporLength: z.string(),
    other: z.string(),
})


export type Humanity = z.infer<typeof humanitySchema>

export const v5HumanityLevel = (
    kindred: Kindred,
) => {  
    let { creationPoints, freebiePoints = 0, experiencePoints = 0 } = kindred.humanity
  
    let totalXpNeeded = 0;
    let pastXpNeeded = [0];
  
    if (experiencePoints === 0) {
      let level = creationPoints + freebiePoints;
      let xpNeeded = (level + 1) * v5xp.humanity;
      totalXpNeeded = xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
      return { level, totalXpNeeded, pastXpNeeded };
    } else {
      let level = creationPoints + freebiePoints;
      let xpNeeded = (level + 1) * v5xp.humanity;
      totalXpNeeded += xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
  
      while (experiencePoints >= xpNeeded) {
        level++;
        experiencePoints -= xpNeeded;
        xpNeeded = (level + 1) * v5xp.humanity;
        totalXpNeeded += xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
      }
  
      return { level, totalXpNeeded, pastXpNeeded };
    }
}

export const findMaxHumanity = (kindred:Kindred) => {
    const bpData = kindred.humanity; // Get the attribute data
    
    const { experiencePoints } = bpData;
    const { level } = v5HumanityLevel(kindred);

    let max = undefined;
    if (level === 5) {
      max = experiencePoints;
    }
    return max;
  };

  type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
export const handleHumanityChange = (kindred: Kindred, setKindred: Function, type: VariableKeys, value: number): void => {
  const { totalXpNeeded, pastXpNeeded } = v5HumanityLevel(kindred);
  let updatedHumanity = { ...kindred.humanity };
  if (type === "experiencePoints") {
    let xp = value > kindred.humanity.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value);
    updatedHumanity = {
      ...updatedHumanity,
      [type]: xp,
    };
  } else {
    updatedHumanity = {
      ...updatedHumanity,
      [type]: value,
    };
  }
  const updatedAwakened = {
    ...kindred,
    humanity: updatedHumanity,
  };
  setKindred(updatedAwakened);
};


export const humanities: Record<number, Humanity> ={

    1: {
        frenzyResist: 0,
        toporLength: "1 Year",
        other: "<ul><li>They may use the Blush of Life by making a Rouse check.</li><li>When using the Blush of Life, you must make a Stamina + Composure test at Difficulty 3 to keep food and drink down for an hour.</li><li>You suffer a -8 penalty on mundane tests to positively interact with humans. </li><li>Without a go-between, such as a Retainer or another vampire, you no longer have access to mortal Backgrounds such as Resources, Contacts, or Allies. These Backgrounds are not lost but can only be used when the character increases his Humanity to 3.</li><li>Sects want nothing to do with a character this degenerate.</li></ul>",
    },
    2: {
        frenzyResist: 0,
        toporLength: "9 Months",
        other: "<ul><li>They may use the Blush of Life by making a Rouse check.</li><li>When using the Blush of Life, you must make a Stamina + Composure test at Difficulty 3 to keep food and drink down for an hour.</li><li>You suffer a -6 penalty on mundane tests to positively interact with humans. </li><li>Without a go-between, such as a Retainer or another vampire, you no longer have access to mortal Backgrounds such as Resources, Contacts, or Allies. These Backgrounds are not lost but can only be used when the character increases his Humanity to 3.</li></ul>",
    },
    3: {
        frenzyResist: 0,
        toporLength: "6 Months",
        other: "<ul><li>They may use the Blush of Life by making a Rouse check.</li><li>When using the Blush of Life, you must make a Stamina + Composure test at Difficulty 3 to keep food and drink down for an hour.</li><li>You suffer a -4 penalty on mundane tests to positively interact with humans. </li></ul>",
    },
    4: {
        frenzyResist: 1,
        toporLength: "3 Months",
        other: "<ul><li>They may use the Blush of Life by making a Rouse check.</li><li>When using the Blush of Life, you must make a Stamina + Composure test at Difficulty 3 to keep food and drink down for an hour.</li><li>You suffer a -2 penalty on mundane tests to positively interact with humans. </li></ul>",
    },
    5: {
        frenzyResist: 1,
        toporLength: "2 Months",
        other: "<ul><li>They may use the Blush of Life by making a Rouse check.</li><li>When using the Blush of Life, you must make a Stamina + Composure test at Difficulty 3 to keep food and drink down for an hour.</li><li>You suffer a -1 penalty on mundane tests to positively interact with humans. </li></ul>",
    },
    6: {
        frenzyResist: 1,
        toporLength: "1 Month",
        other: "<ul><li>They may use the Blush of Life by making a Rouse check.</li><li>When using the Blush of Life, you must make a Stamina + Composure test at Difficulty 3 to keep food and drink down for an hour.</li></ul>",
    },
    7: {
        frenzyResist: 2,
        toporLength: "3 Weeks",
        other: "<ul><li>They may use the Blush of Life by making a Rouse check.</li><li>While Blushing, they can keep food and drink down for about an hour, and can fake sexual intercourse.</li><li>If they eat or drink anything other than Blood without Blushing, they vomit. They may make a Stamina + Composure test at Difficulty 3 to get to a washroom or outside before doing so.</li></ul>",
    },
    8: {
        frenzyResist: 2,
        toporLength: "2 Weeks",
        other: "<ul><li>They may use the Blush of Life once per night without a Rouse check. Further uses require a Rouse check.</li><li>With the Blush of Life, they may digest and taste wine.</li><li>With Blush of Life, you may engage in sexual intercourse and possibly enjoy it.</li><li>They may rise up to an hour before sunset.</li></ul>",
    },
    9: {
        frenzyResist: 2,
        toporLength: "1 Week",
        other: "<ul><li>Blush of Life is not required. The vampire seems pale and a bit sickly, but not undead.</li><li>If you wish, you may still have the desire for intimate relations with other mortals and vampires.</li><li>While they may still mend with Blood, they also mend normal damage like a mortal does.</li><li>They can taste, eat, and digest liquids and rare or raw meat.</li><li>They can wake up an hour before sunset and stay awake an hour after dawn.</li><li>Sunlight damage against them is halved (rounded up).</li></ul>",
    },
    10: {
        frenzyResist: 3,
        toporLength: "3 days",
        other: "<ul><li>They appear almost mortal, though somewhat pale. Blush of Life is not required.</li><li>They may taste, eat and digest food like a mortal.</li><li>They can stay awake during the day like a mortal.</li><li>While they may still mend with Blood, they also mend Normal Damage like a mortal does.</li><li>Sunlight damage against them is halved (rounded up).</li></ul>",
    }
}