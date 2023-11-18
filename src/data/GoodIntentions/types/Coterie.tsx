import { z } from "zod";
import { v5MeritFlawRefSchema, meritFlawData } from "./V5MeritsOrFlaws";
import { v5BenefitRefSchema } from "./V5Benefits";

export const coterieRefSchema = z.object({
    id: z.string(),
    territoryContributions: v5BenefitRefSchema.array(),
})

export const domainSchema = z.object({
    location: z.string(),
    description: z.string()
})

export const v5CoterieSchema = z.object({
    id: z.string(),
    vssId: z.string(),
    name: z.string(),
    concept: z.string(),
    goals: z.string(),
    ownerId: z.string(),
    meritsFlaws: v5MeritFlawRefSchema.array(),
    domain: domainSchema,
})

export type Coterie = z.infer<typeof v5CoterieSchema>

export const getEmptyCoterie = (): Coterie => {
    return {
        id: "",
        vssId: "",
        name: "",
        concept: "",
        goals: "",
        ownerId: "",
        meritsFlaws: [],
        domain: {
            location: "",
            description: "",
        }
    }
}

export const getTotalCoterieMeritPoints = (coterie:Coterie) => {
    let totalFlawPoints = 0;
    let totalMeritPoints = 0;
    const coterieMerits = (!coterie.meritsFlaws ? [] : coterie.meritsFlaws)
    Object.values(Object.values(coterieMerits)).forEach((mf) => {
      const meritFlawInfo = meritFlawData.find((entry) => entry.name === mf.name);
      if (meritFlawInfo) {
        if (meritFlawInfo.type === "flaw" && meritFlawInfo.category !== "thin-blood") {
          totalFlawPoints += mf.creationPoints;
        }
        if (meritFlawInfo.type === "merit" && meritFlawInfo.category !== "thin-blood") {
          totalMeritPoints += mf.creationPoints;
        }
      }
    });
    return { totalFlawPoints, totalMeritPoints };
}