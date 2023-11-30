import { z } from "zod";
import { chronicleNameSchema } from "./Chronicles";
import { sectNameSchema } from "../../GoodIntentions/types/V5Sect";
import { clanNameSchema } from "../../GoodIntentions/types/V5Clans";
import { predatorTypeNameSchema } from "../../GoodIntentions/types/V5PredatorType";

export const venueStyleSheetSchema = z.object({
    id: z.string(),
    name: z.string(),
    chronicle: chronicleNameSchema,
    domainCode: z.string(),
    storyteller: z.string(),
    staff: z.string().array().optional(),
    theme: z.string(),
    mood: z.string(),
    setting: z.string(),
    focus: z.string(),
    timeline: z.string(),
    notes: z.string(),
    scheduleDay: z.number(),
    scheduleWeek: z.number(),
    documents: z.string().array(),
    images: z.string().array(),
})

export const goodIntentionsVariablesSchema = z.object({
    vssId: z.string(),
    boundaries: z.string(),    
    sect: sectNameSchema,
    tenants: z.object({
        global: z.string(),
        sect: z.string(),
        venue: z.string(),
    }),
    bannedClans: clanNameSchema.array(),
    bannedSects: sectNameSchema.array(),
    bannedPredatorTypes: predatorTypeNameSchema.array(),
    bannedMerits: z.string().array(),
    bannedPowers: z.string().array(),
    bannedRituals: z.string().array(),
    bannedCeremonies: z.string().array(),
    bannedLoresheets: z.string().array(),
    bannedFormulae: z.string().array(),
})

const goodIntentionsVSSSchema = z.object({
    venueStyleSheet: venueStyleSheetSchema,
    goodIntentionsVariables: goodIntentionsVariablesSchema,
})

export type GoodIntentionsVenueStyleSheet = z.infer<typeof goodIntentionsVSSSchema>

