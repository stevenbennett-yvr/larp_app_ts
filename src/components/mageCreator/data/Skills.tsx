import { z } from "zod";
import { Awakened } from "./Awakened";

const specialitySchema = z.object({
    name: z.string(),
    creationPoints: z.number().min(0).max(1).int(),
    freebiePoints: z.number().min(0).max(1).int(),
    experiencePoints: z.number().min(0).max(3).int(),
})

export type Speciality = z.infer<typeof specialitySchema>;

const skillSchema = z.object({
  creationPoints: z.number().min(0).max(6).int(),
  freebiePoints: z.number().min(0).int(),
  experiencePoints: z.number().min(0).int(),
  roteSkill: z.boolean().default(false),
  specialities: z.array(specialitySchema),
});


export type Skill = z.infer<typeof skillSchema>;

export const skillsSchema = z.object({
    mental: z.object({
        academics: skillSchema,
        computer: skillSchema,
        crafts: skillSchema,
        investigation: skillSchema,
        medicine: skillSchema,
        occult: skillSchema,
        politics: skillSchema,
        science: skillSchema,
    }),
    physical: z.object({
        athletics: skillSchema,
        brawl: skillSchema,
        drive: skillSchema,
        firearms: skillSchema,
        larceny: skillSchema,
        stealth: skillSchema,
        survival: skillSchema,
        weaponry: skillSchema,
    }),
    social: z.object({
        animal_ken: skillSchema,
        empathy: skillSchema,
        expression: skillSchema,
        intimidation: skillSchema,
        persuasion: skillSchema,
        socialize: skillSchema,
        streetwise: skillSchema,
        subterfuge: skillSchema,
    }),
  });

  export type SkillCategory = "mental" | "physical" | "social";

  const mentalSkillsKeySchema = skillsSchema.shape.mental.keyof();
  const physicalSkillsKeySchema = skillsSchema.shape.physical.keyof();
  const socialSkillsKeySchema = skillsSchema.shape.social.keyof();

  export type SkillNames = z.infer<
  typeof mentalSkillsKeySchema | typeof physicalSkillsKeySchema | typeof socialSkillsKeySchema
>;

  export type Skills = z.infer<typeof skillsSchema>;

  export type SkillsKeys = {
    [K in keyof Skills]: {
      [A in keyof Skills[K]]: string;
    };
  };

  export const getSkillCategory = (skill: SkillNames): SkillCategory => {
    if (["academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science"].includes(skill)) {
        return "mental";
    } else if (["athletics", "brawl", "drive", "firearms", "larceny", "stealth", "survival", "weaponry"].includes(skill)) {
        return "physical";
    } else if (["animal_ken", "empathy", "expression", "intimidation", "persuasion", "socialize", "streetwise", "subterfuge"].includes(skill)) {
        return "social";
    } else {
        // Handle cases where the skill name doesn't match any category
        throw new Error(`Invalid skill category for skill: ${skill}`);
    }
    };

    export const currentSkillLevel = (
      awakened: Awakened,
      skill: string,
    ): { level: number; totalXpNeeded: number; pastXpNeeded: number[] } => {
      const skills = awakened.skills as any;
      const category = getSkillCategory(skill as any) as string;
      const skillData = skills[category][skill] as Skill; // Get the attribute data
    
      // Extract the required properties from attributeData
      let { creationPoints, freebiePoints = 0, experiencePoints = 0 } = skillData;
          
      let totalXpNeeded = 0;
      let pastXpNeeded = [0];
    
      if (experiencePoints === 0) {
        let level = creationPoints + freebiePoints;
        let xpNeeded = (level + 1) * 5;
        totalXpNeeded = xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
        return { level, totalXpNeeded, pastXpNeeded };
      } else {
        let level = creationPoints + freebiePoints;
        let xpNeeded = (level + 1) * 5;
        totalXpNeeded += xpNeeded;
        pastXpNeeded.push(totalXpNeeded);
    
        while (experiencePoints >= xpNeeded) {
          level++;
          experiencePoints -= xpNeeded;
          xpNeeded = (level + 1) * 5;
          totalXpNeeded += xpNeeded;
          pastXpNeeded.push(totalXpNeeded);
        }
    
        return { level, totalXpNeeded, pastXpNeeded };
      }
    };

 export const allSkills: SkillNames[] = [
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
  
  export const skillTooltips: SkillsKeys = {
    mental: {
        academics: "The ability to research, analyze, and understand complex topics. Academics includes knowledge of history, literature, and the sciences.",
        computer: "The ability to use and manipulate computers, software, and digital technology. This skill includes programming and hacking abilities.",
        crafts: "The ability to create and repair physical objects. Crafts includes woodworking, metalworking, and other manual trades.",
        investigation: "The ability to gather information through interviews, research, and surveillance. Investigation includes detecting lies, analyzing clues, and profiling.",
        medicine: "The ability to diagnose and treat injuries and illnesses. Medicine includes knowledge of anatomy, pharmacology, and surgery.",
        occult: "The ability to understand and manipulate supernatural forces. Occult includes knowledge of magic, ghosts, and other paranormal phenomena.",
        politics: "The ability to navigate and influence government, bureaucracy, and other power structures. Politics includes knowledge of law, diplomacy, and propaganda.",
        science: "The ability to understand and apply scientific principles. Science includes knowledge of biology, physics, and chemistry.",    
    },
    physical: {
        athletics: "The ability to run, jump, climb, and swim. Athletics also includes knowledge of sports and physical training techniques.",
        brawl: "The ability to fight using fists, feet, and other unarmed strikes. Brawl also includes knowledge of martial arts and grappling techniques.",
        drive: "The ability to operate and control land-based vehicles. Drive includes knowledge of car mechanics and navigation.",
        firearms: "The ability to use and maintain firearms. Firearms includes knowledge of marksmanship and ballistics.",
        larceny: "The ability to steal and pick locks. Larceny includes knowledge of sleight of hand and burglary techniques.",
        stealth: "The ability to move and operate silently and without being noticed. Stealth includes knowledge of camouflage and infiltration techniques.",
        survival: "The ability to live and survive in the wilderness. Survival includes knowledge of foraging, hunting, and shelter building.",
        weaponry: "The ability to use and maintain weapons other than firearms, such as swords, axes, and bows.",
          },
    social: {
        animal_ken: "The ability to understand and communicate with animals. Animal Ken also includes knowledge of animal behavior and training techniques.",
        empathy: "The ability to read and understand the emotions and motivations of others. Empathy also includes the ability to comfort and support others.",
        expression: "The ability to communicate effectively through various media, such as writing, speaking, and performing. Expression includes knowledge of rhetoric and artistic techniques.",
        intimidation: "The ability to intimidate and coerce others through physical or psychological means. Intimidation also includes knowledge of interrogation techniques.",
        persuasion: "The ability to convince and persuade others through argument and charisma. Persuasion includes knowledge of negotiation and debate techniques.",
        socialize: "The ability to navigate and influence social situations. Socialize includes knowledge of etiquette and diplomacy.",
        streetwise: "The ability to survive and thrive in urban environments. Streetwise includes knowledge of criminal organizations and urban subcultures.",
        subterfuge: "The ability to deceive and manipulate others through stealth and guile. Subterfuge includes knowledge of disguise and misdirection techniques.",
        },
  };
  