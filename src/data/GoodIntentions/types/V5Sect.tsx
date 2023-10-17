import { z } from "zod";
import { clanNameSchema } from "./V5Clans";
import * as GoodIntentions from "../../../assets/images/GoodIntentions";

export const sectNameSchema = z.union([
    z.literal('Anarch'),
    z.literal('Autarkis'),
    z.literal('Camarilla'),

    z.literal(''),
])

export type SectName = z.infer<typeof sectNameSchema>


export const sectSchema = z.object({
    name: sectNameSchema,
    nicknames: z.string(),
    summary: z.string(),
    description: z.string(),
    logo: z.string(),
    symbol: z.string(),
    clans: z.array(z.object({name:clanNameSchema,note:z.string()})),
})

export type Sect = z.infer<typeof sectSchema>

export const Sects: Record<SectName, Sect> = {
    Camarilla:{
        name: "Camarilla",
        nicknames: "The Tower",
        summary: "A secretive and hierarchical sect that seeks to maintain the Masquerade",
        description: `The Camarilla is one of the most organized and influential Kindred organizations in history. Their goal is to preserve the masquerade and keep Kindred in line with rules that help protect their society from the prying mortal eye. Beyond this, it is a conspiracy to help elders preserve their power built on an undead secret society that influences global business and politics. The Camarilla is the closest thing they have to a system of government and an international union of cities. It is completed by an inner circle and its Justicars and Archons that roam the world to "keep the peace". A fierce moral stance is held on preserving humanity even against the impulses of the Blood, seeing themselves as shepherds to the herds of mortals they blindly control. Many Camarilla members have a wealth of power and money, on top of their age and the inclusion of Anarch defects joining their ranks makes the sect distinctly upper class.`,
        logo: GoodIntentions.camarillaLogo,
        symbol: GoodIntentions.camarillaSymbol,
        clans: [{name:"Banu Haqim",note:""}, {name:"Lasombra", note:""}, {name:"Malkavian", note:""}, {name:"Nosferatu",note:""}, {name:"Toreador", note:""}, {name:"Tremere", note:""}, {name:"Ventrue", note:""}, {name:"Brujah", note:"dissident"}, {name:"Gangrel",note:"dissident"}]
    },
    Anarch:{
        name: "Anarch",
        nicknames: "The Movement",
        summary: "An organized group of rebellious vampires who reject the authority of Elders",
        description: `Originally called the Anarch Revolt, this sect is as old as the revolution against the Camarilla itself. In recent decades it has seen vast growth as younger kindred find it increasingly difficult to understand why they must follow the laws of elders who care nothing for them, but to throw them in harms way when needed. All vampires who fall outside of the Tower's control are considered "unbound", and the Anarch movement is a small but visible subsection of the unbound who, rather than hide, have decided to fight back. They fight to claim territory from those who oppress them, as the ancient hands that held onto it are disappearing due to the Beckoning or other outside forces.`,
        logo: GoodIntentions.anarchLogo,
        symbol: GoodIntentions.anarchSymbol,
        clans: [{name:"Brujah",note:""}, {name:"Gangrel",note:""},{name:"Ministry",note:""},{name:"Caitiff",note:"sometimes"}]
    },
    Autarkis:{
        name: "Autarkis",
        nicknames: "The Independent",
        summary: "A diverse collection of vampires who don't align with any Sect",
        description: `The Autarkis are Kindred who remain unbound to political sects, either through refusal to allow other sects to move into their domain or by simply refusing to align themselves to any cause but their own. Their ambitions usually lie in protecting their own unlives or lineage, and they care little for others.`,
        logo:GoodIntentions.autarkisLogo,
        symbol:GoodIntentions.autarkisSymbol,
        clans: [{name:"Hecata",note:""},{name:"Lasombra",note:"rogue"},{name:"Ravnos",note:""},{name:"Salubri",note:""},{name:"Thin-Blood",note:""},{name:"Tzimisce",note:""},{name:"Caitiff",note:"sometimes"}],
    },
    "":{
        name: "",
        nicknames: "",
        summary: "",
        description: ``,
        logo:"",
        symbol:"",
        clans: [],
    }
}