export const GoodIntentionsVSSs: GoodIntentionsVenueStyleSheet[] = [
    {
        venueStyleSheet: {
            id: "GI-001",
            name: "Minutes to Midnight",
            chronicle: "Good Intentions",
            domainCode: "CND-001",
            storyteller: "vst.masq.001",
            staff: ["vst.masq.001@canadaatmidnight.com"],
            theme: "Survival, Faith, Loyalty, and Corruption",
            mood: "Tense and Excessive",
            setting: "Vancouver Camarilla, Burnaby and New Westminster Anarchs, and the Greater Vancouver area posing unknown risks. Elements of Coquitlam are generally understood as Hecata territory.",
            focus: "...",
            timeline: "...",
            notes: "Salubri, Hecata and PC ghouls are not available for play. It is encouraged that players generate characters Embraced within the last 2-3 years. If they were Embraced within 20 years, one must consider how multiple apocalyptic events have affected them.  “Older” Kindred are generally no later than the 1970s. It is exceptionally strange for an Anarch to be pushing 80 years — especially after the Long Night. Concepts that seek to be Embraced older than the 1970s will expect more Storyteller input.",
            scheduleDay: 6,
            scheduleWeek: 1,
            documents: [],
            images: [],
        },
        goodIntentionsVariables: {
            vssId: "GI-001",
            boundaries: "Greater Vancouver Regional District",
            sect: "Anarch",
            tenants: {
                global:"For the Good of the City, Right or Wrong",
                sect:"Gangs First, Vampires Second",
                venue:"Survival is Paramount"
            },
            bannedClans:["Hecata","Salubri","Ghoul"],
            bannedSects:[],
            bannedPredatorTypes:[],
            bannedMerits:[],
            bannedPowers:[],
            bannedCeremonies:[],
            bannedRituals:[],
            bannedLoresheets:[],
            bannedFormulae:[],
        }
    },
    {
        venueStyleSheet: {
            id: "GI-000",
            name: "Twisted Realities",
            chronicle: "Good Intentions",
            domainCode: "CND-000",
            storyteller: "vst.masq.000",
            staff: ["vst.masq.000@canadaatmidnight.com"],
            theme: "Mystery, Deception, and Illusion",
            mood: "Eerie and Uncanny",
            setting: "Metropolitan city, with a hidden supernatural underground. The nightclub serves as a neutral ground for different supernatural factions.",
            focus: "...",
            timeline: "...",
            notes: "Vampires of all generations are allowed. Characters can have affiliations with other supernatural beings, but maintaining the Masquerade is a top priority.",
            scheduleDay: 6,
            scheduleWeek: 4,
            documents: [],
            images: [],

        },
        goodIntentionsVariables: {
            vssId: "GI-000",
            boundaries: "New York Van Java",
            sect: "",
            tenants: {
                global:"Freedom Above All",
                sect:"Solidarity Against the Camarilla",
                venue:"Defiance in Unity"
            },
            bannedClans:[],
            bannedSects:[],
            bannedPredatorTypes:[],
            bannedMerits:[],
            bannedPowers:[],
            bannedCeremonies:[],
            bannedRituals:[],
            bannedLoresheets:[],
            bannedFormulae:[],
        }
    },
    {
        venueStyleSheet: {
            id: "GI-015",
            name: "Belli Nebula",
            chronicle: "Good Intentions",
            domainCode: "CND-015",
            storyteller: "vst.masq.015",
            staff: ["vst.masq.015@canadaatmidnight.com"],
            theme: "Too many mouths, not enough food. Personal Horror. Real consequences, for actions.",
            mood: "Street by street, story by story Montreal will be built.",
            setting: "Camarilla controls the downtown core, the old port. Hecate, and Anarchs exert control outside of those borders… but not much can be seen through the fog of war.",
            focus: "...",
            timeline: "...",
            notes: `<ul> <li> Proxy requests: Please send a request to play in Montreal to <a href="mailto:vst.masq.015@canadaatmidnight.com">vst.masq.015@canadaatmidnight.com</a> at least 24 hours before game time. Please include in your request your domain’s VSS, Character sheet, XP log, and CC your local storyteller in the email. </li> <li> Our games are primarily held in person, and communication can be done directly with the storyteller via Facebook <a href="https://www.facebook.com/quinn.kurenda/">https://www.facebook.com/quinn.kurenda/</a> or via the above email. </li> <li> Wherein the ST is happy to discuss anything via Facebook, Any official requests (Proxy requests, backgrounds, downtimes, etc) must be via the above email. </li> <li> Note on Camarilla Technology Ban: You may use your digital video, and communication devices but never record or transmit Masquerade Breaching content. If you wish to use such technology, there is a chance of being traced, tracked, or found. In order to avoid this possibility, you must possess a dot of Technology skill, or have had your technology set up by someone with Technology skill. (e.g “Hey man, nice cell, let me install that VPN for you”). The authorities may intermittently attempt to look into your messages, if they succeed the punishment will be extreme, make sure you are covered. </li> </ul>`,
            scheduleDay: 6,
            scheduleWeek: 4,
            documents: [],
            images: [],

        },
        goodIntentionsVariables: {
            vssId: "GI-015",
            boundaries: "Greater Montreal Area (Montreal Island, Laval, and South Shore)",
            sect: "Camarilla",
            tenants: {
                global:"For the Good of the City, Right or Wrong.",
                sect:"Uphold the Traditions.",
                venue:"Question Your Direction."
            },
            bannedClans:[],
            bannedSects:[],
            bannedPredatorTypes:[],
            bannedMerits:[],
            bannedPowers:[],
            bannedCeremonies:[],
            bannedRituals:[],
            bannedLoresheets:[],
            bannedFormulae:[],
        }
    },
    {
        venueStyleSheet: {
            id: "GI-024",
            name: "",
            chronicle: "Good Intentions",
            domainCode: "CND-024",
            storyteller: "vst.masq.024",
            staff: ["vst.masq.024@canadaatmidnight.com"],
            theme: "Personal Horror, Control, Responsibility, Morality.",
            mood: "Introspective, tense.",
            setting: "Anarchs control Gatineau Area, Camarilla NPC’s hold Ottawa.",
            focus: "...",
            timeline: "...",
            notes: `<ul> <li> Discord server: <a href="https://discord.com/invite/3CEwVt68">https://discord.com/invite/3CEwVt68</a> </li> <li> Proxy rules: Please email <a href="mailto:vst.masq.024@canadaatmidnight.com">vst.masq.024@canadaatmidnight.com</a> with your own VST in CC. Include reason for visit/proxy and a copy of your character sheet. Please give at least 48 hours notice so we can review the sheet and approve the visit. </li> </ul>`,
            scheduleDay: 6,
            scheduleWeek: 1,
            documents: [],
            images: [],

        },
        goodIntentionsVariables: {
            vssId: "GI-024",
            boundaries: "Ottawa/Gatineau",
            sect: "Anarch",
            tenants: {
                global:"Deny your Beast.",
                sect:"Gangs First, Vampires Second.",
                venue:"Survival is Paramount."
            },
            bannedClans:[],
            bannedSects:[],
            bannedPredatorTypes:[],
            bannedMerits:[],
            bannedPowers:[],
            bannedCeremonies:[],
            bannedRituals:[],
            bannedLoresheets:[],
            bannedFormulae:[],
        }
    },
    {
        venueStyleSheet: {
            id: "GI-102",
            name: "Emerald and Ivory",
            chronicle: "Good Intentions",
            domainCode: "CND-102",
            storyteller: "vst.masq.102",
            staff: ["vst.masq.102@canadaatmidnight.com"],
            theme: "Survival; Class Warfare; Religion; Prejudices",
            mood: "Tension; Envy; Paranoia",
            setting: "<ul> <li> <strong>Camarilla:</strong> While the Camarilla has consolidated its power in the Queen Anne hill and western neighborhoods of Seattle under Prince Eleanor Price's leadership. </li> <li> <strong>Greater Seattle Tremere Cooperative:</strong> The University of Washington campus and surrounding suburbs provide refuge for Tremere across sects, led by House Carna. </li> <li> <strong>Hecata Territory:</strong> Mercer Island is now a refuge for the nominally independent Hecata clan, formerly controlled by the Giovanni. </li> <li> <strong>Sinners & Saints Turf:</strong> The SODO neighborhood is controlled by the Sinners & Saints gang, a mix of former Sabbat refugees and core crew members. </li> <li> <strong>Emerald Cranes Turf:</strong> The Emerald Cranes, led by Baron Sasaki Kasuga, uphold the Anarch Movement's Humanitas philosophy. </li> <li> <strong>Personal Domain of Nicholas Wolfe:</strong> Medina is the home and domain of the powerful Tzimisce Elder Nicholas Wolfe, although he hasn't been seen since late 2001. </li> <li> <strong>Personal Domain of Garret Hawthorne:</strong> The Gas Works Park and surrounding area are claimed by Garret Hawthorne, an old and powerful Gangrel who left the Camarilla in the early 2000s. </li> <li> <strong>Bahari Refuge:</strong> Seward Park and surrounding blocks are nominally under the dominion of the Cult of Lilith, although there are members of the Camarilla within the cult as well. </li> <li> <strong>Church of Caine Congregation:</strong> The Church of Caine is headquartered in St. James Cathedral and welcomes members from various affiliations. </li> <li> <strong>Belltown Belles (and Beaus):</strong> This Anarch coterie of Toreador emerged in the mid-1980s and resides near the Camarilla's remaining presence. </li> </ul>",
            focus: "...",
            timeline: "...",
            notes: ``,
            scheduleDay: 6,
            scheduleWeek: 3,
            documents: [],
            images: [],

        },
        goodIntentionsVariables: {
            vssId: "GI-102",
            boundaries: "King County",
            sect: "Anarch",
            tenants: {
                global:"For the Good of the City, Right or Wrong",
                sect:"Gangs First, Vampires Second",
                venue:"Be a Shepherd Among Wolves"
            },
            bannedClans:["Salubri", "Ghoul"],
            bannedSects:[],
            bannedPredatorTypes:[],
            bannedMerits:[],
            bannedPowers:[],
            bannedCeremonies:[],
            bannedRituals:[],
            bannedLoresheets:[],
            bannedFormulae:[],
        }
    },
    {
        venueStyleSheet: {
            id: "GI-108",
            name: "Back to Basics",
            chronicle: "Good Intentions",
            domainCode: "CND-108",
            storyteller: "vst.masq.108",
            staff: ["vst.masq.108@canadaatmidnight.com"],
            theme: "<ul> <li>General retreat to proven strategies</li> <li>Rejection of technology and innovation</li> <li>Competing interests from outside and within</li> <li>Petty court insults and retributions</li> <li>The dubious nature yet pervasive need for favors as currency</li> <li>The things that bind us to our humanity and what happens when we lose them.</li> <li>Theocracy vs Separation of Church and State</li> <li>Staling relationships and the bindings that chafe</li> <li>A world without heroes</li> <li>Independence vs safety</li> </ul>",
            mood: "",
            setting: "",
            focus: "...",
            timeline: "...",
            notes: `There is a special mechanic in play. If a PC kills another PC in this venue without the express permission of the Prince, an NPC will automatically know. You will not be able to successfully hide from this person and you will be unfairly killed. In order to remove this guard rail, the players must establish a PC court and the current Prince (with OOC popular vote support) may dismiss the NPC permanently.

            Coteries are the backbone of this venue setting. Players will be organized into coteries either through collaboration outside of game (with ST approval) or they will be assigned into a coterie strategically. The Director will not suffer a Kindred without a Coterie.
            
            This is a venue built around relationships and high drama. No other supernaturals will be encountered in this area and while combat will happen, we do not intend to have mass combats between players anytime soon. In fact, visitors should note that they will be beholden to the above rule while their character is in this domain. If you come in to killbox, your character(s) will leave in a box. Local players will understand if they leave this domain for any reason, they are no longer under any special rules in play in this VSS.
            `,
            scheduleDay: 6,
            scheduleWeek: 3,
            documents: [],
            images: [],

        },
        goodIntentionsVariables: {
            vssId: "GI-108",
            boundaries: "Los Angeles County and Orange County",
            sect: "Camarilla",
            tenants: {
                global:"The Masquerade is Sacred",
                sect:"Uphold the Traditions",
                venue:"Boons Before Dishonor"
            },
            bannedClans:["Thin-Blood", "Caitiff", "Hecata", "Ravnos", "Salubri"],
            bannedSects:[],
            bannedPredatorTypes:[],
            bannedMerits:[],
            bannedPowers:[],
            bannedCeremonies:[],
            bannedRituals:[],
            bannedLoresheets:[],
            bannedFormulae:[],
        }
    },
    {
        venueStyleSheet: {
            id: "GI-121",
            name: "Dark Frontier",
            chronicle: "Good Intentions",
            domainCode: "CND-121",
            storyteller: "vst.masq.121",
            staff: ["vst.masq.121@canadaatmidnight.com"],
            theme: "Reconstruction; Survival; Political (game related); Paranoia; Supernatural Incursion",
            mood: "Grim Dark, Gothic Horror, Ambition",
            setting: `
            <ul>
            <li>
                <h3>Camarilla</h3>
                <p>All territory in the City is controlled by the Camarilla under the leadership of Prince Lucinda Wallen of Clan Tremere. Lucinda holds court in the old Old National Bank building. The top floor is declared Elysium, the lower floors are mortal offices.</p>
            </li>
            <li>
                <h3>Tremere Chantry</h3>
                <p>The Tremere Chantry in Spokane is located at the Glover Mansion on 8th Ave. The Beckoning has greatly affected the Tremere in Spokane, leaving them with sparse numbers and fractured leadership. The Regent is the Tremere Primogen, Claus Hausmann. Hausmann spends most of his time teaching the younger Tremere important Rituals, and is currently researching ways to reestablish the Bloodbond and resist the Beckoning.</p>
            </li>
            <li>
                <h3>St. John’s Cathedral</h3>
                <p>St John’s is a cathedral built in the Gothic style and sits overlooking downtown Spokane. The Principal of Faith, Igor Pavan of Clan Lasombra, has made his Haven there. From the catacombs under the sandstone building Igor subtly manipulates the church, and conducts ceremonies for those that follow the Church of Caine.</p>
            </li>
            <li>
                <h3>Spokane Dive Bomb Run</h3>
                <p>Series of bars along Sprague Ave. Frequented by 20 and 30 something mortals, this area is the usual haunt of what few Brujah and Gangrel remain in the City. “Song” Jackson can usually be found around here when not dealing with official City business.</p>
            </li>
            <li>
                <h3>The Warrens</h3>
                <p>Legend has it that the streets beneath Downtown Spokane are riddled with old steam tunnels and maintenance corridors. These tunnels are supposed to connect every old building in the lower Downtown Area. The Nosferatu of the City have made use of these tunnels and have expanded them to connect to the sewer system of the City at large. This allows the Nosferatu and their guests access to nearly anywhere in the City.</p>
            </li>
        </ul>`,
            focus: "...",
            timeline: "...",
            notes: `
            This is a Camarilla Domain. Visiting Anarchs will be permitted only at the express permission of the sitting Prince. Autarkis will be addressed on a case by case basis. Unless otherwise specified, statuses of the members of the Anarch Movement will be considered as equivalent infamy while in this Domain.
            New players coming into the game will be given the option to create a Ghoul instead of a full-fledged character. Should this option be chosen, the new player will be assigned to a more experienced player who will assist with game mechanics and any questions that may come up. After three (3) game sessions or ninety (90) days, whichever is longer, the new player will have the choice to be Embraced by their “mentor” player and continue with the current character, or respec their character into a whole new character with all currently earned XP. 
            `,
            scheduleDay: 6,
            scheduleWeek: 2,
            documents: [],
            images: [],

        },
        goodIntentionsVariables: {
            vssId: "GI-121",
            boundaries: "Greater Spokane Area and Coeur d’Alene",
            sect: "Camarilla",
            tenants: {
                global:"The Masquerade is Sacred",
                sect:"For the Good of the City, Right or Wrong",
                venue:"Uphold the Traditions"
            },
            bannedClans:["Hecata", "Salubri", "Tzimisce"],
            bannedSects:[],
            bannedPredatorTypes:[],
            bannedMerits:[],
            bannedPowers:[],
            bannedCeremonies:[],
            bannedRituals:[],
            bannedLoresheets:[],
            bannedFormulae:[],
        }
    },
]

