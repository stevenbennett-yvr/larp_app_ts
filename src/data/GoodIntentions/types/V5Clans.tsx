import { z } from "zod";
import * as GoodIntentions from "../../../assets/images/GoodIntentions";
import { disciplineNameSchema } from "./V5Disciplines";

export const clanNameSchema = z.union([
    z.literal('Brujah'),
    z.literal('Gangrel'),
    z.literal('Nosferatu'),
    z.literal('Malkavian'),
    z.literal('Tremere'),
    z.literal('Ventrue'),
    z.literal('Toreador'),

    z.literal('Lasombra'),
    z.literal('Banu Haqim'),
    z.literal('Ministry'),
    z.literal('Ravnos'),
    z.literal('Tzimisce'),
    z.literal('Hecata'),
    z.literal('Salubri'),
    z.literal('Caitiff'),

    z.literal(''),
])
export type ClanName = z.infer<typeof clanNameSchema>

export const clanSchema = z.object({
    name: clanNameSchema,
    nicknames: z.string(),
    summary: z.string(),
    description: z.string(),
    logo: z.string(),
    symbol: z.string(),
    bane: z.string(),
    compulsion: z.string(),
    disciplines: disciplineNameSchema.array(),
})
export type Clan = z.infer<typeof clanSchema>
export const clanKeySchema = clanSchema.keyof()
export type ClanKey = z.infer<typeof clanKeySchema>

