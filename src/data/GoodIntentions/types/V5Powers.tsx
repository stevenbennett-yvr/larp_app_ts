import { z } from 'zod';
import { DisciplineKey, disciplineNameSchema, v5DisciplineLevel } from './V5Disciplines';
import { Ritual } from './V5Rituals';
import { Kindred } from './Kindred';

export const powerRefSchema = z.object({
    name: z.string(),
    creationPoints: z.number(),
    freebiePoints: z.number(),
})
export type PowerRef=z.infer<typeof powerRefSchema>

export const amalgamPrerequisiteSchema = z.object({
    discipline: disciplineNameSchema,
    level: z.number().min(1).int(),
})

export type AmalgamPrerequisite = z.infer<typeof amalgamPrerequisiteSchema>

export const powerSchema = z.object({
    name: z.string(),
    description: z.string(),
    summary: z.string(),
    dicePool: z.string(),
    level: z.number().min(1).int(),
    discipline: disciplineNameSchema,
    rouseChecks: z.number().min(0).int(),
    amalgamPrerequisites: amalgamPrerequisiteSchema.array(),
    powerPrerequisite: z.string().array(),
    duration: z.string(),
})
export type Power = z.infer<typeof powerSchema>

export const allPowers:Power[] = [

    //Animalism
    //1
    { name: "Feral Whispers", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can summon and communicate with an animal.", dicePool: "", level: 1, discipline: "animalism" },
    { name: "Sense the Beast", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can sense the beast within other vampires, mortals and supernatural creatures.​​", dicePool: "", level: 1, discipline: "animalism" },
    //2
    { name: "Animal Succulence", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can slake additional Hunger by feeding on animals.", dicePool: "", level: 2, discipline: "animalism" },
    { name: "Atavism", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can cause an animal to temporarily revert to their primal instincts, forcing them to attack anyone nearby or to flee the scene", dicePool: "Charisma + Animalism", level: 2, discipline: "animalism" },
    //3
    { name: "Enhance the Wild Ride", description: "Enhance the Wild Ride, once purchased, automatically boosts your Blood Potency by two for Blood Surge bonuses during Frenzies, allows one Blood Surge without a Rouse check per Frenzy, and maintains its effect throughout a frenzy, contrary to typical social powers.", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You have learned how to work with the Beast, instead of against it, leaning into every Frenzy and becoming far more dangerous.", dicePool: "", level: 3, discipline: "animalism" },
    { name: "Quell the Beast", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can cow mortals and can pull vampiric targets out of frenzy.", dicePool: "Charisma + Animal Ken", level: 3, discipline: "animalism" },
    { name: "Unliving Hive", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can become a permanent home for swarms of flies or cockroaches or similar small creatures.", dicePool: "", level: 3, discipline: "animalism" },
    //4
    { name: "Subsume the Spirit", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can mentally take over an animal target.", dicePool: "Manipulation + Animal Ken", level: 4, discipline: "animalism" },
    { name: "Control the Savage Beast", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Manipulate other vampires in frenzy.", dicePool: "Charisma + Animal Ken", level: 4, discipline: "animalism" },
    //5
    { name: "Animal Domination", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can perfectly direct swarms and flocks of animals.", dicePool: "", level: 5, discipline: "animalism" },
    { name: "Drawing Out the Beast", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire can cause a target to immediately frenzy.", dicePool: "Wits + Animal Ken", level: 5, discipline: "animalism" },    

    //Auspex
    //1
    { name: "Heightened Senses", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Enhance vampiric senses.", dicePool: "", level: 1, discipline: "auspex" },
    { name: "Sense the Unseen", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Sense supernatural activity.", dicePool: "Wits + Awareness", level: 1, discipline: "auspex" },
    //2
    { name: "Panacea", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "fortitude", level: 1 }], powerPrerequisite:[], summary: "Heals Willpower and calms nerves.", dicePool: "Composure + Medicine", level: 2, discipline: "auspex" },
    { name: "Premonition", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Visions of the future", dicePool: "", level: 2, discipline: "auspex" },
    { name: "Scry the Soul", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Perceives information about the target", dicePool: "Intelligence + Insight", level: 2, discipline: "auspex" },
    //3
    { name: "Collective Cognizance", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You automatically notice mental and social attacks without a test.", dicePool: "Wits + Awareness", level: 3, discipline: "auspex" },
    { name: "Share the Senses", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Sense through another person (eg. see through their eyes)", dicePool: "Resolve + Awareness", level: 3, discipline: "auspex" },
    //4
    { name: "Unveil the Edifice", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You can extend your senses beyond your immediate surroundings", dicePool: "", level: 4, discipline: "auspex" },
    { name: "Spirit's Touch", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Gathering emotional residue from an object or location", dicePool: "Intelligence + Investigation", level: 4, discipline: "auspex" },
    //5
    { name: "Clairvoyance", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Information gathering from surroundings", dicePool: "Intelligence + Investigation", level: 5, discipline: "auspex" },
    { name: "Possession", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "dominate", level: 3}], powerPrerequisite:[], summary: "Possess a mortal body", dicePool: "Resolve + Intimidation", level: 5, discipline: "auspex" },
    { name: "Telepahty", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Read minds and project thoughts", dicePool: "Resolve + Awareness", level: 5, discipline: "auspex" },
    { name: "Unburdening the Bestial Soul", description: "", rouseChecks: 1, powerPrerequisite:["Panacea"], amalgamPrerequisites: [{ discipline: "dominate", level: 3}], summary: "Stain removal or protection from Stains", dicePool: "", level: 5, discipline: "auspex" },

    //Blood Sorcery
    //1
    { name: "A Taste for Blood", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Discover traits of another through their blood.", dicePool: "", level: 1, discipline: "blood sorcery" },
    { name: "Corrosive Vitae", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Turn vitae corrosive.", dicePool: "", level: 1, discipline: "blood sorcery" },
    //2
    { name: "Extinguish Vitae", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "increase another vampire's hunger", dicePool: " Intelligence + Occult", level: 2, discipline: "blood sorcery" },
    { name: "Blood Rash", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "When inflicted with this curse, Rousing the Blood causes the victim to become agitated", dicePool: " Intelligence + Occult", level: 2, discipline: "blood sorcery" },
    //3
    { name: "Blood of Potency", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "temporarily increase your Blood Potency", dicePool: "Resolve + Occult", level: 3, discipline: "blood sorcery" },
    { name: "Scorpion's Touch", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "turn your blood into paralyzing poison", dicePool: "Dexterity + Marksmanship", level: 3, discipline: "blood sorcery" },
    //4
    { name: "Theft of Vitae", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Manipulate blood from a victim through the air to feed", dicePool: "Wits + Occult", level: 4, discipline: "blood sorcery" },
    { name: "Slow the Beating Heart", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Slow the heartbeat of nearby mortals, sending them into a coma-like sleep", dicePool: "Wits + Occult", level: 4, discipline: "blood sorcery" },
    //5
    { name: "Baal's Caress", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:["Scorpion's Touch"], summary: "Change the user's own Vitae into an aggressive and lethal poison", dicePool: "Dexterity + Marksmanship", level: 5, discipline: "blood sorcery" },
    { name: "Cauldron of Blood", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:["Scorpion's Touch"], summary: "Change the user's own Vitae into an aggressive and lethal poison", dicePool: "Dexterity + Marksmanship", level: 5, discipline: "blood sorcery" },

    //Celerity
    //1
    { name: "Cat's Grace", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Automatically pass balance tests.", dicePool: "", level: 1, discipline: "celerity" },
    { name: "Quicksilver", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Your reactions are so quick you do not have time to be surprised.", dicePool: "", level: 1, discipline: "celerity" },
    //2
    { name: "Fleetness", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Add Celerity rating to Initiative.", dicePool: "", level: 2, discipline: "celerity" },
    { name: "Rapid Reflexes", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Gain an additional simple action per turn. Add your dots in Celerity to non-combat Dexterity tests.", dicePool: "", level: 2, discipline: "celerity" },
    //3
    { name: "Blink", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Closes the distance as if teleporting.", dicePool: "", level: 3, discipline: "celerity" },
    { name: "Nimble Departure", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You may choose to declare Fair Escape at the end of a turn instead of during your initiative.", dicePool: "", level: 3, discipline: "celerity" },
    //4
    { name: "Unerring Aim", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "auspex", level: 2 }], powerPrerequisite:[], summary: "You can automatically hit a target with a ranged attack.", dicePool: "", level: 4, discipline: "celerity" },
    { name: "Velocity", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You may reduce a critical hit against you to a normal hit.", dicePool: "", level: 4, discipline: "celerity" },
    { name: "Zephyr", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "This power lets you move as quickly and effortlessly as the wind itself.", dicePool: "", level: 4, discipline: "celerity" },
    //5
    { name: "Bulletstorm", description: "", rouseChecks: 2, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Fire a hail of bullets with uncanny speed and precision.", dicePool: "", level: 5, discipline: "celerity" },
    { name: "Lightning Strike", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Attack with lightning speed, automatically hitting.", dicePool: "", level: 5, discipline: "celerity" },

    //Dominate
    //1
    { name: "Cloud Memory", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Make someone forget the current moment.", dicePool: "Charisma + Persuasion vs. Wits + Resolve", level: 1, discipline: "dominate" },
    { name: "Compel", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "a single, short command with an immediate effect", dicePool: "Charisma + Intimidation vs. Intelligence + Resolve", level: 1, discipline: "dominate" },
    //2
    { name: "Dementation", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "obfuscate", level: 2 }], powerPrerequisite:[], summary: "trigger psychotic breaks or nervous breakdowns in others", dicePool: "Manipulation + Insight vs. Intelligence + Composure", level: 2, discipline: "dominate" },
    { name: "Mesmerize", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Issue complex commands.", dicePool: "Manipulation + Persuasion vs. Intelligence + Resolve", level: 2, discipline: "dominate" },
    { name: "Domitor's Favor", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "make it harder for thralls to resist you", dicePool: "", level: 2, discipline: "dominate" },
    //3
    { name: "Forgetful Mind", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Rewrite someone's memory", dicePool: "Manipulation + Subterfuge vs. Composure + Resolve", level: 3, discipline: "dominate" },
    { name: "Submerged Directive", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:["Cloud Memory","Compel","Mesmerize"], summary: "Implant Dominate orders as suggestions for victims", dicePool: "Manipulation + Subterfuge vs. Composure + Resolve", level: 3, discipline: "dominate" },
    //4
    { name: "Rationalize", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Convince victims of Dominate it was their idea the entire time", dicePool: "", level: 4, discipline: "dominate" },
    { name: "Conditioning", description: "", rouseChecks: 2, amalgamPrerequisites: [], powerPrerequisite:[], summary: "An adept hypnotist, you may now use repeated sessions to implant suggestions.", dicePool: "Manipulation + Persuasion vs. Intelligence + Resolve", level: 4, discipline: "dominate" },
    //5
    { name: "Mass Manipulation", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Extend effects of Dominate to multiple targets.", dicePool: "", level: 5, discipline: "dominate" },
    { name: "Terminal Decree", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:["Compel", "Mesmerism","Conditioning"], summary: "Bolster effects of Dominate to be able to circumvent victims' self-preservation.", dicePool: "", level: 5, discipline: "dominate" },

    //Fortitude
    //1
    { name: "Resiliency", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You are more difficult to stake and immune to extreme cold.", dicePool: "", level: 1, discipline: "fortitude" },
    { name: "Toughness", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Gain one health level and ignore wound penalties", dicePool: "", level: 1, discipline: "fortitude" },
    //2
    { name: "Coagulate", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You are able to secure your blood from supernatural influence.", dicePool: "", level: 2, discipline: "fortitude" },
    { name: "Enduring Beasts", description: "", rouseChecks: 1, amalgamPrerequisites: [{discipline:"animalism", level:1}], powerPrerequisite:[], summary: "Share the vampire's toughness with animals.", dicePool: "", level: 2, discipline: "fortitude" },
    { name: "Unswayable Mind", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: " You are immune to the Distracted Condition.", dicePool: "", level: 2, discipline: "fortitude" },
    { name: "Valeren", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "auspex", level: 1 }], powerPrerequisite:[], summary: "Mend an injured target.", dicePool: "Intelligence + Medicine vs. a difficulty of 2", level: 2, discipline: "fortitude" },
    //3
    { name: "Roots of the Mountain", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "With this power you cannot be knocked down.", dicePool: "", level: 3, discipline: "fortitude" },
    { name: "Unyielding", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You are immune to the Weakened Condition.", dicePool: "", level: 3, discipline: "fortitude" },
    //4
    { name: "Aegis", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "you may reduce one source of Aggravated Damage to Normal Damage.", dicePool: "", level: 4, discipline: "fortitude" },
    { name: "Adaptability", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Your Blood has made your body adaptable to defend against a multitude of hazards.", dicePool: "", level: 4, discipline: "fortitude" },
    //5
    { name: "Flesh of Marble", description: "", rouseChecks: 2, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You can only take one damage from any attack or explosion.", dicePool: "", level: 5, discipline: "fortitude" },
    { name: "Personal Armor", description: "", rouseChecks: 2, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Those who dare try to hit you feel some of that force redirected back at them.", dicePool: "", level: 5, discipline: "fortitude" },


    //Obfuscate
    //1
    { name: "Conceal", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Hide any inanimate objects in your possession.", dicePool: "", level: 1, discipline: "obfuscate" },
    { name: "Silence of Death", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Mute all sounds you make", dicePool: "", level: 1, discipline: "obfuscate" },
    //2
    { name: "Chimerstry", description: "", rouseChecks: 1, amalgamPrerequisites: [{discipline:"presence", level:1}], powerPrerequisite:[], summary: "Hide any inanimate objects in your possession.", dicePool: "Manipulation + Subterfuge vs. Composure + Wits", level: 2, discipline: "obfuscate" },
    { name: "Unseen Passage", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "move while remaining hidden", dicePool: "", level: 2, discipline: "obfuscate" },
    { name: "Cache", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:["Conceal"], summary: "Your ability to Conceal objects now extends to items not on your person.", dicePool: "", level: 2, discipline: "obfuscate" },
    //3
    { name: "Fata Morgana", description: "", rouseChecks: 1, amalgamPrerequisites: [{discipline:"presence", level:1}], powerPrerequisite:[], summary: "Create eaborate hallucinations.", dicePool: "Manipulation + Subterfuge vs. Intelligence + Awareness", level: 3, discipline: "obfuscate" },
    { name: "Ghost in the Machine", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Obfuscate affects technology (eg. hide yourself from recordings)", dicePool: "", level: 3, discipline: "obfuscate" },
    { name: "Mask of a Thousand Faces", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "make yourself appear as a non-descript stranger to others", dicePool: "", level: 3, discipline: "obfuscate" },
    //4
    { name: "Vanish from the Mind's Eye", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:["Conceal","Unseen Passage"], summary: "Activate Cloak of Shadows or Unseen Passage while being observed.", dicePool: "Wits + Stealth vs. Wits + Awareness", level: 4, discipline: "obfuscate" },
    { name: "Soul Mask", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Your mind is a fortress hidden behind your powers of Obfuscate.", dicePool: "", level: 4, discipline: "obfuscate" },
    //5
    { name: "Cloak the Gathering", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Shelter companions under Obfuscate.", dicePool: "", level: 5, discipline: "obfuscate" },
    { name: "Phantom Hunter", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You can act while obfuscated without drawing attention.", dicePool: "", level: 5, discipline: "obfuscate" },

    //Oblivion
    //1
    { name: "Shadow Cloak", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The vampire shapes ambient shadows to conceal their presence and make themselves more frightening.", dicePool: "", level: 1, discipline: "oblivion" },
    { name: "Oblivion's Sight", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "See in darkness clearly and see ghosts present", dicePool: "", level: 1, discipline: "oblivion" },
    //2
    { name: "Arms of Ahriman", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "potence", level: 2 }], powerPrerequisite:[], summary: "Conjures shadow appendages that the user can control.", dicePool: "", level: 2, discipline: "oblivion" },
    { name: "Shadow Cast", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Conjure shadows from the user's body", dicePool: "", level: 2, discipline: "oblivion" },
    { name: "Masque of Death", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Allows the Kindred to turn his/her body into a corpse-like state", dicePool: "", level: 2, discipline: "oblivion" },
    //3
    { name: "Aura of Decay", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Harnessing their connection to Oblivion can make plants wilt, animals and humans sick, and food spoil.", dicePool: "", level: 3, discipline: "oblivion" },
    { name: "Reaper's Passing", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline:"dominate", level: 1 }], powerPrerequisite:[], summary: "Creates a 'near death experience' in the subject of choice.", dicePool: "Manipulation + Occult vs. Resolve + Composure", level: 3, discipline: "oblivion" },
    //4
    { name: "Stygian Shroud", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Darkness spews out of a nearby shadow and covers the area.", dicePool: "Wits + Investigation vs. the Oblivion user’s Resolve + Occult", level: 4, discipline: "oblivion" },
    { name: "Touch of Oblivion", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Allows the user to cripple opponent's with their strikes.", dicePool: "", level: 4, discipline: "oblivion" },
    //5
    { name: "Shadowstep", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "The user can step into one shadow and appear in another within their sight", dicePool: "", level: 5, discipline: "oblivion" },
    { name: "Tenebrous Avatar", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Changes their body into a shadow able to move over any surface or through small spaces.", dicePool: "", level: 5, discipline: "oblivion" },

    //Potence
    //1
    { name: "Prowess", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Add Potence rating to strength checks", dicePool: "", level: 2, discipline: "potence" },
    { name: "Soaring Leap", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Jump over long distance", dicePool: "", level: 1, discipline: "potence" },
    //2
    { name: "Lethal Body", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Cause serious physical damage to a mortals", dicePool: "", level: 1, discipline: "potence" },
    { name: "Uncanny Grip", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Grip and hold onto any surface, including walls and ceilings", dicePool: "", level: 3, discipline: "potence" },
    //3
    { name: "Brutal Feed", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Turn feeding into a violent and messy affair that only lasts seconds to Slake the user's Hunger.", dicePool: "", level: 3, discipline: "potence" },
    { name: "Staggering Strike", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Brawl and Melee attacks inflict the Staggered Condition", dicePool: "", level: 3, discipline: "potence" },
    //4
    { name: "Fist of Caine", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Inflict Aggravated Health damage to mortals and supernatural creatures alike.", dicePool: "", level: 4, discipline: "potence" },
    { name: "Savage Pursuit", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You may chase a fleeing opponent at great speed, ignoring obstacles", dicePool: "", level: 4, discipline: "potence" },
    //5
    { name: "Earth Shock", description: "", rouseChecks: 2, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Create a shockwave to throw opponents prone.", dicePool: "", level: 5, discipline: "potence" },
    { name: "Puissance", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Increase Brawl and Melee damage to two.", dicePool: "", level: 5, discipline: "potence" },

    //Presence
    //1
    { name: "Awe", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Become attractive and charismatic, gaining Gaze and Focus.", dicePool: "", level: 1, discipline: "presence" },
    { name: "Daunt", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Push people away and intimidate, mortals must overcome your presence to attack you.", dicePool: "", level: 1, discipline: "presence" },
    { name: "Eyes of the Serpent", description: "", rouseChecks: 0, amalgamPrerequisites: [{discipline:"protean",level:1}], powerPrerequisite:[], summary: "Immobilize a victim by making eye contact.", dicePool: " Charisma + Persuasion vs. Wits + Composure", level: 1, discipline: "presence" },
    //2
    { name: "Monologue", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "You engage your targets in conversation, preventing them from initiating an attack until you.", dicePool: "", level: 2, discipline: "presence" },
    { name: "Silencing Tongue", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Render opponent speechless with a scathing remark.", dicePool: "Charisma + Leadership vs. Composure + Resolve", level: 2, discipline: "presence" },
    //3
    { name: "Dread Gaze", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Instill fear into a target to make them flee.", dicePool: "Charisma + Intimidation vs. Composure + Resolve", level: 3, discipline: "presence" },
    { name: "Entrancement", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Influence someone into a star-struck or beguiled state of mind where they do their best to keep the user happy.", dicePool: "Manipulation + Leadership vs. Composure + Wits", level: 3, discipline: "presence" },
    //4
    { name: "Summon", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Call target you have met to your location", dicePool: "Manipulation + Leadership vs. Composure + Intelligence", level: 4, discipline: "presence" },
    { name: "Nightmare Mantle", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Disorient nearby enemies, inflicting the Weakened condition.", dicePool: "", level: 4, discipline: "presence" },
    //5
    { name: "Majesty", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Everyone who looks at the user is dumbstruck.", dicePool: "Charisma + Leadership vs. Composure + Resolve", level: 5, discipline: "presence" },
    { name: "Capricious Visage", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:["Dread Gaze","Entrancement"], summary: "Enhance Dread Gaze or Entrancement to affect additional targets.", dicePool: "", level: 5, discipline: "presence" },

    //Protean
    //1
    { name: "Eyes of the Beast", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "your eyes start glowing and you can see in total darkness", dicePool: "", level: 1, discipline: "protean" },
    { name: "Weight of the Feather", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: "become weightless", dicePool: "", level: 1, discipline: "protean" },
    //2
    { name: "Feral Weapons", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "grow deadly claws", dicePool: "", level: 2, discipline: "protean" },
    { name: "Earth Meld", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "meld into the soil", dicePool: "", level: 3, discipline: "protean" },
    { name: "Vicissitude", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "dominate", level: 2 }], powerPrerequisite:[], summary: "reshape your own skin, muscles and bone at will", dicePool: "", level: 2, discipline: "protean" },
    //3
    { name: "Fleshcrafting", description: "", rouseChecks: 1, amalgamPrerequisites: [{ discipline: "dominate", level: 2 }], powerPrerequisite:["Vicissitude"], summary: "Extends the mastery over the flesh to be used on others.", dicePool: "", level: 3, discipline: "protean" },
    { name: "Shapechange", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Turn into a human-sized animal", dicePool: "", level: 3, discipline: "protean" },
    { name: "Unfettered Heart", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:[], summary: " You are immune to Staking", dicePool: "", level: 3, discipline: "protean" },
    //4
    { name: "Metamorphosis", description: "", rouseChecks: 0, amalgamPrerequisites: [], powerPrerequisite:["Shapechange"], summary: "Extends shape change to be able to change into a larger or smaller animals than the vampire's mass", dicePool: "", level: 4, discipline: "protean" },
    { name: "Abrupt Internment", description: "", rouseChecks: 1, amalgamPrerequisites: [{discipline:"auspex",level:1}], powerPrerequisite:[], summary: "You can use the earth to meld other things into the Earth, either to store or simply stop them from moving", dicePool: "Strength + Survival Skill vs. target’s Strength + Athletics Skill", level: 4, discipline: "protean" },
    { name: "Horrid Form", description: "", rouseChecks: 1, amalgamPrerequisites: [], powerPrerequisite:["Vicissitude"], summary: "Take on a monstrous shape.", dicePool: "", level: 4, discipline: "protean" },
    //5
    { name: "Heart of Darkness", description: "", rouseChecks: 2, amalgamPrerequisites: [{discipline:"fortitude",level:2}], powerPrerequisite:[], summary: "Allows a vampire to remove their own heart and store it outside of their body.", dicePool: "", level: 5, discipline: "protean" },
    { name: "Form of Mist", description: "", rouseChecks: 2, amalgamPrerequisites: [], powerPrerequisite:[], summary: "Turn into a cloud of mist.", dicePool: "", level: 5, discipline: "protean" },
    { name: "Shape Mastery", description: "", rouseChecks: 2, amalgamPrerequisites: [{discipline:"presence",level:2}], powerPrerequisite:[], summary: "Force another shapeshifter to return to their natural form.", dicePool: "Strength + Survival vs. Composure + Resolve", level: 5, discipline: "protean" },
] as Power[]

export const powerRefs: PowerRef[] = allPowers.map((power) => ({
    name: power.name,
    creationPoints: 0,
    freebiePoints: 0,
}))

type VariableKeys = "creationPoints" | "freebiePoints" ;

export const handlePowerChange = (
    kindred: Kindred,
    setKindred: Function,
    power: PowerRef,
    type: VariableKeys,
    newPoints: number
): void => {
    const existingPower = kindred.powers.find((p) => p.name === power.name)

    if (existingPower) {
        const updatedPowers = kindred.powers.map((p) =>
            p.name === power.name ? { ...p, [type]: newPoints } : p
        );
        setKindred({...kindred, powers: updatedPowers})
    } else {
        setKindred({
            ...kindred,
            powers: [...kindred.powers, { ...power, [type]: newPoints}]
        })
    }
}

export const removePower = (
    kindred: Kindred,
    setKindred: Function,
    power: PowerRef,
): void => {
    const updatedPowers = kindred.powers.filter((p) => p.name !== power.name);
    setKindred({...kindred, powers: updatedPowers})
}

export const getFilteredPower = (kindred:Kindred): Power[] => {
    const userDisciplines = [] as { discipline: DisciplineKey, level:number }[];

    for (const discipline in kindred.disciplines) {
        if (v5DisciplineLevel(kindred, discipline as DisciplineKey).level !== 0) {
            const level = v5DisciplineLevel(kindred, discipline as DisciplineKey).level;
            userDisciplines.push({discipline: discipline as DisciplineKey, level})
        }
    }


    const filteredPowers = allPowers.filter((power) => {
        const matchingDiscipline = userDisciplines.find((d) => d.discipline === power.discipline);
        if (!matchingDiscipline) { return false; }
        const matchingLevel = matchingDiscipline.level >= power.level
        
        let matchingAmalgam = false;
        if(power.amalgamPrerequisites.length === 0) {
            matchingAmalgam = true;
        } else {
            const {discipline, level} = power.amalgamPrerequisites[0]
            const matchingUserDiscipline = userDisciplines.find(
                (d) => d.discipline === discipline && d.level >= level
            );
            matchingAmalgam = Boolean(matchingUserDiscipline)
        }

        let matchingPowerPreq = false;
        const powers = kindred.powers;
        
        if (power.powerPrerequisite.length === 0) {
            matchingPowerPreq = true;
        } else {
            for (const prereq of power.powerPrerequisite) {
                if (powers.some((p) => p.name === prereq)) {
                    matchingPowerPreq = true;
                    break; // Exit the loop once a match is found
                }
            }
        }

        return matchingAmalgam && matchingLevel && matchingPowerPreq;
    })

    return filteredPowers
}

export const powerIsRitual = (p: Power | Ritual): p is Ritual => {
    return (p as Ritual)["ingredients"] !== undefined
}