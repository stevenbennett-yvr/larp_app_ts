import { faChurch, faDumpsterFire, faFilm, faGhost, faGraduationCap, faHandcuffs, faMartiniGlassCitrus, faPiggyBank, faScaleBalanced, faScrewdriver, faSkullCrossbones, faStaffSnake, faTents, faTruckPlane, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";



export const sphereOfInfluenceSchema = z.union([
    z.literal("church"),
    z.literal("finance"),
    z.literal("health"),
    z.literal("high society"),
    z.literal("industry"),
    z.literal("legal"),
    z.literal("media"),
    z.literal("occult"),
    z.literal("police"),
    z.literal("politics"),
    z.literal("service industry"),
    z.literal("street"),
    z.literal("transportation"),
    z.literal("underworld"),
    z.literal("university"),
    z.literal("")
])
export type V5SphereKey = z.infer<typeof sphereOfInfluenceSchema>

export const SphereSelectData = [
    "church",
    "finance",
    "health",
    "high society",
    "industry",
    "legal",
    "media",
    "occult",
    "police",
    "politics",
    "service industry",
    "street",
    "transportation",
    "underworld",
    "university",
];

export const sphereSchema = z.object({
    summary: z.string(),
    symbol: z.any(),
})

export type Sphere = z.infer<typeof sphereSchema>

export const Spheres: Record<V5SphereKey, Sphere> = {
    church: {
        summary: "Contacts and Allies in the Church sphere involve individuals connected to religious institutions and clergy, offering access to spiritual resources and guidance.",
        symbol: faChurch,
    },
    finance: {
        summary: "This sphere encompasses individuals tied to the world of money and finance, such as bankers, investors, and financial advisors, providing opportunities for wealth and financial influence.",
        symbol: faPiggyBank,
    },
    health: {
        summary: "Contacts and Allies in the Health sphere are connected to medical professionals, hospitals, or research institutions, offering access to medical services and knowledge.",
        symbol: faStaffSnake,
    },
    "high society": {
        summary: "This sphere includes people from the upper echelons of society, such as aristocrats, celebrities, and socialites, granting access to exclusive events and social circles.",
        symbol: faMartiniGlassCitrus,
    },
    industry: {
        summary: "Contacts and Allies in the Industry sphere are associated with various businesses and corporations, offering access to resources and opportunities within the business world.",
        symbol: faScrewdriver,
    },
    legal: {
        summary: "Legal sphere connections involve lawyers, judges, and legal experts, providing assistance in legal matters and influence within the legal system.",
        symbol: faScaleBalanced,
    },
    media: {
        summary: "This sphere includes journalists, media moguls, and PR professionals, offering control over public perception and access to information channels.",
        symbol: faFilm,
    },
    occult: {
        summary: "Contacts and Allies within the Occult sphere are tied to the supernatural and esoteric world, providing knowledge and resources related to mystical and paranormal matters.",
        symbol: faGhost,
    },
    police: {
        summary: "This sphere comprises law enforcement personnel, detectives, and officers, offering protection and insights into criminal investigations.",
        symbol: faHandcuffs,
    },
    politics: {
        summary: "Political sphere connections involve politicians, lobbyists, and government officials, offering influence and access to political power and decision-making.",
        symbol: faDumpsterFire,
    },
    "service industry": {
        summary: "Contacts and Allies in the Service Industry sphere include individuals from the hospitality sector, like waitstaff, concierges, and hotel managers, providing assistance and access to various services.",
        symbol: faUtensils,
    },
    street: {
        summary: "This sphere involves connections with street-level individuals, such as gang members, informants, and urban hustlers, offering insight into the city's underground activities and street-level knowledge.",
        symbol: faTents,
    },
    transportation: {
        summary: "Transportation sphere contacts are linked to the world of logistics and transportation, providing access to vehicles, routes, and movement-related resources.",
        symbol: faTruckPlane,
    },
    underworld: {
        summary: "Individuals in the Underworld sphere are connected to the criminal underworld, offering access to illegal activities, smuggling, and covert dealings.",
        symbol: faSkullCrossbones,
    },
    university: {
        summary: "This sphere encompasses academics, scholars, and researchers, offering access to educational resources, libraries, and intellectual knowledge.",
        symbol: faGraduationCap,
    },
    "": {
        summary: "",
        symbol: "",
    },
}
