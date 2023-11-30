import { z } from "zod";
import { mageLogo } from "../../../assets/images/TatteredVeil";
import { v5Logo } from "../../../assets/images/GoodIntentions";

export const chronicleNameSchema = z.union([
    z.literal('Tattered Veil'),
    z.literal('Good Intentions'),
    z.literal(''),
])

export type ChronicleName = z.infer<typeof chronicleNameSchema>

export const gameLineSchema = z.union([
    z.literal('Mage the Awakening 1st Edition'),
    z.literal('Laws of the Night V5'),
    z.literal('')
])

export type GameLine = z.infer<typeof gameLineSchema>

export const chronicleSchema = z.object({
    name: chronicleNameSchema,
    gameLine: gameLineSchema,
    path: z.string(),
    logo: z.string(),
    color: z.string(),
    documents: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    leadStoryteller: z.string(),
    staff: z.string().array(),
})

export type Chronicle = z.infer<typeof chronicleSchema>
export const chronicleKeySchema = chronicleSchema.keyof()
export type ChronicleKey = z.infer<typeof chronicleKeySchema>

export const Chronciles: Record<ChronicleName, Chronicle> = {
    "Tattered Veil": {
        name: "Tattered Veil",
        path: "/tattered-veil",
        gameLine: "Mage the Awakening 1st Edition",
        logo: mageLogo,
        color: "#134f5c",
        documents: "https://docs.google.com/document/d/14Bj_az4YHf7G4utiwAK0-QMoYzok5gd5mbtsjngQ43I/",
        startDate: new Date(2023, 7, 1).toISOString(),
        endDate: "",
        leadStoryteller: "tattered.veil",
        staff: []
    },
    "Good Intentions": {
        name: "Good Intentions",
        path: "/good-intentions",
        gameLine: "Laws of the Night V5",
        logo: v5Logo,
        color: "#86306c",
        documents: "https://www.goodintentions.canadaatmidnight.com",
        startDate: new Date(2023, 9, 1).toISOString(),
        endDate: "",
        leadStoryteller: "good.intentions",
        staff: ["creative.director@canadaatmidnight.com", "good.intentions@canadaatmidnight.com", "good.intentions.second@canadaatmidnight.com", "good.intentions.hermeticorder@canadaatmidnight.com", "good.intentions.hestiafoundation@canadaatmidnight.com", "good.intentions.scarletedict@canadaatmidnight.com", "good.intentions.media@canadaatmidnight.com", "nta@canadaatmidnight.com"]
    },
    "": {
        name: "",
        gameLine: "",
        path: "/",
        logo: "",
        color: "",
        documents: "",
        startDate: "",
        endDate: "",
        leadStoryteller: "",
        staff: []
    },
}