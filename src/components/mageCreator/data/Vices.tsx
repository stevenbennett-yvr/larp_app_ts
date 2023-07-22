import { z } from "zod";

export const viceNameSchema = z.union([
  z.literal("Envy"),
  z.literal("Gluttony"),
  z.literal("Greed"),
  z.literal("Lust"),
  z.literal("Pride"),
  z.literal("Sloth"),
  z.literal("Wrath"),
  z.literal(""),
]);
export type ViceName = z.infer<typeof viceNameSchema>;

export const ViceSchema = z.object({
  name: viceNameSchema,
  description: z.string(),
});

export type Vice = z.infer<typeof ViceSchema>;

export const Vices: Record<ViceName, Vice> = {
  Envy: {
    name: "Envy",
    description: `
      <p>Your character regains one Willpower point whenever she gains something important at a rival’s expense or has a hand in harming that rival’s wellbeing.</p>
      <p><strong>Other Names:</strong> Covetousness, jealousy, paranoia</p>
    `,
  },
  Gluttony: {
    name: "Gluttony",
    description: `
      <p>Your character regains one spent Willpower point whenever he indulges in his addiction or appetites at some risk to himself or a loved one.</p>
      <p><strong>Other Names:</strong> Addictive personality, conspicuous consumer, epicurean</p>
    `,
  },
  Greed: {
    name: "Greed",
    description: `
      <p>Your character regains one Willpower point whenever he acquires something at the serious expense of another.</p>
      <p><strong>Other Names:</strong> Avarice, parsimony</p>
    `,
  },
  Lust: {
    name: "Lust",
    description: `
      <p>Your character regains one Willpower point whenever he satisfies his desire to the detriment of themselves or others.</p>
      <p><strong>Other Names:</strong> Lasciviousness, impatience, impetuousness</p>
    `,
  },
  Pride: {
    name: "Pride",
    description: `
      <p>Your character regains one Willpower point whenever he acts to protect his reputation to the potential risk of loss of face.</p>
      <p><strong>Other Names:</strong> Arrogance, ego complex, vanity</p>
    `,
  },
  Sloth: {
    name: "Sloth",
    description: `
      <p>Your character regains one Willpower point whenever he successfully avoids a difficult task but achieves the same goal nonetheless.</p>
      <p><strong>Other Names:</strong> Apathy, cowardice, ignorance</p>
    `,
  },
  Wrath: {
    name: "Wrath",
    description: `
      <p>Your character regains one spent Willpower point whenever he spitefully lashes out to his satisfaction.</p>
      <p><strong>Other Names:</strong> Antisocial tendencies, hot-headedness, poor anger management, sadism</p>
    `,
  },
  "": {
    name: "",
    description: "",
  }
};