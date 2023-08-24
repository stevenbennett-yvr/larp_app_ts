import { z } from "zod";

export const virtueNameSchema = z.union([
    z.literal("Charity"),
    z.literal("Faith"),
    z.literal("Fortitude"),
    z.literal("Hope"),
    z.literal("Justice"),
    z.literal("Prudence"),
    z.literal("Temperance"),
    z.literal(""),
])
export type VirtueName = z.infer<typeof virtueNameSchema>

export const VirtueSchema = z.object({
        name: virtueNameSchema,
        description: z.string(),
    })

export type Virtue = z.infer<typeof VirtueSchema>

export const Virtues: Record<VirtueName, Virtue> = {
  Charity: {
    name: "Charity",
    description:
      "<p>Your character regains all spent Willpower points whenever she helps another at the risk of serious loss or harm to herself.</p><p><strong>Other Names:</strong> Compassion, mercy</p>",
  },
  Faith: {
    name: "Faith",
    description:
      "<p>Your character regains all spent Willpower points whenever he is able to forge meaning from chaos and tragedy.</p><p><strong>Other Names:</strong> Belief, conviction, humility, loyalty</p>",
  },
  Fortitude: {
    name: "Fortitude",
    description:
      "<p>Your character regains all spent Willpower points whenever he withstands overwhelming or tempting pressure to alter his goals.</p><p><strong>Other Names:</strong> Courage, integrity, mettle, stoicism</p>",
  },
  Hope: {
    name: "Hope",
    description:
      "<p>Your character regains all spent Willpower points whenever she refuses to let others give in to despair, even though doing so risks harming her own goals or wellbeing.</p><p><strong>Other Names:</strong> Optimism, assurance</p>",
  },
  Justice: {
    name: "Justice",
    description:
      "<p>Your character regains all spent Willpower points whenever he does the right thing at risk of personal loss or setback.</p><p><strong>Other Names:</strong> Fairness</p>",
  },
  Prudence: {
    name: "Prudence",
    description:
      "<p>Your character regains all spent Willpower points whenever he refuses a tempting course of action by which he could gain significantly. The “temptation” must involve some reward that, by refusing it, might cost him later on.</p><p><strong>Other Names:</strong> Patience, vigilance</p>",
  },
  Temperance: {
    name: "Temperance",
    description:
      "<p>Your character regains all spent Willpower points when he resists a temptation to indulge in an excess of any behavior, whether good or bad, despite the obvious rewards it might offer.</p><p><strong>Other Names:</strong> Restraint</p>",
  },
  "": {
    name: "",
    description: "",
  },
};