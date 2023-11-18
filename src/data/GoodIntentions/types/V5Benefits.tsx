import { z } from "zod";
import { sphereOfInfluenceSchema } from "./V5Spheres";
import { faCity, faFaceAngry, faFaceGrinTongue, faFaceSmileBeam } from "@fortawesome/free-solid-svg-icons";
import { Kindred } from "./Kindred";
import { getNumberBelow } from "../../../utils/getNumberBelow";

export const v5BenefitNameSchema = z.union([
    z.literal("comfort"),
    z.literal("connections"),
    z.literal("deterrents"),
    z.literal("")
]);

export type BenefitName = z.infer<typeof v5BenefitNameSchema>

export const v5BenefitRefSchema = z.object({
    name: v5BenefitNameSchema,
    id: z.string(),
    sphere: sphereOfInfluenceSchema,
    freebiePoints: z.number(),
    experiencePoints: z.number(),
});

export type V5BenefitRef = z.infer<typeof v5BenefitRefSchema>

export const getEmtpyComfort: V5BenefitRef = {
    name: "comfort",
    id: "comfort",
    sphere: "",
    freebiePoints: 0,
    experiencePoints: 0,
}

export const v5BenefitSchema = z.object({
    name: v5BenefitNameSchema,
    summary: z.string(),
    description: z.string(),
    source: z.string(),
    icon: z.any(),
})

export type V5Benefit = z.infer<typeof v5BenefitSchema>

export const Benefits: Record<BenefitName, V5Benefit> = {
    comfort: {
        name: "comfort",
        summary: "Size and Health of your territory",
        description: "Comfort reflects the health of a Territory, encompassing the well-being of mortals and ease of feeding. Coterie territories start with one free dot of Comfort, influencing the Territory's relative size. Hunting challenges in a Territory with one dot of Comfort have a difficulty of 6, with each additional dot lowering the difficulty. A Territory can have a maximum of five dots in Comfort, with the primary focus on feeding ease rather than physical size. Exceptions exist, allowing for unique configurations like a large abandoned area with a Comfort of one or a compact urban high-rise with a Comfort value of five.",
        source: "",
        icon: faCity,
    },
    connections: {
        name: "connections",
        summary: "Influence within your territory.",
        description: "Connections represent how well a coterie has integrated with the mortal population in their Territory, and when purchasing them, a Sphere of Influence must be chosen, allowing the acquisition of up to three dots of Connections per Sphere; each dot grants +1 to mundane pools for all coterie members interacting with mortals in that Sphere within coterie Territory, including tasks involving personal Backgrounds.",
        source: "",
        icon: faFaceSmileBeam,
    },
    deterrents: {
        name: "deterrents",
        summary: "Security from outside influence.",
        description: "Deterrents, representing the security of the mortal population in a Territory, are focused on specific Spheres of Influence, with up to 3 dots purchasable per Sphere. Each dot imposes a -1 penalty on non-coterie characters' mundane pools when interacting with mortals in that Sphere within the Territory, including tasks involving personal Backgrounds. Deterrents increase the difficulty for external characters operating in the Territory, and any coterie member can allow others to ignore their Deterrent traits by notifying the Storyteller.",
        source: "",
        icon: faFaceAngry,
    },
    "": {
        name: "",
        summary: "",
        description: "",
        source: "",
        icon: faFaceGrinTongue,
    }
}

export const v5BenefitRefs: V5BenefitRef[] = Object.values(Benefits).map((b) => ({
    name: b.name,
    id: "",
    sphere: "",
    freebiePoints: 0,
    experiencePoints: 0,
}))


type VariableKeys = "freebiePoints" | "experiencePoints";

export const handleBenefitChange = (
    kindred: Kindred,
    setKindred: Function,
    benefit: V5BenefitRef,
    type: VariableKeys,
    newPoints: number,
) => {
    const existingBenefit = kindred.coterie.territoryContributions.find((b) => b.id === benefit.id);
    if (existingBenefit) {
        const updatedBenefits = kindred.coterie.territoryContributions.map((b) =>
            b.id === benefit.id ? { ...b, [type]: newPoints } : b
        );
        setKindred({ ...kindred, coterie:{ ...kindred.coterie, territoryContributions:updatedBenefits}});
    } else {
        setKindred({
            ...kindred,
            coterie: {...kindred.coterie, territoryContributions: [...kindred.coterie.territoryContributions, { ...benefit, [type]: newPoints }]},
        });
    }
};

export const v5HandleXpBenefitChange = (
    character: any,
    setCharacter: Function,
    background: V5BenefitRef,
    value: number) => {
    const { totalXpNeeded, pastXpNeeded } = v5BenefitLevel(background)
    let xp = value > background.experiencePoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, value)
    handleBenefitChange(character, setCharacter, background, "experiencePoints", xp)
    return xp
}

export const handleBackgroundRemove = (
    kindred: Kindred,
    setKindred: Function,
    backgroundRef: V5BenefitRef
) => {
    const backgroundsToRemove = [] as V5BenefitRef[];
    backgroundsToRemove.push(backgroundRef)
    const updatedBackgrounds = kindred.coterie.territoryContributions.filter((b) => !backgroundsToRemove.includes(b))
    setKindred({ ...kindred, coterie: { ...kindred.coterie, territoryContributions:updatedBackgrounds } });
}

export const v5BenefitLevel = (v5BenefitRef: V5BenefitRef) => {
    let totalXpNeeded = 0
    let pastXpNeeded = [0]
    let { experiencePoints, freebiePoints } = v5BenefitRef

    if (experiencePoints === 0) {
        let level = freebiePoints
        let xpNeeded = 3;
        totalXpNeeded = xpNeeded
        pastXpNeeded.push(totalXpNeeded)
        level = Math.min(level, (v5BenefitRef.name==="comfort"? 5:3))
        return { level, totalXpNeeded, pastXpNeeded}
    } else {
        let level = freebiePoints
        let xpNeeded = 3
        totalXpNeeded += xpNeeded
        pastXpNeeded.push(totalXpNeeded);
        while (experiencePoints >= xpNeeded) {
            level++;
            experiencePoints -= xpNeeded;
            xpNeeded = 3;
            totalXpNeeded += xpNeeded;
            pastXpNeeded.push(totalXpNeeded);
        }
        level = Math.min(level, (v5BenefitRef.name==="comfort"? 5:3))
        return { level, totalXpNeeded, pastXpNeeded }
    }
}

export const combineBenefits = (coterieKindred: Kindred[]): V5BenefitRef[] => {
    const combinedBenefits: { [key: string]: V5BenefitRef } = {};

    coterieKindred.forEach((kindred) => {
        kindred.coterie.territoryContributions.forEach((benefit) => {
            const key = `${benefit.name}-${benefit.sphere}`;

            if (!combinedBenefits[key]) {
                combinedBenefits[key] = { ...benefit };
            } else {
                combinedBenefits[key].freebiePoints += benefit.freebiePoints;
                combinedBenefits[key].experiencePoints += benefit.experiencePoints;
            }
        });
    });

    return Object.values(combinedBenefits);
};