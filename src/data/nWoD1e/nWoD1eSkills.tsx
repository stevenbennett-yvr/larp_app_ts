import { z } from "zod";
import { getNumberBelow } from "../../utils/getNumberBelow";

export const skillCategoriesSchema = z.union([
  z.literal('mental'),
  z.literal('physical'),
  z.literal('social'),
])

export type SkillCategory = 'mental' | 'physical' | 'social';

const specialitySchema = z.object({
  name: z.string(),
  creationPoints: z.number().min(0).max(1).int(),
  freebiePoints: z.number().min(0).max(1).int(),
  experiencePoints: z.number().min(0).max(3).int(),
});

export type Speciality = z.infer<typeof specialitySchema>;

const skillSchema = z.object({
  creationPoints: z.number().min(0).max(6).int(),
  freebiePoints: z.number().min(0).int(),
  experiencePoints: z.number().min(0).int(),
  roteSkill: z.boolean().default(false),
  specialities: z.array(specialitySchema),
  category: skillCategoriesSchema,
});

export type nWoD1eSkill = z.infer<typeof skillSchema>;

export const skillsSchema = z.object({
  academics: skillSchema,
  computer: skillSchema,
  crafts: skillSchema,
  investigation: skillSchema,
  medicine: skillSchema,
  occult: skillSchema,
  politics: skillSchema,
  science: skillSchema,

  athletics: skillSchema,
  brawl: skillSchema,
  drive: skillSchema,
  firearms: skillSchema,
  larceny: skillSchema,
  stealth: skillSchema,
  survival: skillSchema,
  weaponry: skillSchema,

  animal_ken: skillSchema,
  empathy: skillSchema,
  expression: skillSchema,
  intimidation: skillSchema,
  persuasion: skillSchema,
  socialize: skillSchema,
  streetwise: skillSchema,
  subterfuge: skillSchema,
});

export type nWoD1eSkills = z.infer<typeof skillsSchema>
export const skillsKeySchema = skillsSchema.keyof()
export type SkillsKey = z.infer<typeof skillsKeySchema>

export const allSkills: SkillsKey[] = [
  "athletics",
  "brawl",
  "drive",
  "firearms",
  "weaponry",
  "larceny",
  "stealth",
  "survival",

  "animal_ken",
  "socialize",
  "empathy",
  "intimidation",
  "expression",
  "persuasion",
  "streetwise",
  "subterfuge",

  "academics",
  "computer",
  "crafts",
  "investigation",
  "medicine",
  "occult",
  "politics",
  "science",
]

export const skillSelect: { value: string; label: string; group?: string }[] = [
  { value: 'athletics', label: 'Athletics', group: 'Physical Skills' },
  { value: 'brawl', label: 'Brawl', group: 'Physical Skills' },
  { value: 'drive', label: 'Drive', group: 'Physical Skills' },
  { value: 'firearms', label: 'Firearms', group: 'Physical Skills' },
  { value: 'weaponry', label: 'Weaponry', group: 'Physical Skills' },
  { value: 'larceny', label: 'Larceny', group: 'Physical Skills' },
  { value: 'stealth', label: 'Stealth', group: 'Physical Skills' },
  { value: 'survival', label: 'Survival', group: 'Physical Skills' },

  { value: 'animal_ken', label: 'Animal Ken', group: 'Social Skills' },
  { value: 'socialize', label: 'Socialize', group: 'Social Skills' },
  { value: 'empathy', label: 'Empathy', group: 'Social Skills' },
  { value: 'intimidation', label: 'Intimidation', group: 'Social Skills' },
  { value: 'expression', label: 'Expression', group: 'Social Skills' },
  { value: 'persuasion', label: 'Persuasion', group: 'Social Skills' },
  { value: 'streetwise', label: 'Streetwise', group: 'Social Skills' },
  { value: 'subterfuge', label: 'Subterfuge', group: 'Social Skills' },

  { value: 'academics', label: 'Academics', group: 'Mental Skills' },
  { value: 'computer', label: 'Computer', group: 'Mental Skills' },
  { value: 'crafts', label: 'Crafts', group: 'Mental Skills' },
  { value: 'investigation', label: 'Investigation', group: 'Mental Skills' },
  { value: 'medicine', label: 'Medicine', group: 'Mental Skills' },
  { value: 'occult', label: 'Occult', group: 'Mental Skills' },
  { value: 'politics', label: 'Politics', group: 'Mental Skills' },
  { value: 'science', label: 'Science', group: 'Mental Skills' },
];



