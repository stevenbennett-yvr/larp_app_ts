import { z } from "zod";
import MageLogo from '../../tatteredVeil/resources/MageAwakeningLogo.webp'
import VampireLogo from '../resources/VampireMasqueradeV5Logo.webp'

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
    logo: z.string(),
    color: z.string(),
    documents: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
})

export type Chronicle = z.infer<typeof chronicleSchema>
export const chronicleKeySchema = chronicleSchema.keyof()
export type ChronicleKey = z.infer<typeof chronicleKeySchema>

export const Chronciles: Record<ChronicleName, Chronicle> = {
    "Tattered Veil": {
        name: "Tattered Veil",
        gameLine: "Mage the Awakening 1st Edition",
        logo: MageLogo,
        color: "#134f5c",
        documents: "https://docs.google.com/document/d/14Bj_az4YHf7G4utiwAK0-QMoYzok5gd5mbtsjngQ43I/",
        startDate: new Date(2023, 7, 1).toISOString(),
        endDate: ""
    },
    "Good Intentions": {
        name: "Good Intentions",
        gameLine: "Laws of the Night V5",
        logo: VampireLogo,
        color: "#86306c",
        documents: "",
        startDate: "",
        endDate: ""
    },
    "": {
        name: "",
        gameLine: "",
        logo: "",
        color: "",
        documents: "",
        startDate: "",
        endDate: ""
    },
}