const tatteredVeilVSSSchema = z.object({
    venueStyleSheet: venueStyleSheetSchema,
})

export type TatteredVeilStyleSheet = z.infer<typeof tatteredVeilVSSSchema>

export const TatteredVeilVSSs: TatteredVeilStyleSheet[] = [
    {
        venueStyleSheet: {
            id: "VI-001",
            name: "Haunted Streets",
            chronicle: "Tattered Veil",
            domainCode: "CND-001",
            storyteller: "vst.tattered.001",
            staff: ["vst.tattered.001@canadaatmidnight.com"],
            theme: "Unforeseen Consequences and Hubris",
            mood: "Dreams and Nightmares. Optimism meets crushing responsibility. Lingering doubt.",
            setting: `
            The Seers of the Throne have been the primary uncontested mystical power in the Greater Vancouver Area for at least the last century. While some Pentacle and unaffiliated mages have historically been able to operate out of Vancouver, no organised effort until now has survived the Seer's scrutiny long enough to successfully wrest any significant influence from them. As a result, the city has been virtually scrubbed clean- there are few known mystical realities in vancouver that weren't either created by the Seers, or addressed by them over the course of the Quiet War. With the volume of mystical and mundane infrastructure shaped by their hand, their sudden absence is as great a worry to the smooth foundation of the city as it is a boon.
            Before the war, Pentacle mages made their homes between the cracks and around the edges of the GVRD. The first proper local Concilium to be formed in ages was on the outskirts, as an offensive for the war. The effort to establish a Concilium in Vancouver was officially motivated by the influx of newly awakened mages in the area.
            `,
            focus: "Social and material intrigue.",
            timeline: "...",
            notes: `This VSS will lean heavily into covert and evocative depictions of the supernatural. Styles of play that support this tone through the use of covert magic and other subtle play will be rewarded.`,
            scheduleDay: 6,
            scheduleWeek: 4,
            documents: ["https://docs.google.com/document/d/16xm-3sEOckOFiPGRpXHOljvaHRFBvChy_RGbXmln8gE"],
            images: [],
        }
    }
    ]

    export const VenueStyleSheets: (GoodIntentionsVenueStyleSheet | TatteredVeilStyleSheet)[] = [
        ...TatteredVeilVSSs,
        ...GoodIntentionsVSSs,
    ];