export const nWoD1eSkillDescriptions: Record<SkillsKey, string> = {

  academics: "The ability to research, analyze, and understand complex topics. Academics includes knowledge of history, literature, and the sciences.",
  computer: "The ability to use and manipulate computers, software, and digital technology. This skill includes programming and hacking abilities.",
  crafts: "The ability to create and repair physical objects. Crafts includes woodworking, metalworking, and other manual trades.",
  investigation: "The ability to gather information through interviews, research, and surveillance. Investigation includes detecting lies, analyzing clues, and profiling.",
  medicine: "The ability to diagnose and treat injuries and illnesses. Medicine includes knowledge of anatomy, pharmacology, and surgery.",
  occult: "The ability to understand and manipulate supernatural forces. Occult includes knowledge of magic, ghosts, and other paranormal phenomena.",
  politics: "The ability to navigate and influence government, bureaucracy, and other power structures. Politics includes knowledge of law, diplomacy, and propaganda.",
  science: "The ability to understand and apply scientific principles. Science includes knowledge of biology, physics, and chemistry.",

  athletics: "The ability to run, jump, climb, and swim. Athletics also includes knowledge of sports and physical training techniques.",
  brawl: "The ability to fight using fists, feet, and other unarmed strikes. Brawl also includes knowledge of martial arts and grappling techniques.",
  drive: "The ability to operate and control land-based vehicles. Drive includes knowledge of car mechanics and navigation.",
  firearms: "The ability to use and maintain firearms. Firearms includes knowledge of marksmanship and ballistics.",
  larceny: "The ability to steal and pick locks. Larceny includes knowledge of sleight of hand and burglary techniques.",
  stealth: "The ability to move and operate silently and without being noticed. Stealth includes knowledge of camouflage and infiltration techniques.",
  survival: "The ability to live and survive in the wilderness. Survival includes knowledge of foraging, hunting, and shelter building.",
  weaponry: "The ability to use and maintain weapons other than firearms, such as swords, axes, and bows.",

  animal_ken: "The ability to understand and communicate with animals. Animal Ken also includes knowledge of animal behavior and training techniques.",
  empathy: "The ability to read and understand the emotions and motivations of others. Empathy also includes the ability to comfort and support others.",
  expression: "The ability to communicate effectively through various media, such as writing, speaking, and performing. Expression includes knowledge of rhetoric and artistic techniques.",
  intimidation: "The ability to intimidate and coerce others through physical or psychological means. Intimidation also includes knowledge of interrogation techniques.",
  persuasion: "The ability to convince and persuade others through argument and charisma. Persuasion includes knowledge of negotiation and debate techniques.",
  socialize: "The ability to navigate and influence social situations. Socialize includes knowledge of etiquette and diplomacy.",
  streetwise: "The ability to survive and thrive in urban environments. Streetwise includes knowledge of criminal organizations and urban subcultures.",
  subterfuge: "The ability to deceive and manipulate others through stealth and guile. Subterfuge includes knowledge of disguise and misdirection techniques.",
};


/// Skill Functions

export const nWoD1eCurrentSkillLevel = (
  character: any,
  skill: SkillsKey,
) => {
  const skills = character.skills as nWoD1eSkills
  const skillData = skills[skill]

  let { creationPoints, freebiePoints = 0, experiencePoints = 0, roteSkill } = skillData

  let totalXpNeeded = 0;
  let pastXpNeeded = [0];

  if (experiencePoints === 0) {
    let level = creationPoints + freebiePoints;
    let xpNeeded = (level + 1) * 3;
    totalXpNeeded = xpNeeded;
    pastXpNeeded.push(totalXpNeeded);
    return { level, totalXpNeeded, pastXpNeeded, roteSkill };
  } else {
    let level = creationPoints + freebiePoints;
    let xpNeeded = (level + 1) * 3;
    totalXpNeeded += xpNeeded;
    pastXpNeeded.push(totalXpNeeded);

    while (experiencePoints >= xpNeeded) {
      level++;
      experiencePoints -= xpNeeded;
      xpNeeded = (level + 1) * 3;
      totalXpNeeded += xpNeeded;
      pastXpNeeded.push(totalXpNeeded);
    }

    return { level, totalXpNeeded, pastXpNeeded, roteSkill };
  }
}

