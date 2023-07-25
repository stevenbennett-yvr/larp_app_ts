import { z } from "zod";
import { Awakened } from "./Awakened";

const attributeSchema = z.object({
  creationPoints: z.number().min(1).max(6).int(),
  freebiePoints: z.number().min(0).int(),
  experiencePoints: z.number().min(0).int(),
});

export type Attribute = z.infer<typeof attributeSchema>;

export const attributesSchema = z.object({
    mental: z.object({
        intelligence: attributeSchema,
        wits: attributeSchema,
        resolve: attributeSchema,
    }),
    physical: z.object({
        strength: attributeSchema,
        dexterity: attributeSchema,
        stamina: attributeSchema,
    }),
    social: z.object({
        presence: attributeSchema,
        manipulation: attributeSchema,
        composure: attributeSchema,
    }),
  });
  
  export type AttributeCategory = "mental" | "physical" | "social";

  const mentalAttributesKeySchema = attributesSchema.shape.mental.keyof();
  const physicalAttributesKeySchema = attributesSchema.shape.physical.keyof();
  const socialAttributesKeySchema = attributesSchema.shape.social.keyof();

  export type AttributeNames = z.infer<
  typeof mentalAttributesKeySchema | typeof physicalAttributesKeySchema | typeof socialAttributesKeySchema
>;  

  export type Attributes = z.infer<typeof attributesSchema>;

  type AttributeTooltips = {
    [K in keyof Attributes]: {
      [A in keyof Attributes[K]]: string;
    };
  };

  export const allAttributes: AttributeNames[] = [
    "intelligence",
    "wits",
    "resolve",
    "strength",
    "dexterity",
    "stamina",
    "presence",
    "manipulation",
    "composure"
  ]

  export const attributeTooltips: AttributeTooltips = {
    mental: {
      intelligence: "The raw power of the mind. Cognitive capacity. The inherent capability to digest, comprehend and remember information -- and to learn more. Intelligence is a direct measure of how smart your character is.",
      wits: "The ability to think on one's feet, under pressure or duress, without letting them see you sweat. Wits also encompasses an eye for detail, the ability to absorb what's going on in the environment, and to react to events.",
      resolve: "The focus and determination to see your character's will done. The capacity to stay on target, ignore distractions and to resist coercion or browbeating. Resolve is your character's mental fortitude.",

    },
    physical: {
      strength: "Physical might. Sheer bodily power. The capacity to lift objects, move items, hit things and people, and do damage. Strength is a measure of muscle.",
      dexterity: "Quickness. Response time. A delicate touch. Dexterity indicates how quickly and with how much finesse your character responds to his physical world.",
      stamina: "Sturdiness. Steadfastness. Sheer physical resilience. Stamina is a measure of how tough your character is. It indicates how far she can push her body, and how much physical abuse she can endure.",
    },
    social: {
      presence: "Bearing. Stature. Assertiveness. Presence suggests the power of your character's very identity. Attractiveness is only part of the trait. Your character may be jaw-dropping gorgeous, plain-Jane or downright ugly, but her Presence means much more. It reflects her sheer command over the attention of others.",
      manipulation: "Charm. Persuasiveness. Charisma. The capacity to play upon the desires, hopes and needs of others to influence them. Manipulation reflects your character's finesse in social situations.",
      composure: "Poise. Dignity. The capacity to remain calm and appear --and actually be-- unfazed in social and threatening situations, usually harrowing ones.",
    },
  };
  

  export const getAttributeCategory = (attribute: AttributeNames): AttributeCategory => {
    if ([ "intelligence", "wits", "resolve"].includes(attribute)) {
        return "mental";
    } else if ([ "strength", "dexterity", "stamina",].includes(attribute)) {
        return "physical";
    } else if ([ "presence", "manipulation", "composure"].includes(attribute)) {
        return "social";
    } else {
        // Handle cases where the skill name doesn't match any category
        throw new Error(`Invalid skill category for skill: ${attribute}`);
    }
    };

    export const currentAttributeLevel = (
      awakened: Awakened,
      attribute: string,
    ): { level: number; totalXpNeeded: number; pastXpNeeded: number[] } => {
      const attributes = awakened.attributes as any;
      const category = getAttributeCategory(attribute as any) as string;
      const attributeData = attributes[category][attribute] as Attribute; // Get the attribute data
    
      // Extract the required properties from attributeData
      let { creationPoints, freebiePoints = 0, experiencePoints = 0 } = attributeData;
          
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


    type VariableKeys = "creationPoints" | "freebiePoints" | "experiencePoints";
    export const handleAttributeChange = (awakened: Awakened, setAwakened: Function, attribute: AttributeNames, variableKey: VariableKeys, value: number) => {
      let category = getAttributeCategory(attribute);
      
      const updatedAttributes = {
        ...awakened.attributes,
        [category]: {
          ...(awakened.attributes[category] as { [K in AttributeNames]: Attribute }),
          [attribute]: {
            ...(awakened.attributes[category as keyof Attributes][attribute as keyof Attributes[AttributeCategory]] as Attribute),
              [variableKey]: value
          }
        }
      };
    
      const updatedAwakened = {
        ...awakened,
        attributes: updatedAttributes
      };
    
      setAwakened(updatedAwakened); // Update the awakened object with the updatedAttributes
    };
    