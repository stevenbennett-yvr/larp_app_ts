import { z } from "zod";

const ownerSchema = z.object({
    id: z.string(),
    uid: z.string(),
})

const activitySchema = z.object({
    owner: ownerSchema,
    description: z.string(),
    timestamp: z.string().datetime()
})

const mageBountySchema = z.object({
    owner: ownerSchema,
    title: z.string(),
    description: z.string(),
    activity: z.array(activitySchema),
})

export type MageBounty = z.infer<typeof mageBountySchema>;

export const getEmptyMageBounty = (): MageBounty => {
    return {
        owner: {
            id: "",
            uid: "",
        },
        title: "",
        description: "<p> </p><p>Your initial <b>Bounty</b> description.</p><p>Fill with whatever details you need to get others up to speed.</p>",
        activity: []
    }
}