export const nWoD1eFindMaxSkill = (
  character: any,
  skill: SkillsKey,
) => {
  const skills = character.skills as any;
  const attributeData = skills[skill];

  const { experiencePoints } = attributeData;
  const { level } = nWoD1eCurrentSkillLevel(character, skill);

  const powerStat = 5

  let max = undefined;
  if (powerStat <= 5 && level === 5) {
    max = experiencePoints;
  } if (powerStat > 5 && level === powerStat) {
    max = experiencePoints;
  }
  return max;
};

type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints" | "roteSkill" | "specialities";
export const nWoD1eHandleSkillChange = (
  character: any,
  setCharacter: Function,
  skill: SkillsKey,
  variableKey:
    VariableKeys,
  value: any) => {

  const updatedSkills = {
    ...character.skills,
    [skill]: {
      ...character.skills[skill],
      [variableKey]: value
    }
  }

  const updatedAwakened = {
    ...character,
    skills: updatedSkills
  };

  setCharacter(updatedAwakened); // Update the awakened object with the updatedSkills
};

export const nWoD1eHandleXpSkillChange = (character: any, setAwakened: Function, skill: SkillsKey, value: number) => {
  const { totalXpNeeded, pastXpNeeded } = nWoD1eCurrentSkillLevel(character, skill)
  const skills = character.skills as nWoD1eSkills;
  const skillData = skills[skill]; // Get the skill data

  let xp = value > skillData.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)

  nWoD1eHandleSkillChange(character, setAwakened, skill, "experiencePoints", xp)
  return xp
}


// Specialities functions

export const nWoD1eGetSpecialities = (character: any, skill: SkillsKey) => {
  const skillInfo = character.skills[skill]
  let specialities = skillInfo.specialities
  return specialities
}

export const nWoD1eAddSpeciality = (
  character: any,
  setCharacter: Function,
  skill: SkillsKey,
  specialityName: string,
  value: string
) => {
  let specialityArray = nWoD1eGetSpecialities(character, skill);

  const newSpeciality: Speciality = {
    name: specialityName,
    creationPoints: value === "creationPoints" ? 1 : 0,
    freebiePoints: value === "freebiePoints" ? 1 : 0,
    experiencePoints: value === "experiencePoints" ? 3 : 0,
  };

  specialityArray.push(newSpeciality);

  nWoD1eHandleSkillChange(character, setCharacter, skill, "specialities", specialityArray);
};

export const nWoD1eRemoveSpeciality = (
  character: any,
  setAwakened: Function,
  skill: SkillsKey,
  specialityName: string,
) => {
  let specialityArray = nWoD1eGetSpecialities(character, skill);
  const indexToRemove = specialityArray.findIndex(
    (speciality: Speciality) => speciality.name === specialityName
  );
  if (indexToRemove !== -1) {
    // Remove the specialty using splice method
    specialityArray.splice(indexToRemove, 1);

    // Call setSpecialtyName to update the specialty name in the component        
    // Update the state with the updated skills
    nWoD1eHandleSkillChange(character, setAwakened, skill, "specialities", specialityArray)
  }
}

export function nWoD1eSkillsCreationPointsCheck(
  character: any
): Record<string, number> {
  const totalPointsByCategory: Record<string, number> = {
    mental: 0,
    physical: 0,
    social: 0,
  };
  const skills = character.skills as nWoD1eSkills;

  for (const skill in skills) {
    const skillKey = skill as SkillsKey
    const skillData = skills[skillKey]
    const { category, creationPoints } = skillData;

    if (category === 'mental') {
      totalPointsByCategory.mental += creationPoints;
    } else if (category === 'physical') {
      totalPointsByCategory.physical += creationPoints;
    } else if (category === 'social') {
      totalPointsByCategory.social += creationPoints;
    }
  }

  return totalPointsByCategory;
}

export function nWoD1eSkillsCheckTotalPoints(
  character: any
): boolean {
  const totalPointsByCategory = nWoD1eSkillsCreationPointsCheck(character);

  for (const category in totalPointsByCategory) {
    if (totalPointsByCategory[category] === 11) {
      delete totalPointsByCategory[category];
      for (const category in totalPointsByCategory) {
        if (totalPointsByCategory[category] === 7) {
          delete totalPointsByCategory[category];
          const remainingCategory = Object.keys(totalPointsByCategory)[0]
          if (totalPointsByCategory[remainingCategory] === 4) {
            return true
          }
        }
      }
    }
  }

  return false; // No category with the desired points found
}