export const Clans: Record<ClanName, Clan> = {
    Brujah: {
        name: "Brujah",
        disciplines: ["celerity", "potence", "presence"],
        nicknames: "The Learned Clan, Rabble, Punks, Hipsters, Prometheans, Rebels, Philosopher-Kings, Hellens",
        summary: "Rebels who always fight against the power, easy to anger",
        description: "The Brujah are a clan of radicals and troublemakers, Embracing those willing to put someone in their place if the situation calls for it. Most see themselves as warriors with a cause, and these Rebels are guided by their passions, strength, and dedication to their ideals — whatever those may be.",
        logo: GoodIntentions.brujahLogo,
        symbol: GoodIntentions.brujahSymbol,
        bane: "Violent Temper - Must subtract their Bane Severity from tests to resist Fury Frenzy when angered.",
        compulsion: "Rebellion - Rebel against orders or expectations of an authority or change somebody's mind (by force if necessary). Until then, receive -2 penalty on all rolls."
    },
    Gangrel: {
        name: "Gangrel",
        disciplines: ["animalism","fortitude","protean"],
        nicknames: "The Clan of the Beast, Animals, Ferals, Savages, Barbarians, Outcasts, Wolves, Strays",
        summary: "Beastlike and close to nature",
        description: "Often closer to beasts than other vampires, the Gangrel style themselves apex predators. These Ferals prowl the wilds as easily as the urban jungle, and no clan of vampires can match their ability to endure, survive, and thrive in any environment. Often fiercely territorial, their shapeshifting abilities even give the undead pause.",
        logo: GoodIntentions.gangrelLogo,
        symbol: GoodIntentions.gangrelSymbol,
        bane: "Bestial Features - In frenzy, gain one or more animal features (physical trait, smell, behavior) reducing an appropriate attribute. Lasts until the next night.",
        compulsion: "Feral Impulses - For one scene, take -2 penalty to Manipulation and Intelligence. Can only speak one-word sentences."
    },
    Nosferatu: {
        name: "Nosferatu",
        disciplines: ["animalism", "obfuscate", "potence"],
        nicknames: "Horrors, The Clan of the Hidden, Sewer Rats, Lepers, Hives, Carnies, Scabs, Kapos, Vagrants, Orloks",
        summary: "Disfigured lurkers in the shadows",
        description: "The Nosferatu wear their curse on the outside. Their bodies horribly twisted and deformed through the Embrace, they lurk on the fringes of most cities, acting as spies and brokers of information. Using animals and their own supernatural capacity to hide, nothing escapes the eyes of the so-called Sewer Rats.",
        logo: GoodIntentions.nosferatuLogo,
        symbol: GoodIntentions.nosferatuSymbol,
        bane: "Repulsiveness - You suffer a -2 penalty on all mundane social challanges when your natural appearance is visable and can never improve your Looks Merit. Any attempt to disguise as non-deformed (even supernatural) takes BANE_SEVERITY penalty.",
        compulsion: "Cryptophilia - Become obsessed with obtaining secrets. Refuse to share secrets with others, except in strict trade for greater secrets."
    },
    Malkavian: {
        name: "Malkavian",
        disciplines: ["auspex", "dominate", "obfuscate"],
        nicknames: "The Clan of the Moon, Lunatics, Madmen, Jesters, Oracles, Dervishes, Visionaries, Children of Malkav",
        summary: "Clairvoyants who are driven mad by their gift",
        description: "Derided as Lunatics by other vampires, the Blood of the Malkavians lets them perceive and foretell truths hidden from others. Like the “wise madmen” of poetry their fractured perspective stems from seeing too much of the world at once, from understanding too deeply, and feeling emotions that are just too strong to bear.",
        logo: GoodIntentions.malkavianLogo,
        symbol: GoodIntentions.malkavianSymbol,
        bane: "Fractured Perspective - You are cursed with at least one type of mental derangement.",
        compulsion: "Delusion - Two-dice penalty to Dexterity, Manipulation, Compusre and Wits as well as resists to terror frenzy for one scene."
    },
    Tremere: {
        name: "Tremere",
        disciplines: ["auspex", "blood sorcery", "dominate"],
        nicknames: "Usurpers, Warlocks, Hemetics, Thaumaturges, Transgressors, The Broken Clan, Blood Witches",
        summary: "Blood mages, driven by their hunger for knowledge",
        description: "The arcane Clan Tremere were once a house of mortal mages who sought immortality but found only undeath. As vampires, they’ve perfected ways to bend their own Blood to their will, employing their sorceries to master and ensorcel both the mortal and vampire world. Their power makes them valuable, but few vampires trust their scheming ways.",
        logo: GoodIntentions.tremereLogo,
        symbol: GoodIntentions.tremereSymbol,
        bane: "Deficient Blood - Can't create blood bonds with other kindred, ghouling takes an additional BANE_SEVERITY drinks.",
        compulsion: "Perfectionism - Until you score a critical win, all actions have a -2 penalty. Penalty is reduced by one die for every repeat of an action."
    },
    Ventrue: {
        name: "Ventrue",
        disciplines: ["dominate", "fortitude", "presence"],
        nicknames: "The Clan of Kings, Blue Bloods, Tyrants, Warlords, Patricians, Borgias, the Cult of Mithras",
        summary: "High and mighty rulers, continually grasping for more power",
        description: "The Ventrue are not called the Clan of Kings for nothing. Carefully choosing their progeny from mortals familiar with power, wealth, and influence, the Ventrue style themselves the aristocrats of the vampire world. Their members are expected to assume command wherever possible, and they’re willing to endure storms for the sake of leading from the front.",
        logo: GoodIntentions.ventrueLogo,
        symbol: GoodIntentions.ventrueSymbol,
        bane: "Rarefied Tastes - Pick a group of preferred victims. Feeding from anyone outside that group costs BANE_SEVERITY willpower points.",
        compulsion: "Arrogance - Until somebody obeys an order from you (not forced by Dominate), you take a -2 penalty on all rolls not related to leadership."
    },
    Toreador: {
        name: "Toreador",
        disciplines: ["auspex","celerity","presence"],
        nicknames: "Divas, The Clan of the Rose, Degenerates, Artists, Harlots, Arikelites, Hedonists, Sensates, Perverts",
        summary: "Beauty-obsessed artists, elegant and often snobby",
        description: "Known for their seductive nature, enthralling demeanor, and eloquent grace to the point of obsession, Toreador vampires Embrace artists and lovers into their ranks, forever trying to stir their own deadened hearts. Supernaturally graceful and charming, the Divas are always looking for the next thrill, leaving a detritus of discarded lovers and victims in their wake.",
        logo: GoodIntentions.toreadorLogo,
        symbol: GoodIntentions.toreadorSymbol,
        bane: "Aesthetic Fixation - While you're in less than beautiful surroundings you take BANE_SEVERITY penalty on Discipline rolls.",
        compulsion: "Obsession - Become fixated with something in the scene. Take a -2 penalty on any actions that aren't directly related to that thing. Lasts until you can't perceive the thing or scene ends."
    },

    Lasombra: {
        name: "Lasombra",
        disciplines: ["dominate", "oblivion", "potence"],
        nicknames: "The Night Clan, Magisters, Keepers, Shadows, Abyss Mystics, Turncoats, Traitors",
        summary: "Shadowy predators and ruthless social climbers",
        description: "Creatures subtly at odds with mundane reality, Lasombra vampires are expected to triumph at any cost. Ruthlessness is a sought-after trait in progeny, making their reputation as betraying interlopers well deserved. Most do not seek attention, preferring to act as puppeteers, powers behind the proverbial throne. To a Shadow, the ends justify any means.",
        logo: GoodIntentions.lasombraLogo,
        symbol: GoodIntentions.lasombraSymbol,
        bane: "Distorted Image - Lasombra vampires have distorted reflections and struggle with modern communication technology, requiring tests to operate touch-based devices, gaining detection penalties equal to their Bane Severity and being unable to manipulate technology to their advantage.",
        compulsion: "Ruthlessness - Next failure after compulsion causes all rolls to receive a penalty until future attempt at same action succeeds."
    },
    "Banu Haqim": {
        name: "Banu Haqim",
        disciplines: ["blood sorcery", "celerity", "obfuscate"],
        nicknames: "The Clan of the Hunt, Assassins, Children of Haqim, Saracens, Mediators, Lawmen, Assamites",
        description: "The Judges of the Banu Haqim are torn between their hereditary thirst for vampiric Blood and their passion for justice. Stern adjudicators, they are fiercely devoted to upholding a moral code, and Embrace mortals capable of assessing and handling threats, enforcing laws and traditions, and punishing transgressors.",
        summary: "Assassins and judges with a twisted passion for justice",
        logo: GoodIntentions.banuHaqimLogo,
        symbol: GoodIntentions.banuHaqimSymbol,
        bane: "Blood Addiction - Drinking from another vampire provokes a Hunger Frenzy test with a difficulty of 2 + BANE_SEVERITY, and failing this test may lead to a Frenzy and potential diablerie.",
        compulsion: "Judgment - Drink at least 1 hunger of blood from anyone who acts against on of your personal convictions. If you can't, take -2 penalty to all rolls until compulsion is satisfied or scene ends."
    },
    Ministry: {
        name: "Ministry",
        disciplines: ["obfuscate","presence","protean"],
        nicknames: "The Clan of Faith, Setites, Followers of Set, The Clan of Lies, Typhonists, Serpents, Liberators, Judasians",
        summary: "Cult-like clan that uses temptation as a weapon",
        description: "The Ministry always has something to offer. This often cult-like clan recruits those able to employ temptation as a weapon. They Embrace those with the will and means to sway, entrap, and ultimately liberate their targets from whatever they seek: the victim’s possessions, allegiance, or even faith. To the Serpents, everything has a price.",
        logo: GoodIntentions.ministryLogo,
        symbol: GoodIntentions.ministrySymbol,
        bane: "Abhors the Light – If under bright light, take a BANE_SEVERITY penalty to all rolls. Take BANE_SEVERITY additional damage from sunlight.",
        compulsion: "Transgression - Take a -2 penalty on all rolls not related to enticing someone (even themselves) to break a Chronicle Tenet or personal Conviction, causing at least one Stain and ending this Compulsion."
    },
    Ravnos: {
        name: "Ravnos",
        disciplines: ["animalism","presence","obfuscate"],
        nicknames: "Rogues, Ravens, Daredevils, The Haunted",
        summary: "Illusionists who are always on the move",
        description: "Masters of misdirection, the Ravnos prefer not to fight or bleed for something they can obtain through subtler means. They can charm and vanish within the same mortal breath, and those once fooled quickly learn to question their very senses when in the company of Ravens. Always on the move, the Ravnos can never rest in the same place for long lest their curse light them on fire as they slumber.",
        logo: GoodIntentions.ravnosLogo,
        symbol: GoodIntentions.ravnosSymbol,
        bane: "Doomed - Failure to spend a monthly downtime action moving between havens or sleeping in different locations results in the Ravnos suffering Aggravated Damage equal to their Bane Severity, impervious to any Fortitude they may have.",
        compulsion: "Tempting Fate - Next time you're faced with a problem, you must choose the most dangerous and daring solution, or take a -2 penalty. Lasts until the problem is solved or further attempts are impossible."
    },
    Tzimisce: {
        name: "Tzimisce",
        disciplines: ["animalism","dominate","protean"],
        nicknames: "Dragons, The Old Clan, Voivodes, Stokers",
        summary: "Territorial, greedy flesh shapers",
        description: "To the Tzimisce, possession is all. They aim to dominate and own the subject of their possessiveness, jealously guarding it like their namesake dragon would its hoard. Everything from land, people, cults, companies, or gangs can fall under the covetous claws of a Dragon. This relentless possessiveness extends as well to their own bodies, and they often rework themselves into flawless, hideous, or utterly alien forms, all the better to display their utter control of all things theirs.",
        logo: GoodIntentions.tzimisceLogo,
        symbol: GoodIntentions.tzimisceSymbol,
        bane: "Grounded - Choose a place or group, if you day-sleep away from that you take BANE_SEVERITY aggravated willpower damage.",
        compulsion: "Covetousness - Become obsessed with possessing something in the scene. Any action not taken toward this purpose incurs -2 penalty. Persists you own it or ownership becomes impossible."
    },
    Hecata: {
        name: "Hecata",
        disciplines: ["auspex","fortitude","oblivion"],
        nicknames: "The Clan of Death, Necromancers, Graverobbers, The Family, Stiffs, Corpses, Devil-Kindred, Lazarenes",
        summary: "Vampires specialized in necromancy",
        description: "A motley collection of necromantic vampire bloodlines, the Hecata clan are united in the pursuit of a single subject: Death. They are students of the afterlife and resurrectionists of the dead — or worse. Selling their services to the highest bidder, or acting in their own interests, there are few who can hide from the surveillance of those who can summon and command the very spirits of the deceased.",
        logo: GoodIntentions.hecataLogo,
        symbol: GoodIntentions.hecataSymbol,
        bane: "Painful Kiss - Your vampire kiss is excruciatingly painful and brings no pleasure to your prey.",
        compulsion: "Morbidity - Until you have either predicted a death or solved the cause of a local one, you suffer a -2 penalty to other rolls. Conclusions don't need to be correct, but should make sense."
    },
    Salubri: {
        name: "Salubri",
        disciplines: ["auspex","dominate","fortitude"],
        nicknames: "Cyclops, Soul-Thieves, Dajjals, Saulot’s progeny",
        summary: "Almost extinct bloodline of mystical vampires",
        description: "Most of their kind lost to undead usurpers, the highly desirable Blood of the hunted Salubri is a prize to other vampires. This, and their reluctance to Embrace, makes them rare in the modern nights. They often recruit those on the edge of death, believing their curse can provide the worthy a second chance, and they count some of the most humane vampires among their ranks",
        logo: GoodIntentions.salubriLogo,
        symbol: GoodIntentions.salubriSymbol,
        bane: "Hunted - Your blood is tasty. When others drink from you, they must pass a Hunger Frenzy test to stop. You have a third eye on your forehead that cannot be obscured (even supernaturally), but can be covered with clothing. When you use disciplines it weeps blood and vampires with Hunger >= 4 must pass a Hunger Frenzy test.",
        compulsion: "Affective Empathy - Become overwhelmed with somebody's personal problem. Suffer a -2 penalty to all actions that don't got towards solving the problem. Lasts until the problem is eased, an immediate crisis supersedes it or the scene ends."
    },
    Caitiff: {
        name: "Caitiff",
        disciplines: [],
        nicknames: "The Clanless, Panders, Orphans, Trash, Scum, Freestylers",
        summary: "Those of a flawed or unknown lineage.",
        description: "Exhibiting no discernable lineage, the Caitiffs are vampires without a clan. Distrusted by their peers, they are scorned because of their lack of lineage but also feared for their unpredictability. Jacks of all trades but masters of none, each Pander makes their own way in the society of the damned, free from ancestry and expectations both.",
        logo: GoodIntentions.caitiffLogo,
        symbol: GoodIntentions.caitiffSymbol,
        bane: "Outcast - Untouched by their ancestors, the Caitiff do not share a common Bane. The character begins with the Flaw Suspect (•) and they may not purchase positive status during Character Creation. The Storyteller may impose a 1-2 penalty to social tests against Kindred who know they are Caitiff. To improve a Discipline, the cost is 6 times the level of experience points.",
        compulsion: "Caitiffs do not have a clan Compulsion"
    },
    "": {
        name: "",
        disciplines: [],
        nicknames: "",
        summary: "",
        description: "",
        logo: "",
        symbol: '',
        bane: "",
        compulsion: ""
    }
}