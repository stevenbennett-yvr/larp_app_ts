import { z } from "zod";
import { clanNameSchema } from "./V5Clans";
import { V5SkillsKey, v5skillsKeySchema } from "./V5Skills";
import { v5BackgroundRefSchema, emptyBackground, emptyAdvantage, V5BackgroundRef, V5AdvantageRef, mergeBackgrounds } from "./V5Backgrounds";
import { v5MeritFlawRefSchema, emptyMeritFlaw } from "./V5MeritsOrFlaws";
import { Kindred } from "./Kindred";
import { sectNameSchema } from "./V5Sect";

const benefitRefSchema = z.object({
    name: z.string(),
    creationPoints: z.number().min(0).int(),
    freebiePoints: z.number().min(0).int(),
    experiencePoints: z.number().min(0).int(),
})

export type BenefitRef = z.infer<typeof benefitRefSchema>

export const loresheetRefSchema = z.object({
    name: z.string(),
    benefits: benefitRefSchema.array(),
})

export type LoresheetRef = z.infer<typeof loresheetRefSchema>


const skillBonusSchema = z.object({
    skill: v5skillsKeySchema,
    level: z.number(),
})

export const selectableBackgroundsSchema = z.object({
    options: v5BackgroundRefSchema.array(),
    totalPoints: z.number().int(),
})

const benefitSchema = z.object({
    name: z.string(),
    level: z.number().min(1).max(3),
    description: z.string(),
    skillBonus: skillBonusSchema.array(),
    selectableBackgrounds: selectableBackgroundsSchema,
    backgrounds: v5BackgroundRefSchema.array(),
    meritsAndFlaws: v5MeritFlawRefSchema.array(),
    selectableSkills: skillBonusSchema.array(),
})

export type Benefit = z.infer<typeof benefitSchema>

const loresheetSchema = z.object({
    name: z.string(),
    description: z.string(),
    prereq: z.union([clanNameSchema, sectNameSchema]),
    benefits: benefitSchema.array(),
})

export type Loresheet = z.infer<typeof loresheetSchema>

