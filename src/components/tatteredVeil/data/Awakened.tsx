import {z} from "zod";
import { virtueNameSchema } from "./Virtues";
import { viceNameSchema } from "./Vices";
import { attributesSchema } from './Attributes'
import { skillsSchema } from "./Skills";
import { pathNameSchema } from "./Path";
import { orderNameSchema } from "./Order";
import { arcanaSchema } from './Arcanum'; 
import { meritSchema } from "./Merits";
import { roteSchema } from "./Rotes";
import { gnosisSchema } from "./Gnosis";
import { wisdomSchema } from "./Wisdom";

const backgroundSchema = z.object({
  history: z.string(),
  goals: z.string(),
  description: z.string(),
  showPublic: z.boolean(),
  profilePic: z.string(),
  publicIntro: z.string().max(280),
  publicTitle: z.string()
})

export const awakenedSchema = z.object({
    name: z.string(),
    concept: z.string(),
    uid: z.string(),
    background: backgroundSchema,
    virtue: virtueNameSchema,
    vice: viceNameSchema,

    attributes: attributesSchema,
    skills: skillsSchema,

    path: pathNameSchema,
    order: orderNameSchema,

    arcana: arcanaSchema,
    rotes: roteSchema.array(),

    merits: meritSchema.array(),

    gnosis: gnosisSchema,
    wisdom: wisdomSchema,

    startDate: z.date(),
    changeLogs: z.object({
    })
})

export const getEmptyAwakened = (): Awakened => {
  return {
    name: "",
    concept: "",
    uid: "",

    background: {
      history: "",
      goals: "",
      description: "",
      profilePic: "https://firebasestorage.googleapis.com/v0/b/larp-app-5a526.appspot.com/o/mage%2FcenteredSkullMTAw.png?alt=media&token=e4d6fccf-42ea-4f1a-9573-13a8b197d059",
      publicIntro: "",
      publicTitle: "",
      showPublic: false,
    },

    virtue: "",
    vice: "",
    path: "",
    order: "",

    attributes: {
      mental: {
        intelligence: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
        wits: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
        resolve: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
      },
      physical: {
        strength: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
        dexterity: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
        stamina: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
      },
      social: {
        presence: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
        manipulation: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
        composure: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0},
      },
    },

    skills: {
      mental: {
        academics: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        computer: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        crafts: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        investigation: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        medicine: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        occult: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        politics: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        science: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
      },
      physical: {
        athletics: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        brawl: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        drive: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        firearms: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        larceny: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        stealth: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        survival: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        weaponry: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
      },
      social: {
        animal_ken: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        empathy: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        expression: {creationPoints: 0, freebiePoints: 0, roteSkill: false, experiencePoints: 0, specialities: []},
        intimidation: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        persuasion: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        socialize: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        streetwise: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
        subterfuge: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: []},
      }
    },

    arcana: {
      death: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      fate: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      forces: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      life: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      matter: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      mind: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      prime: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      space: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      spirit: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
      time: {type: "Common", creationPoints: 0, freebiePoints: 0, experiencePoints: 0},
    },

    rotes: [],

    merits: [],

    gnosis: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0},

    wisdom: {creationPoints: 7, freebiePoints: 0, experiencePoints: 0},

    startDate: new Date(Date.now()),
    changeLogs: {},

  }
}

export type Awakened = z.infer<typeof awakenedSchema>