export const loresheets: Loresheet[] = [
    {
        name: "Anarch Revolt",
        description: "Those who forget the past are doomed to repeat it. You have studied the original Anarch Revolt of the 14th and 15th centuries so thoroughly that you can see the patterns beginning to emerge in the modern nights of the Damned. You may claim lineage to one of the original founders of the Revolt, or you know someone who was there when Tyler killed Hardestadt, but it doesn’t matter. You know the truth, and you will chronicle the past in hopes of helping the future. Perhaps, through your knowledge of the past, you can perceive and even try to control the swelling tide of young vampires showing the signs of rebellion.",
        prereq: "Anarch",
        benefits: [
            {
                name: "Hold the Line",
                level: 1,
                description: "Like your progenitor, you are a source of inspiration to other Anarchs in tense situations. Once per night, when one of your gangmates is required to take a Frenzy test, you may call out to them with encouragement to keep it together. This allows them to automatically pass the Frenzy test. You also gain the first two dots of the Leadership and Politics Skills.",
                skillBonus: [{ skill: "leadership", level: 2 }, { skill: "politics", level: 2 }],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Mutual Support",
                level: 2,
                description: "Every vampire has people who are important to them, humans who allow them to stay strong in the face of oppression. You understand the importance of protecting these people on an instinctual level. When a Touchstone, whether it belongs to you or to any of your gangmates, comes under threat, you know it. Your ears prick up, and your hair stands on end.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "In Open Rebellion",
                level: 3,
                description: "You are an agent of change, capable of rallying the masses to rage against injustice. When you’re motivated, you can cause whole neighborhoods to come unglued. Once per night, you can cause a disturbance in a neighborhood of your choice, giving your gang the effects of Deterrents 3, in a Sphere of Influence of your choice, for a night (see Deterrents, page 307). This works as great cover for violence. Only obvious supernatural activity will breach the Masquerade in this neighborhood while the riot is underway. Everything else will be written off as gang violence or some other form of mundane violence. However, you gain two Stains that cannot be reduced by any means because of the destruction and mayhem that you have unleashed.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []

            }
        ]
    },
    {
        name: "The Cobweb",
        description: "The Cobweb, also known as the Madness Network, is a pseudo-psychic network that seemingly connects all Malkavians. Some can barely perceive it; fewer can actually tap into it. While most of the clan is subconsciously aware of its existence, most individual Malkavians will only experience the Cobweb once or twice a year, like an old forgotten radio suddenly switched on. The experience is different for every Malkavian. The Cobweb catches thoughts and memories chaotically, then moves them as spiders would carry them along its strands. Sometimes the memories won’t make sense–logically, temporally, or otherwise. The true purpose of the Cobweb is unknown; some say it is a remnant of the clan founder’s consciousness.",
        prereq: "Malkavian",
        benefits: [
            {
                name: "A Break in the Static",
                level: 1,
                description: "You can ask the Storyteller three questions in the game: Am I in danger, and how? Am I on the right track, and if not, what am I doing wrong? Are there other Malkavians around? The Storyteller will reply as the Cobweb, but the answers are usually vague and not clear, offering only sporadic insights into your current situation.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []

            },
            {
                name: "The Call",
                level: 2,
                description: "Three times per game, you can spend one standard action to broadcast a single five-sentence message to the Cobweb or create a special beacon flagging a location as a special place of interest. Any Malkavian in the same city can perceive such messages or beacons, even if they do not have this Loresheet. How they perceive this message and if they choose to travel to any beacon is wholly up to them.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []

            },
            {
                name: "Pluck the Strands",
                level: 3,
                description: "Three times per game you may utilize the Cobweb to obtain information that would normally require a Skill check to know, such as Academics, Finance, Science, or Occult (including Lore checks that would have a difficulty of 6 or less). Instead of the normal difficulty assigned by the Storyteller, your difficulty is always 3 as you tap into the shared consciousness of your clan. You can’t learn personal information, such as the location of someone’s haven or who murdered your ally. The Storyteller may choose to tell you the information you look to glean is too mysterious; in this case, the attempt does not count as having spent one of your three uses of this advantage. However, you can glean information about an Oblivion Ceremony you witnessed or know the precise process on how to repair a broken semitruck.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "The Church of Set",
        description: "Not every Ministry member is a hardliner of the Church of Set, but you are. Dedicated to hardline Setite orthodoxy, you and other members of the Church of Set believe that you must conspire to weaken all other Clans and their founders to pave the way for your founder’s resurrection. Perhaps you are a new member, desperate for mentorship in the hostile world you now find yourself in; perhaps you reject the chains of servitude to the Antediluvians and seek freedom from all forms of enslavement through the teachings of Set.",
        prereq: "Ministry",
        benefits: [
            {
                name: "Congregation",
                level: 1,
                description: "You have access to a flock of kine from a fringe religion or cult that you can manipulate and feed from. You may choose five dots from the Allies, Haven, Herd or Resources Backgrounds and their associated Advantages.",
                skillBonus: [],
                selectableBackgrounds: {
                    options: [
                        { ...emptyBackground, id: "set-allies", name: "Allies", freebiePoints: 0, sphere: [], advantages: [] },
                        { ...emptyBackground, id: "set-haven", name: "Haven", freebiePoints: 0, sphere: [], advantages: [] },
                        { ...emptyBackground, id: "set-herd", name: "Herd", freebiePoints: 0, sphere: [], advantages: [] },
                        { ...emptyBackground, id: "set-resources", name: "Resources", freebiePoints: 0, sphere: [], advantages: [] },
                    ], totalPoints: 5
                },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Degenerative Process",
                level: 2,
                description: ": The Church of Set teaches that chains can only be broken through hitting and understanding rock bottom. By indulging in corruption, they rise anew. If a character chooses to willingly gain a Stain by breaking a Chronicle Tenet (which cannot be reduced in any way), you may gain one Hunger and lead the character in prayer for five minutes. After the five minutes of prayer is complete, they heal three Aggravated Damage. You may do this once per night per person.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Avatar of Belief",
                level: 3,
                description: "You are a pillar of faith in the teachings of Set, hellbent on bringing about the resurrection of your Clan’s founder. When you sin for Set, you are simply doing what you know you must. Once per night, when you and your Storyteller perceive your actions to be reflective of the will of Set, you may reduce Stains gained for a sin by two.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "The Circulatory System",
        description: "Every Kindred knows that blood carries with it a certain Resonance, and those Resonances carry the ability to be manipulated and controlled, to produce new and possibly unique powers ripe for Kindred use. The Circulatory System is a coordinated effort of mortal trafficking among vampire society. They track each vessel and the properties of vintages that flow within their veins. Members of the Circulatory System interact with it in a variety of different ways, including transporters, smugglers, scientists, and consumers. What’s important is that the work continues, and that it remains far away from the prying eyes of mortals who might shut it down. Even the loss of a vessel before their time causes only the slightest drop in overall profits while a suitable replacement is found.",
        prereq: "",
        benefits: [
            {
                name: "Secure Transit",
                level: 1,
                description: "The Circulatory System moves important vessels using armored vans and armed ghoul drivers. These protected modes of transit are dangerous and difficult to attack. Sometimes you can hitch a ride in one of these vans. Once per month, you can arrange for secure travel within your city for up to six Kindred with little effort. If you are participating in a connected chronicle with games in different cities, you may use Secure Transit to travel safely to another city where the Circulatory System is present.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Farm Upstate",
                level: 2,
                description: "Through your connections to the Circulatory System, you have developed a farm of valuable vessels with blood potent enough to convey benefits to Kindred drinkers. You gain a three-dot Herd with two dots in the Friendly Advantage.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    {...emptyBackground, id: "circulatorySystem-herd", name: "Herd", freebiePoints: 0, sphere: [], advantages: []}
                ], totalPoints: 5 },
                backgrounds:  [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Blood Sommelier",
                level: 3,
                description: "You know the Circulatory System’s secret methods for taste, analysis, and refinement, and you have parlayed your knowledge into significant gains and information from Circulatory System clients. You may select five dots of Contacts, Allies, or Resources Mortal Connections or Advantages. Once every three months, you may ask your Storyteller for an important secret about an NPC who is a client of the Circulatory System.",
                skillBonus: [],
                selectableBackgrounds: {
                    options: [
                        { ...emptyBackground, id: "circulatorySystem-allies", name: "Allies", freebiePoints: 0, sphere: [], advantages: [] },
                        { ...emptyBackground, id: "circulatorySystem-contacts", name: "Contacts", freebiePoints: 0, sphere: [], advantages: [] },
                        { ...emptyBackground, id: "circulatorySystem-resources", name: "Resources", freebiePoints: 0, sphere: [], advantages: [] },
                    ], totalPoints: 5
                },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
        ]
    },
    {
        name: "Convention of Thorns",
        description: "The Camarilla dates its creation to the Convention of Thorns, a meeting of Vampires from all Clans who crafted an agreement for the survival of society. Perhaps you are a descendant from one of the original signatories; perhaps you are simply a scholar, spending your nights bent over research of the Convention and its subsequent Traditions so that you better understand the laws governing “proper vampire society” today. Whatever your reasons, you can likely recite the iterations of the Traditions that were proposed, as well as name some of the more important vampires present at such a momentous occasion. Regardless, a thorough enough understanding can be used to manipulate members of the Camarilla or the Anarch Movement when you know just the right words to say.",
        prereq: "",
        benefits: [
            {
                name: "Thorns Historians",
                level: 1,
                description: "Your knowledge has made you interesting to older members of the Camarilla who care about the past. In exchange for information you gleaned from your studies, they assist you by providing you three free dots from the Allies, Resources, or Contacts Backgrounds (or their associate Advantages).",
                skillBonus: [],
                selectableBackgrounds: {
                    options: [
                        { ...emptyBackground, id: "conventionOfThorns-allies", name: "Allies", freebiePoints: 0, sphere: [], advantages: [] },
                        { ...emptyBackground, id: "conventionOfThorns-contacts", name: "Contacts", freebiePoints: 0, sphere: [], advantages: [] },
                        { ...emptyBackground, id: "conventionOfThorns-resources", name: "Resources", freebiePoints: 0, sphere: [], advantages: [] },
                    ], totalPoints: 3
                },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []

            },
            {
                name: "Archivist",
                level: 2,
                description: "You have access to an archive containing all manner of interesting lore about vampire history, including accounts of what occurred at the Convention of Thorns. The library counts as a two-dot Haven with two-dots in the Library and Location Advantage. Other vampires and Kindred historians with this Loresheet meet there as well.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [
                    {
                        ...emptyBackground, id: "conventionOfThorns-haven", name: "Haven", freebiePoints: 2, sphere: [], advantages: [
                            { ...emptyAdvantage, name: "Library", freebiePoints: 2 },
                            { ...emptyAdvantage, name: "Location", freebiePoints: 2 },
                        ]
                    }
                ],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Lessons of the Convention",
                level: 3,
                description: "Through your research and interviews, you have learned a great deal about how the Founders of the Camarilla operated in negotiations. You have had time to reflect on how they operated, and you have put those lessons to use in your own manipulation of Mortal Connections. Your Contacts and Allies gain a +1 bonus in tests vs. competing Mortal Connections (see page 141). In addition, the Deterrents Coterie Background (see page 307) can never reduce your Mortal Connections’ test pool below two.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Hardestadt",
        description: "The Ventrue do not speak lightly about Hardestadt, an Elder they claim was the most powerful of them for the last eight centuries. During the Convention of Prague in 2012, he was destroyed by Brujah rebels led by the betrayer Theo Bell. Hardestadt was a founder of the Camarilla, joined by six of his peers who credit him with the strength and security of the Ivory Tower for so long. Oddly, he never credited his lineage further back than himself, surely a sign of his belief that he was the end-all-be-all of the Ventrue. His childer are few and far between, each one painstakingly chosen and carrying the weight of his name on their shoulders.",
        prereq: "Ventrue",
        benefits: [
            {
                name: "Wealth",
                level: 1,
                description: ": You descend from one of the greatest Ventrue ever to rule the night, and his lineage wants for nothing. You gain three dots of the Resources Background with the Liquidity Advantage. These dots can never be lost or blocked.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [
                    {
                        ...emptyBackground, id: "ventrue-resources", name: "Resources", freebiePoints: 3, sphere: [], advantages: [
                            { ...emptyAdvantage, name: "Liquidity", freebiePoints: 1 }
                        ]
                    }
                ],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Pedigree",
                level: 2,
                description: "You were Embraced to lead, and your Sire trained you in many ways that would assist your mobility in vampire society: smart reasoning, the ability to communicate, and training in controlling your Beast in stressful situations. You gain two dots of Linguistics along with the Common Sense and Calm Heart Merits.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [
                    { ...emptyMeritFlaw, id: 'ventrue-Linguistics', name: "Linguistics", freebiePoints: 2, note: "Descendant of Hardestadt" },
                    { ...emptyMeritFlaw, id: 'ventrue-Common Sense', name: "Common Sense", freebiePoints: 4, note: "Descendant of Hardestadt" },
                    { ...emptyMeritFlaw, id: 'ventrue-Calm Heart', name: "Calm Heart", freebiePoints: 3, note: "Descendant of Hardestadt" },
                ],
                selectableSkills: []
            },
            {
                name: "Control",
                level: 3,
                description: "You epitomize the strength of will that Hardestadt was known for, and your will extends even to your Blood. When targeting a non-supernatural mortal with Presence or Dominate powers, you automatically succeed.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Helena",
        description: "There are legends of a beauty so exceptional, so exquisite, that mortals died simply to get a glimpse of her face. To hear the Toreador talk, Helena is the source of all of those tales, and none of them compare to her actual beauty. Where one might get a glimpse of her seems to be the real question, as some claim to have seen her in the Americas locked in a bitter battle with a rival. Others claim she runs the most prestigious vampire night club in the world. Still others whisper that she is the lover of the clan founder, spending her nights attempting to reawaken the clan’s Antediluvian. All the members of her lineage are beyond talented, exemplifying the role of the Toreador above all else. Your connection causes admirers to line up to meet you, hoping that you might bring them even a small step closer to Her.",
        prereq: "Toreador",
        benefits: [
            {
                name: "Real Talent",
                level: 1,
                description: "Unlike other vapid Toreador relying on their beauty alone, you are a master artist and you were Embraced for your talent. You gain Crafts or Performance 5.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: [{skill:"crafts",level:5},{skill:"performance",level:5}]
            },
            {
                name: "Popular",
                level: 2,
                description: "People like you and want to forgive you your trespasses. Once every three months, you may apologize and pay a Minor Boon to an officer of your sect who could use their position to reduce your Status by one dot. Instead, they must accept your boon without reducing your status.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Succubus Club Franchise",
                level: 3,
                description: "Helena succumbed to the Beckoning in recent years, leaving her famous Succubus Club in Chicago to a manager. However, you have license from your lineage to establish a franchised Succubus Club in your Domain. You gain four Background dots selected from Resources, Fame, and Mask Backgrounds and Advantages. So long as the club remains open, the Comfort level of your Domain gains a two-dot bonus (see page 306). Multiple Toreador in a Domain may benefit from this Lore’s mechanical benefits; however, if there is more than one Descendant of Helena in a Domain, they are involved in running the same Succubus Club.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    { ...emptyBackground, id: "toreador-resources", name: "Resources", freebiePoints: 0, sphere: [], advantages: [] },
                    { ...emptyBackground, id: "toreador-fame", name: "Fame", freebiePoints: 0, sphere: [], advantages: [] },
                    { ...emptyBackground, id: "toreador-mask", name: "Mask", freebiePoints: 0, sphere: [], advantages: [] },
                ], totalPoints: 4 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Karl Schrekt",
        description: "Modern nights have shattered the pyramid that was once Clan Tremere, scattering them to the winds. Of those who remain, the oldest is Former Justicar Karl Schrekt. Embraced in 1235, he had been a vampire hunter during his mortal years. Before the Schism, he served the Camarilla by hunting the Sabbat, the Anarchs, and any other occult menace they identified. Now, what’s left of the clan within the Camarilla looks to him for guidance and leadership. His descendents hold true to his hardlined beliefs: enforce the Traditions, strengthen the Clan, and hide the secrets of Blood Magic.",
        prereq: "Tremere",
        benefits: [
            {
                name: "Ritual Preparedness",
                level: 1,
                description: "Karl Schrekt has remained alive due to endless, near-paranoid preparation, and your character has learned this lesson through their lineage. You keep the items needed to cast different rituals close at hand, and you also happen to know a few magical shortcuts. Once per month, you can perform any of your known Blood Sorcery rituals in one minute. You are assumed to have the necessary mundane ingredients required due to your preparedness or your ability to “make do.”",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Know the World",
                level: 2,
                description: "Your family knows that knowledge is power, and you have gathered an archive of literature about Kindred and all manner of other supernatural beings. Gain two dots of the Haven Background and three dots of the Library Advantage representing this archive. Once per month, you can ask the Storyteller to answer a general question about werewolves, magicians, wraiths, fae, or other supernatural entities and receive a truthful answer. This question cannot reveal current events (such as the current leader of the local Sabbat pack), only longstanding information.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [
                    {
                        ...emptyBackground, id: "conventionOfThorns-haven", name: "Haven", freebiePoints: 2, sphere: [], advantages: [
                            { ...emptyAdvantage, name: "Library", freebiePoints: 3 },
                        ]
                    }
                ],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Surveillance",
                level: 3,
                description: "Your progenitor is famous for his effectiveness in digging into the lives of sect enemies. You have been trained in similar practices. Once per month, you may spend a Downtime Action to spy on a target. This action may not be delegated to a Contact or Ally. Your Storyteller will do a test with your Wits + Investigation vs. your target’s Wits + Stealth. If you win, you learn one of your target’s Convictions and identify the corresponding Touchstone. If you lose, your target learns that you are spying on them.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Montano",
        description: "Montano is one of the only remaining Lasombra to have walked side by side with the clan’s founder. It is said that he is to thank for the clan’s access to the Abyss, and some even whisper that Christianity itself was allowed to rise in the world because of his wishes. Ever a man of honor, he refused to leave the Camarilla, and for centuries he was branded a traitor because of it. As one of his descendents, you know what true loyalty means. The clan looks to you and your ancestor, more now than ever, as they forge ahead in the dark waters of the Camarilla.",
        prereq: "Lasombra",
        benefits: [
            {
                name: "Siblings in Darkness",
                level: 1,
                description: "Montano’s honor runs throughout his lineage as an expected code of behavior, and you reap the benefits of this reputation within Clan Lasombra. Your clanmates have provided you aid and respect in the form of four dots selected from the Allies, Contacts, or Resources Backgrounds or their associated Advantages.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    {...emptyBackground, id: "lasombra-allies", name: "Allies", freebiePoints: 0, sphere: [], advantages: []},
                    {...emptyBackground, id: "lasombra-contacts", name: "Contacts", freebiePoints: 0, sphere: [], advantages: []},
                    {...emptyBackground, id: "lasombra-resources", name: "Resources", freebiePoints: 0, sphere: [], advantages: []},
                ], totalPoints: 4 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Purity of Remorse",
                level: 2,
                description: "No one mourns his sins like Montano, who murdered his family and friends as a mortal man to save his village from his Sire. He cannot consciously remember this, but he agonizes just the same. You are inspired by his commitment to Humanity and have learned from it. Once a night, if you fail a Remorse test, you can attempt it again. If you win (not tie) this second test, you remain at your current Humanity and remove all Stains.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Abyssal Appearance",
                level: 3,
                description: "You have studied the powers and Ceremonies of Oblivion with Montano himself. With his potent Blood, his mastery will always eclipse yours. You have, however, managed to learn a few tricks that only his tutelage can explain. Once per game session, prior to the beginning of the game, you may select any one of your Oblivion powers or Ceremonies and replace it with another power or Ceremony that you would be eligible to purchase at that level. At the end of the game session, this choice is reversed.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Tyler",
        description: "Tyler still exists. Once known as an outspoken, violent rebel against tyrannical Elders and insidious Methuselahs, she is now studious and quiet. Centuries of reflection have caused her to fall into quiet contemplation: were her actions worth the results that have become the modern nights? She was the inspiration for the Anarch Movement, and, though she doubts her praxis was ever effective, her childer and clanmates compare her to Robin Hood. Her descendents and their cousins continue fighting in her name, hoping that one night they will uplift her to greatness once more.",
        prereq: "Brujah",
        benefits: [
            {
                name: "Champion of the Cause",
                level: 1,
                description: "When people want someone to lead a rebellion, they come to you for help. Gaining funding, weapons, and information comes far more easily with the help from those who hold you in high esteem. You gain three free dots to spend on the Contacts, Resources, or Haven Backgrounds or Advantages tied to those Backgrounds.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    { ...emptyBackground, id: "brujah-allies", name: "Allies", freebiePoints: 0, sphere: [], advantages: [] },
                    { ...emptyBackground, id: "brujah-haven", name: "Haven", freebiePoints: 0, sphere: [], advantages: [] },
                    { ...emptyBackground, id: "brujah-contacts", name: "Contacts", freebiePoints: 0, sphere: [], advantages: [] },
                ], totalPoints: 3 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Tyler's Mercy",
                level: 2,
                description: "You have learned how to stop your rage, knowing the limits of violence. Once a night, you may immediately end your Frenzy and trigger the Brujah Clan Compulsion.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "The Furores",
                level: 3,
                description: "You are a member of a historic group known as the Furores, who follow Tyler’s teachings and rail against tyranny. Once every three months, you may bring down the might of this group to assist you in attempting to take down a Prince, an unfit Baron, or another tyrannical vampire of higher station. Two neonate NPCs with the statistic block for Anarch Guerillas are set out on page 346 will join you in your fight. These characters are controlled by the Storyteller. Attempting to use these vampires for improper purposes will lead to them bringing you before Furore leadership for justice.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Vasantasena",
        description: "The persistence of free will has always been a heated debate among mortals, but, among vampires, the sweet addiction of drinking vampiric blood seems to change their mind. Famously, there have been two vampires who always spoke out against the slavery of the Blood Bond: Vasantasena and her sire, Unmada, from Clan Malkavian. They rejected any loss of free will, whether due to the powers of the Blood or even to traditionally oppressive Kindred hierarchies. They spoke out against the vicious conflict between the Antediluvians and refused to join the Camarilla, siding with the Sabbat doctrine against the ancestral vampires. When the Sabbat rejected Vasantasena’s ideologies and created their own hierarchies, she rejected them in turn, taking a faction of Malkavians with her. Descendants of Vasantasena are as diverse as the night sky, all possessing the zeal and charm of their founder, fighting for some cause no matter which sect they call home.",
        prereq: "Malkavian",
        benefits: [
            {
                name: "Scent the Bond",
                level: 1,
                description: "Vasantasena hated Blood Bonds; this led her to target the Antediluvians for enslaving their offspring. She was skilled at smelling the Bond on individual vampires and those who had enslaved them. Once per month, you may target a vampire and make a Resolve + Awareness test at difficulty 4. If you succeed, you can smell if they have been Blood Bonded and learn the identity of the character they are most strongly Blood Bonded to, so long as they reside in your city.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Agent of Chaos",
                level: 2,
                description: "Vasantasena’s dedication to principles of free will was as legendary as her ability to resist those who would bind her. You have inherited a small amount of this power. Once per game session, when you are called upon to resist a Mental or Social challenge that would inhibit your free will, you may gain one Hunger to automatically win the challenge.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Destroy the Bond",
                level: 3,
                description: "Vasantasena mastered a method of destroying the Blood Bond, which you have learned from your ancestors. Once every three months, you may carry out a ritual that requires you to drink a mouthful of the thrall’s blood (this does not cause you to become partially Bound to them). You must then ride out an immediate Frenzy of a type selected by your Storyteller. Once the ritual is complete, the Blood Bond suffered by the thrall is destroyed.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Xaviar",
        description: "It’s rare to find a Gangrel who still claims membership within the Camarilla, and Xaviar is the reason. Often ignored by the other Justicars, he was not truly noticed until he walked into a Conclave claiming to have encountered an Antediluvian who had destroyed the rest of his coterie. Even then, his claims were rebuffed. In return, he resigned his position as Justicar and left the Camarilla after accusing the remaining Justicars of perfidy against their members. Word spread slowly throughout the clan, but they too eventually discarded the safety net of the sect. Xaviar met final death soon after, though the exact method is largely unknown outside of his descendents. Those of his lineage who still walk the nights share a heavy guilt with the rest of the clan for not believing his words sooner. They know that he was wronged, and they take up his torch to bring Clan Gangrel into the light of truth.",
        prereq: "Gangrel",
        benefits: [
            {
                name: "Where the Bodies Are Buried",
                level: 1,
                description: "Xaviar’s knowledge of melding with the earth left a mark on his lineage as he (and possibly you) have experienced visions of being inside the clan founder’s vast inhuman form. By making a successful Resolve + Awareness test vs. a difficulty of 4, you can detect any vampire currently using Earth Meld or who lies torpid, buried within the soil, within 75 miles of you. In addition, once per night, if any of these vampires are Gangrel, you may choose to mystically drain a small amount of blood from them, supernaturally resetting your Hunger to Level 2. These Gangrel are aware they have lost some small amount of blood but not why (unless they also possess this Loresheet). The loss of blood does not alter their Hunger, nor does it cause the Blood Bond when you ingest it.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Monstrous Bat",
                level: 2,
                description: ": Xaviar’s preferred bestial form was that of a bat. Following his encounter with the Antediluvian, he found he had the ability to change into a hybrid between human and bat. Once per game you may take a similar form. Taking this form requires a simple action (no Rouse check) and allows you to fly at your normal movement speed. Alternatively, once per game, whenever you use Shapechange or Metamorphosis, you may add appropriately-sized bat wings to your form, allowing you to fly at your normal movement speed, along with the other benefits of your transformative power. This benefit is not considered to be a Discipline power nor a transformative power. You may maintain your hybrid form until dawn or until you end the usage of Shapechange or Metamorphosis. Taking this form is an obvious breach of the Masquerade.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Loyal Hounds",
                level: 3,
                description: "Few listened to Xaviar the first time he spoke. Rarely does anyone turn a deaf ear to his lineage in the modern nights. Once every three months, you may call for aid, and two loyal Gangrel neonates will answer. Two neonate NPCs with the statistic block for Nomad (page 348) will join you, as long as your fight is defending territory against a supernatural threat. These characters are controlled by the Storyteller. Attempting to use these vampires for improper purposes, such as to seize personal power, will fail and the Hounds will leave.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Zao-Xue",
        description: "When the clan’s progenitor traveled through the East he embraced two childer, Zao-Zei and ZaoXue. The first was a thief and a warrior, and the latter was a scholar and healer. They and their descendants often focused less on the study and pursuit of Golconda, and more on protecting Cainites from supernatural threats. In the modern era, the descendants of Zao-Xue are known as the Watchers: scholars and chroniclers who serve as knowledgeable shepherds through the dangers that threaten vampiric existence.",
        prereq: "Salubri",
        benefits: [
            {
                name: "Hidden Scholar",
                level: 1,
                description: "Most descendants of Zao-Xue are capable of hiding amongst mortals and establishing hidden locations where they can study supernatural dangers to vampires. With this advantage, you gain four dots selected from the Mask and Haven Backgrounds or their associated Advantages.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    { ...emptyBackground, id: "salubri-mask", name: "Mask", freebiePoints: 0, sphere: [], advantages: [] },
                    { ...emptyBackground, id: "salubri-haven", name: "Haven", freebiePoints: 0, sphere: [], advantages: [] },
                ], totalPoints: 4 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Supernatural Encyclopedia",
                level: 2,
                description: "Descendants of Zao-Xue study other supernatural creatures and specific groups of vampires that may pose a threat to the greater vampire population. Through their unlives, they often spend years studying specific creatures, such as werewolves or vampire groups such as the Cult of Lilith. For each dot of the Occult Skill you possess, you may choose one supernatural focus (such as Werewolves, Nosferatu, Church of Set, etc). Whenever you make Lore checks pertaining to any of your supernatural foci, the difficulty of your tests can be no higher than 5. You can’t learn personal information, such as the location of a particular vampire’s haven or werewolves territory. The Storyteller may choose to tell you the information you are looking to glean is too mysterious or provide incomplete information.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Shadow Network",
                level: 3,
                description: "The Watchers are adept at fading in and out of their ties to Humanity. They can quickly disappear from one mortal’s life and easily insert themselves into another. Once a month you may remove one of your Contacts or Allies from your sheet and replace it with a new Contact or Ally. This new Contact or Ally does not have to be in the same Sphere of Influence(s), but they must be the same cost, with the same (or equivalent) advantages as the one removed.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "Descendant of Zelios",
        description: "Nosferatu are well known for their Warrens, complex labyrinths beneath the streets of a city that hold certain death for those unwelcome. The clan attributes their knowledge to Zelios, a scholar of geomantic power, master planner, and gifted architect, who disappeared beneath New York City in the 1990s. He left behind him a wealth of knowledge and information the Clan has continued to use well into current nights, shaping the urban environment to their benefit.",
        prereq: "Nosferatu",
        benefits: [
            {
                name: "Architect",
                level: 1,
                description: "As masters of the urban environment, your lineage has access to all manner of information about structures. Once per game, you can freely access the schematics for a building. If you spend one Downtime Action scouting out a building, you learn all of its security features, secret passages, hidden rooms, and Haven benefits, if any. You never get lost when inside any man-made or vampire-created structure.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Sanctuary",
                level: 2,
                description: "Your Haven is a wonder of modern design, with electronic security, escape routes, and lavish trappings. You gain a three-dot Haven that is exceptionally difficult to breach. It cannot be destroyed or breached by any physical means short of a military-grade attack. You also gain four bonus dots of Haven Advantages of your choosing.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    { ...emptyBackground, id: "nosferatu-haven", name: "Haven", freebiePoints: 3, sphere: [], advantages: [] },
                ], totalPoints: 4 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "The Labyrinth",
                level: 3,
                description: "You have connected Zelios’s Labyrinth to your own city, creating a combination of sewer tunnels and secret routes to move about. This secret network gives you the ability to travel to the exterior of any location with which you are familiar in half the standard travel time, provided the target location is within the same urban center. You may not use this advantage while in combat. Once you enter the sewers and declare your destination you cannot be tracked, followed, intercepted, or caught, even through supernatural means. You may bring a number of individuals with you, up to the number of dots you possess of the Streetwise Skill.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "The First Inquisition",
        description: "Fire is one of the few things that strikes fear in even the most guarded of Kindred souls, and no flames burned brighter in any vampire’s memory than those during the nights of the First Inquisition. Perhaps one of your ancestors survived those dangerous nights and still finds the courage to speak about them, or perhaps you’ve been fortunate enough to come across tomes and texts detailing secrets long thought lost. Whatever the reason, your study of the events leading up to and surrounding the First Inquisition has been extensive, and, to some extent, you know the tactics and calling cards of those ancient Hunters. Though their methods and beliefs have changed, your understanding of the First Inquisition allows you to find patterns in how the Society of St Leopold operates. You are better able to avoid their raids, hiding in the shadows from even the most perceptive among them. Though it comes with great risk, your knowledge allows you to exert some amount of influence over–even manipulate–members of the Second Inquisition to a limited extent.",
        prereq: "",
        benefits: [
            {
                name: "Mistakes of the Past",
                level: 1,
                description: "You know a great deal about what happened in the First Inquisition and can educate any vampire on its historic dangers. Once a month, you can ask the Storyteller for information regarding the original Inquisition. If this ability is used in a situation when historical information or lessons about the First Inquisition would be helpful, the Storyteller is encouraged to provide that information. While using your extensive experience and knowledge of the First Inquisition, you have trained yourself to be sensitive to people and places of Faith. When you are within one mile of Holy Ground, the hairs on your neck stand up. If a character with True Faith is in your line of sight, you become intensely alert. These indicators are subtle and don’t give you the ability to pinpoint the source of Faith, only its proximity.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "The Second Act",
                level: 2,
                description: "Forewarned is forearmed, so you developed a mole in the Society of St Leopold. You have developed a three-dot Contact within the Church Sphere of Influence with the At Arms Length Advantage. This person is connected to the Second Inquisition and may have information about their movements. You must be careful not to reveal yourself as a vampire to them; they will turn on you if they learn your true nature. This Loresheet Advantage is the exception to the rule normally preventing Contacts from being directly related to Hunter factions",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [
                    { ...emptyBackground, id: "firstInquisition-contact", name: "Contacts", freebiePoints: 3, sphere: ["church"], advantages: [
                        {...emptyAdvantage, name:"At Arm's Length", freebiePoints:1}
                    ] },
                ],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Black Spot",
                level: 3,
                description: "You have scouted locations within your Domain that the Society of St Leopold either ignores or possibly fears. Once every three months, if you or any Allies you wish to protect have been targeted by the Society of St Leopold, you can choose to hide out at this location, and the Hunters will call off the search or lose track of you. Why? It could be for any number of reasons. You don’t know, which should raise questions for you. These locations tend to change from time to time, making it impossible to benefit from this location by having a Haven there.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "Golconda",
        description: "Optimistic rumors circulate of a state so pure that the curses of the vampiric condition no longer apply. Elders swiftly crush those heard speaking about this state, but you know they wouldn’t act so firmly if there weren’t some truth to the secrets. It’s thought that this state of being, this perfect harmony between Humanity and the Beast, was discovered by the enigmatic vampire Saulot. Not enough is known about the exact path for one to reach Golconda. Followers of Saulot say it is different for each Kindred, based on the unique sins that they have committed. You may be on the path yourself, seeking the truth to all the rumors. Or perhaps you are a servant of the Master of Ravens and seek to disprove Golconda, erasing it from the hopes and dreams of all vampires.",
        prereq: "",
        benefits: [
            {
                name: "Satisfy the Hunger",
                level: 1,
                description: "You have begun your studies along the path of Golconda and learned to be more efficient in Blood usage. Once per game, you may lower your Hunger by two (but not below one) without feeding as a Standard Action.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Saulot’s Disciple",
                level: 2,
                description: "You believe in Saulot’s teachings that Golconda is the ultimate way to overcome the Kindred curse. You practice a form of self-mastery that involves letting your Beast off the chain sometimes so that you can control it when needed. Prior to a game session, you have taken steps to unleash your Beast in a controlled environment. You automatically succeed on your first Frenzy test of the night.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Overcoming Banes",
                level: 3,
                description: "You have learned some of the secrets of Golconda: a way to walk the never-ending path of balance between Humanity and the Beast. These secrets allow you to suppress your Banes to some extent. As long as you have Humanity 7 or higher, this Loresheet Advantage provides the following benefits: You may reduce your Bane Severity by one (to a minimum of one). Once a night, you may reduce the damage from a fire-based source from Aggravated Damage to Normal Damage. Once every three months, you may spend up to three hours in sunlight without taking damage.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "High Clan",
        description: "You are a proud member of a “High Clan,” and your Blood sets you apart from the “Low Clans,” despite the formal notion of either supposedly set aside with the formation of the Camarilla. Because of the Blood in your veins, you believe you are entitled to certain rights, especially those which allow you to bully and issue orders to members of the Low Clans. Your Bane is less a curse and more a blessing to you, proof of your inherent nobility.",
        prereq: "",
        benefits: [
            {
                name: "Peacock",
                level: 1,
                description: "You are proud of being part of a High Clan and have been trained in etiquette, politics, and courtly graces. Once per game session, you can automatically succeed on a Frenzy test caused by being insulted, embarrassed, or humiliated by a vampire publicly known to be a member of a Low Clan. You also gain the first two dots of the Etiquette and Politics Skills.",
                skillBonus: [{skill:"etiquette",level:2},{skill:"politics",level:2}],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Friends in High Places",
                level: 2,
                description: "You enjoy the benefits of a network of High Clan supporters. You may choose five free dots of the Contacts, Resources, or Allies Backgrounds or their associated Advantages, representing this support.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    { ...emptyBackground, id: "highClan-contacts", name: "Contacts", freebiePoints: 0, sphere: [], advantages: [] },
                    { ...emptyBackground, id: "highClan-Resources", name: "Resources", freebiePoints: 0, sphere: [], advantages: [] },
                    { ...emptyBackground, id: "highClan-Allies", name: "Allies", freebiePoints: 0, sphere: [], advantages: [] },
                ], totalPoints: 5 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Blessed, Not Cursed",
                level: 3,
                description: "You are certain that you are not cursed. Rather, your clan weakness is a blessing that shows your true pedigree, an indulgence that teaches you about who you are and where you ought to improve yourself. Once per month, you may spend a Willpower to ignore your Clan Bane for a scene.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "Low Clan",
        description: "Your clan has traditionally been on the fringes of vampire society. In general, Gangrel, Malkavians, and Nosferatu are all Low Clans, with Brujah and Tremere being grouped in depending on the domain. You have access to the lowest rungs of society, and your less “refined” Blood marks you as a source of rebellion and counter-culture. Though your peers may consider you beneath them, the underbelly of society and access to it comes with some surprising benefits that you have learned to harness.",
        prereq: "",
        benefits: [
            {
                name: "Thick Hide",
                level: 1,
                description: "You are used to being snubbed by people who think themselves better than you, and you do not respond easily to their provocations. Once per game session, you can automatically succeed on a Frenzy test caused by being insulted, embarrassed, or humiliated by a vampire who is publicly known to be a member of a High Clan. You also gain the first two dots of the Streetwise and Subterfuge Skills",
                skillBonus: [{skill:"streetwise", level:2}, {skill:"subterfuge", level:2}],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Uncanny Kinship",
                level: 2,
                description: "You have earned a reputation as someone who helps the Low Clans stick together. While this gains you no love from the High Clans, your friends among the Low Clans support you and help you make connections easily. You can select five dots from the Mask, Familiar, Haven, or Allies Backgrounds or their associated Advantages, representing their support.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    {...emptyBackground, id:"lowClan-mask", name:"Mask"},
                    {...emptyBackground, id:"lowClan-familiar", name:"Familiar"},
                    {...emptyBackground, id:"lowClan-haven", name:"Haven"},
                    {...emptyBackground, id:"lowClan-allies", name:"Allies", sphere:[]},
                ], totalPoints: 5 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Critical Incident",
                level: 3,
                description: "You have all the support and connections that you need to create chaos for another vampire’s networks. Once every six months, you may target another vampire who is known to you and sacrifice up to ten of your own Mortal Connection dots for up to three months. The target vampire loses an equal number of Mortal Connection dots for an equal amount of time. If your target has fewer Mortal Connections dots than you sacrifice, you regain any extra dots. After the time elapses, all lost Mortal Connection dots are regained immediately. If you have specific Backgrounds you want to target, you may tell your Storyteller. Work with your Storyteller and the other player to determine the story of what occurred in the incident.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "Scion of Lucretia",
        description: "Elders called by the Beckoning, key domains falling to Anarchs, the rise of the Second Inquisition... times are hard for the Ivory Tower. In such dangerous times, mastery of the art of diplomacy is essential. Working on the front lines of conflict between Anarch revolutionaries and Camarilla Princes, the Ventrue Archon Lucretia Wright is a decorated diplomat in high-risk situations. When the sect needs cooler heads to prevail, she is among the best options. You have mastered some of her lessons.",
        prereq: "Camarilla",
        benefits: [
            {
                name: "Peacemaker",
                level: 1,
                description: "Your ability to bring together Kindred of opposing ideals and have them peacefully discuss their differences is renowned. Once per night, when you or a vampire in your presence is required to take a Frenzy test resulting from a political disagreement, you can allow them to pass a failed test. You also gain the first two dots of the Etiquette and Politics Skills.",
                skillBonus: [{skill:"etiquette", level:2}, {skill:"politics", level:2}],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Revitalization",
                level: 2,
                description: "Negotiating peace is the first step to rebuilding threatened Camarilla cities. Rebuilding is the second step. You are an expert at bringing resources to bear to help. You may choose six free dots of the Contacts, Resources, or Allies Backgrounds or their associated Advantages, representing the support of other allied Camarilla cities. You may only use these backgrounds in a city where a Camarilla Authority exists.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    {...emptyBackground, id:"camarilla-contacts", name:"Contacts", sphere:[]},
                    {...emptyBackground, id:"camarilla-resources", name:"Resources"},
                    {...emptyBackground, id:"camarilla-allies", name:"Allies", sphere:[]},
                ], totalPoints: 6 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Armistice",
                level: 3,
                description: "For conflict to be resolved, there must be peaceful discourse. You have learned how to ensure a meeting is truly safe and call an Armistice. Once every three months, prior to the beginning of a game session you may select a location within your city. You may then call any number of vampires to this location to enter into a parley. Peace is expected, and safety is assured—because of your security measures, anyone present in the scene may immediately declare Fair Escape at will. This overrides all other rules and restrictions on Fair Escape, including initiative order. If a character declares Fair Escape, they must immediately leave the scene. They may either safely escape the city or travel to a location of their choosing within the city. This mechanic expires at the end of the night.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "Sect War Veteran",
        description: "The early 1990s and 2000s were full of war and violence between the Camarilla and the Sabbat, transforming what had been simple dogmatic disagreements to an all-out blood feud in North America. The Sabbat struck hard and fast, in an attempt to swarm up from their seat of power in Mexico and seize control of the Americas. In response, the Camarilla built up a brutally-effective defense led by militant legends such as Theo Bell. With a strong and systematic defense, the Camarilla seized many domains back from the Sabbat across the American south. In each of those cities, participants and survivors alike have stories of their involvement and the horrors they were forced to witness.",
        prereq: "",
        benefits: [
            {
                name: "Survivor",
                level: 1,
                description: "You fought in a domain that was scourged during the Sect War. You remember how the Sabbat and Camarilla strategized, warring in the city without alerting mortals. Once per game session, you may ask your Storyteller how to most effectively avoid breaching the Masquerade in a combat situation, how to cover up a combat-related Masquerade breach, or for a piece of information about the Sect War that may be relevant to a story in your domain.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Soldier",
                level: 2,
                description: "Vampires of all stripes were pulled into the war, whether as combatants or suppliers. You were there, and you have the scars to prove it. You may select three free dots from the Resources, Herd, or Contact Backgrounds or Advantages, representing your sect’s rewards for your heroic service. In addition, other soldiers of previous conflicts are willing to provide assistance directly. Once every three months, you may learn one dot of an out-of-clan discipline without instruction or the need to consume blood from another player character (though you still consume the blood of the NPC soldier). In addition, no downtimes need to be spent. The soldier who aids you will not require payment of any kind.",
                skillBonus: [],
                selectableBackgrounds: { options: [
                    {...emptyBackground, id:"sectWar-contacts", name:"Contacts", sphere:[]},
                    {...emptyBackground, id:"sectWar-herd", name:"Herd"},
                    {...emptyBackground, id:"sectWar-resources", name:"Resources"},
                ], totalPoints: 3 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Strategist",
                level: 3,
                description: "Vampire strike teams involved in the war moved from domain to domain, losing and capturing domains in rapid succession. The push-and-pull of this conflict led to some vampires obsessing over having defensive positions well established and prepared. Your Haven is a fortress. You gain a free two-dot Haven Background with two dots in the Security and Guards Advantages. If your Coterie has a Domain, add two dots to your coterie’s Domain’s Deterrents score (see pages 307).",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [
                    {...emptyBackground, id:"sectWar-haven", name:"Haven", freebiePoints:2, advantages: [
                        {...emptyAdvantage, name:"Security", freebiePoints:2},
                        {...emptyAdvantage, name:"Guards", freebiePoints:2},
                    ]},
                ],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "The Society of Heralds",
        description: "For many, the social hierarchies of the Camarilla are the only thing preventing the Kindred populace from devolving into insatiable monsters. Without guidelines and structure to dictate proper behavior and thought, Kindred would be no better than animals. In some domains, the duties of the Herald have been subsumed by the Prince. In other domains, the function of the Heralds has become a lasting and unshakeable legacy, one that has survived intact through the years, even if the holder of the Praxis has been petty or transient. Heralds from a number of major domains have come together to form an unofficial network, commonly referred to as the Society of Heralds. The Heralds of this group share influence, gossip, and political sway.",
        prereq: "Camarilla",
        benefits: [
            {
                name: "Hot Gossip",
                level: 1,
                description: "Your connection to the Society lends you all sorts of information, much of which others would consider trivial. This helps you recognize vampires from other cities and possibly know a little about them. Up to three times per game, when a new vampire character arrives, you immediately recognize them (assuming they are not disguised). The Storyteller will provide you their character name, what city they call “home,” and what their status is in that city. Finally, you may ask the player if there are any rumors or interesting information about their character that they wish to share with you. (They are not obligated to share anything with you, however.) The easiest time to process this advantage is prior to the beginning of the game session, when players are arriving and setting up. Then you have all the information you need without having to interrupt roleplay.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Tenured Protection",
                level: 2,
                description: "Because you are a Herald in your own domain, or perhaps because of personal allies you have within the Society, those who politically attack you risk having their own reputation tarnished. Should anyone voice Opposition against you, your standing within the Society negates their opinion. Once a month you may ignore one Opposition assigned to you. The character who assigned it to you may not assign you Opposition for the remainder of the month.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Social Elite",
                level: 3,
                description: "You have had a long-standing reputation with the Society. You may have been, or still are, a prominent Herald in vampire society, or your allies within the Society are numerous and respected. You may award Support to any character, even one who has more Status than you. In addition, you may award one additional Support and Opposition more than normal. (Example: A Status 2 vampire with this advantage can award three Support and three Opposition in a night.)",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "The Trinity",
        description: "The Golden Age of Constantinople is spoken of with mostly fond remembrance by those vampires old enough, or learned enough, to know of its existence. Three vampires held sway over the city: the Trinity of Michael, the Dracon, and Antonius, a Toreador, a Tzimisce, and a Ventrue respectively. Because of their efforts and philosophies, the vampire utopia of Constantinople existed for as long as it did. Through a combination of outside forces, the Trinity was torn apart and the stability of Constantinople shattered. There are many who believe the Trinity can be brought back together in some new form, recreating the utopia. Others learn what they can so they can fend off what, in their eyes, is a considerable threat to all Kindred Traditions.",
        prereq: "",
        benefits: [
            {
                name: "Constantinople",
                level: 1,
                description: "You are one of the few Kindred who knows why Constantinople represented the best of vampire society, where ideas and philosophies were shared without violence, and you teach what you can of this philosophy to like-minded individuals. They believe in your cause and provide you material support. You may select two dots from the Resources, Haven, or Allies Backgrounds or Advantages. In addition, you gain three free points in the Politics Skill.",
                skillBonus: [{skill:"politics", level:3}],
                selectableBackgrounds: { options: [
                    {...emptyBackground, id:"trinity-resources", name:"Resources"},
                    {...emptyBackground, id:"trinity-Haven", name:"Haven"},
                    {...emptyBackground, id:"trinity-Allies", name:"Allies", sphere:[]},
                ], totalPoints: 2 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "The Dream",
                level: 2,
                description: " For one thousand years, the Trinity chased a vision of vampire utopia. The Toreador ancient known as Michael encouraged Constantinople’s Kindred to be more than just predators. You encourage enlightenment and inspire others to grow distant from the Beast. Once per night, you may spend a Willpower point to allow another vampire to automatically succeed in a Frenzy test. This benefit must be used before the vampire tests for Frenzy.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "The New Trinity",
                level: 3,
                description: "You are fully committed to seeing the Trinity’s Constantinople resurrected, and you will do whatever you must to make their vision come to pass. When choosing this Loresheet Advantage, choose two other characters who believe in your vision of a new vampire utopia. Once every three months, you and your selected allies may remove up to two Stains each that were gained on the path to bringing about harmony among the vampires of your city. The Storyteller is the final arbiter of whether or not this applies to actions in a scene. If one of your chosen allies dies or no longer believes in your vision, you must choose a new character to enter your Trinity",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

    {
        name: "The Week of Nightmares",
        description: "Kindred of all walks seem to know something about the Week of Nightmares, but none of them seems to be able to date it consistently. Calling it a “week” of Nightmares is really a misnomer, possibly adopted to downplay the torrential chaos that rained down on Clan Ravnos. In actuality, the event took place over several years, and it affected several thousand vampires. The ancient founder of Clan Ravnos Awoke from his slumber and began to slaughter his childer. Thin-blooded appeared, with omens and portents as Wormwood burned in the sky. You watch for signs of doom yet to come, learning to spot those omens either through study or because you survived, having manipulated the chaos of the event to your benefit.",
        prereq: "",
        benefits: [
            {
                name: "The Night Network",
                level: 1,
                description: "Your friends among the Ravnos (and other survivors of the Week of Nightmares) trust you to run a waypoint for their network of travelers. You gain a twopoint Haven with one point in each of the Luxury, Security, and Guardsmen Advantages. Ravnos passing through will sometimes stay there at the Storyteller’s discretion. You can safely move goods and messages between cities through your facility. Sometimes other Ravnos bring news and warnings from outside your city.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [
                    {...emptyBackground, id:"nightmares-Haven", name:"Haven", freebiePoints:2, advantages: [
                        {...emptyAdvantage, name:"Luxury", freebiePoints:1},
                        {...emptyAdvantage, name:"Security", freebiePoints:1},
                        {...emptyAdvantage, name:"Guardsmen", freebiePoints:1},
                    ]},
                ],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Survivor",
                level: 2,
                description: "Having either survived the Week of Nightmares yourself or learning from someone who has, you have developed unparalleled methods of escaping dangerous situations. You have the ability to slip away when no one is looking, escaping even the most stalwart prison or restraint. Physical attacks do not prevent you from Fair Escaping, unless the attack successfully does damage or you are grappled (see Fair Escape, page 89). Characters who are physically restrained or imprisoned (not grappled) may study their surroundings for two turns, after which they find a way to escape their bonds. This Advantage does not allow the character to escape from a situation with no logical exit, to escape mental restraints like Dominate, or to move through solid objects.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "The Red Star",
                level: 3,
                description: "Wormwood, as most supernaturals call it, or 28978 IXION, as NASA designated it, still burns red in the night sky. At least you still think it does. While it has faded for others, you believe the Red Star still exists hidden from everyone but you. Your ability to “see” the Red Star has changed you. Once per game, you can look up at the night sky where you believe Wormwood to be and reduce your Hunger to two. In addition, once per game, you can ignore the effects of any one Condition for 10 minutes. If the circumstances that levied the Condition remain after these 10 minutes, you suffer that Condition normally.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
    {
        name: "FIRSTLIGHT",
        description: "Tonight’s vampires have managed to do something which has, historically, never been done. They have presented a threat so broad in scope that the intelligence agencies of the world have banded together to hunt them. FIRSTLIGHT was born out of a need to protect the mortals of the world. Most operatives within FIRSTLIGHT have no idea that they are hunting vampires, and incident reports after the fact will support that they were dismantling terrorist cells around the globe. Through a combination of old-world investigative techniques and top-of-the-line modern technology, FIRSTLIGHT has its eyes and ears in all sectors. Code words such as “blankbodies,” fuzzy images of Lasombra on recordings, and pushy TSA agents are part of the effort to protect mortals and dismantle the stranglehold Kindred have on mortal societies.",
        prereq: "",
        benefits: [
            {
                name: "No Records Found",
                level: 1,
                description: "You have managed to erase yourself from FIRSTLIGHT records entirely. You gain a free three-dot Mask and the Zeroed Merit.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [
                    {
                        ...emptyBackground, id: "firstlight-mask", name: "Mask", freebiePoints: 3, sphere: [], advantages: []
                    }
                ],
                meritsAndFlaws: [
                    { ...emptyMeritFlaw, id: 'firstlight-Zeroed', name: "Zeroed", freebiePoints: 2, note: "No Records Found" },
                ],
                selectableSkills: []
            },
            {
                name: "Evasion",
                level: 2,
                description: "You have learned how to expertly avoid being followed. As long as your path leads through an urban area, it is not possible to follow you without using supernatural powers specifically designed to track",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "Friend on the Inside",
                level: 3,
                description: "You have a mole on the inside whom you have manipulated into reporting back to you at key moments. Discuss with your Storyteller whether your control over this “friend” takes the form of supernatural coercion, blackmail, threats, or bribery. The mole alerts you if FIRSTLIGHT is coming after you, and, once every three months, they will commit an act of minor sabotage (destroying evidence, screwing up an operation, etc.) on your orders. This mole does not count as a Contact or Ally.",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },
] 

/* 


    {
        name: "",
        description: "",
        prereq: "",
        benefits: [
            {
                name: "",
                level: 1,
                description: "",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "",
                level: 2,
                description: "",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            },
            {
                name: "",
                level: 3,
                description: "",
                skillBonus: [],
                selectableBackgrounds: { options: [], totalPoints: 0 },
                backgrounds: [],
                meritsAndFlaws: [],
                selectableSkills: []
            }
        ]
    },

*/

export const emptyBenefit = {
    name: "",
    level: 3,
    description: "You have a mole on the inside whom you have manipulated into reporting back to you at key moments. Discuss with your Storyteller whether your control over this “friend” takes the form of supernatural coercion, blackmail, threats, or bribery. The mole alerts you if FIRSTLIGHT is coming after you, and, once every three months, they will commit an act of minor sabotage (destroying evidence, screwing up an operation, etc.) on your orders. This mole does not count as a Contact or Ally.",
    skillBonus: [],
    selectableBackgrounds: { options: [], totalPoints: 0 },
    backgrounds: [],
    meritsAndFlaws: [],
    selectableSkills: []
}

export const loresheetFilter = (kindred: Kindred) => {
    let clan = kindred.clan;
    let sect = kindred.sect;
  
    let filteredloreSheets = loresheets.filter((loresheet) => {
      // Check if the prereq is not an empty string and matches either the clan or sect
      return loresheet.prereq === "" || loresheet.prereq === clan || loresheet.prereq === sect;
    });
  
    return filteredloreSheets;
  };


  export const loresheetCleanup = (kindred: Kindred) => {
    let loresheet = loresheets.find(ls => ls.name === kindred.loresheet.name);
    if (!loresheet) { return null; }

    let filteredSkills = JSON.parse(JSON.stringify(kindred.skills));
    let filteredBackgrounds = JSON.parse(JSON.stringify(kindred.backgrounds));
    let filteredMerits = JSON.parse(JSON.stringify(kindred.meritsFlaws));

    loresheet.benefits.forEach((benefit) => {
        // Update skills
        for (const skillName in filteredSkills) {
            let skill = skillName as V5SkillsKey;
            filteredSkills[skill].freebiePoints = 0;
        }

        // Filter backgrounds
        if (benefit.backgrounds.length > 0) {
            benefit.backgrounds.forEach((bg) => {
                filteredBackgrounds = filteredBackgrounds.filter((background: any) => background.id !== bg.id);
            });
        }

        // Filter selectable backgrounds
        if (benefit.selectableBackgrounds.options.length > 0) {
            benefit.selectableBackgrounds.options.forEach((bg) => {
                filteredBackgrounds = filteredBackgrounds.filter((background: any) => background.id !== bg.id);
            });
        }

        // Filter merits and flaws
        if (benefit.meritsAndFlaws.length > 0) {
            benefit.meritsAndFlaws.forEach((m) => {
                filteredMerits = filteredMerits.filter((merit: any) => merit.id !== m.id);
            });
        }
    });

    // Return an object with filtered options
    return {
        skills: filteredSkills,
        backgrounds: filteredBackgrounds,
        meritsFlaws: filteredMerits,
    };
};


export const updateSkills = (kindred:Kindred, benefit:Benefit) => {
    const updatedSkills = JSON.parse(JSON.stringify(kindred.skills));
    const filteredSkills = JSON.parse(JSON.stringify(kindred.skills));
    
    // Clear freebiePoints for all skills
    for (const skillName in filteredSkills) {
        const skill = skillName as V5SkillsKey;
        filteredSkills[skill].freebiePoints = 0;
    }
    
    // Apply skill bonuses if any
    if (benefit.skillBonus.length > 0) {
        benefit.skillBonus.forEach((bonus) => {
            const skill = bonus.skill;
            updatedSkills[skill].freebiePoints = 2;
        });
    }
    
    return { updatedSkills, filteredSkills };
}

export const updateBackgrounds = (kindred:Kindred, benefit:Benefit) => {
    const updatedBackgrounds = JSON.parse(JSON.stringify(kindred.backgrounds));
    let filteredBackgrounds = JSON.parse(JSON.stringify(kindred.backgrounds));
    
    // Add specified backgrounds
    if (benefit.backgrounds.length > 0) {
        benefit.backgrounds.forEach((bg) => {
            let background = bg
            let ResourcesRef = kindred.backgrounds.find((b) => b.name === "Resources")
            let HerdRef = kindred.backgrounds.find((b) => b.name === "Herd")
            if (bg.name==="Resources" && ResourcesRef) {
                background = mergeBackgrounds(`${background.name}_merged`, ResourcesRef, bg)
            }
            if (bg.name==="Herd" && HerdRef) {
                background = mergeBackgrounds(`${background.name}_merged`, HerdRef, bg)
            }
            updatedBackgrounds.push(background);
            filteredBackgrounds = filteredBackgrounds.filter((background: any) => background.id !== bg.id  && !background.id.includes(`${background.name}_merged`));
        });
    }
    
    // Filter selectable backgrounds
    if (benefit.selectableBackgrounds.options.length > 0) {
        benefit.selectableBackgrounds.options.forEach((bg) => {
            filteredBackgrounds = filteredBackgrounds.filter((background: any) => (background.id !== bg.id) && !background.id.includes(`${background.name}_merged`));
        });
    }
    
    
    return { updatedBackgrounds, filteredBackgrounds };
}

export const updateMeritsFlaws = (kindred:Kindred, benefit:Benefit) => {
    const updatedMerits = JSON.parse(JSON.stringify(kindred.meritsFlaws));
    let filteredMerits = JSON.parse(JSON.stringify(kindred.meritsFlaws));
    // Add merits and flaws
    if (benefit.meritsAndFlaws.length > 0) {
        benefit.meritsAndFlaws.forEach((m) => {
            updatedMerits.push(m);
            filteredMerits = filteredMerits.filter((merit: any) => merit.id !== m.id);
        });
    }
    return { updatedMerits, filteredMerits };
}

type TypeCategory = 'creationPoints' | 'experiencePoints' ;
export const buyBenefit = (
    kindred: Kindred,
    loresheet: Loresheet,
    benefit: Benefit,
    type: TypeCategory,
    setKindred: (kindred: Kindred) => void
  ) => {
    // Initialize variables for creation and experience points
    let creationPoints = 0;
    let experiencePoints = 0;
  
    // Calculate points based on the type of benefit
    if (type === "creationPoints") {
      creationPoints = benefit.level;
    } else if (type === "experiencePoints") {
      experiencePoints = benefit.level * 3;
    }
  
    // Create a new benefit object for the selected benefit
    const newBenefit = {
      name: benefit.name,
      creationPoints,
      freebiePoints: 0,
      experiencePoints,
    };
  
    // Add the new benefit to the purchased benefits array
    const updatedBenefits = [...kindred.loresheet.benefits, newBenefit];
  
    // Update the kindred object with the purchased benefit
    setKindred({
      ...kindred,
      loresheet: {
        ...kindred.loresheet,
        name: loresheet.name,
        benefits: updatedBenefits,
      },
      skills:updateSkills(kindred, benefit).updatedSkills, // Update skills with the new benefit
      backgrounds:updateBackgrounds(kindred, benefit).updatedBackgrounds, // Update backgrounds with the new benefit
      meritsFlaws:updateMeritsFlaws(kindred, benefit).updatedMerits, // Update merits/flaws with the new benefit
    });
  };

export const handleBenefitAdvantageChange = (backgroundRef: V5BackgroundRef, advantageRef: V5AdvantageRef, benefitData: Benefit, setBenefitData: Function, val: number ,type:string) => {
    const existingAdvantage = backgroundRef.advantages.find((a) => a.name === advantageRef.name);
    if (!existingAdvantage) {
      backgroundRef.advantages.push({ ...advantageRef, [type]: val });
    }
  
    const updatedOption = {
      ...backgroundRef,
      advantages: backgroundRef.advantages.map((advantage) =>
        advantage.name === advantageRef.name ? { ...advantage, [type]: val } : advantage
      ),
    };
  
    const updatedBenefitData = {
      ...benefitData,
      selectableBackgrounds: {
        ...benefitData.selectableBackgrounds,
        options: benefitData.selectableBackgrounds.options.map((o: any) =>
          o.name === backgroundRef.name ? updatedOption : o
        ),
      },
    };
  
    setBenefitData(updatedBenefitData);
  };
  