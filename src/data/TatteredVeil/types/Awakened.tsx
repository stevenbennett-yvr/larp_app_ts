import {z} from "zod";
import { virtueNameSchema } from "./Virtues";
import { viceNameSchema } from "./Vices";
import { attributesSchema } from "../../nWoD1e/nWoD1eAttributes";
import { skillsSchema } from "../../nWoD1e/nWoD1eSkills";
import { pathNameSchema } from "./Path";
import { orderNameSchema } from "./Order";
import { arcanaSchema } from './Arcanum'; 
import { meritRefSchema } from "./Merits";
import { roteRefSchema } from "./Rotes";
import { gnosisSchema } from "./Gnosis";
import { wisdomSchema } from "./Wisdom";
import { User } from "../../CaM/types/User";

export const backgroundSchema = z.object({
  history: z.string(),
  goals: z.string(),
  description: z.string(),
  showPublic: z.boolean(),
  profilePic: z.string(),
  publicIntro: z.string().max(280),
  publicTitle: z.string()
})

export const awakenedSchema = z.object({
    id: z.optional(z.string()),
    email: z.string(),
    uid: z.string(),
    domain: z.string(),

    name: z.string(),
    concept: z.string(),

    background: backgroundSchema,
    virtue: virtueNameSchema,
    vice: viceNameSchema,

    attributes: attributesSchema,
    skills: skillsSchema,

    path: pathNameSchema,
    order: orderNameSchema,

    arcana: arcanaSchema,
    rotes: roteRefSchema.array(),

    merits: meritRefSchema.array(),

    gnosis: gnosisSchema,
    wisdom: wisdomSchema,

    startDate: z.string().datetime(),
    changeLogs: z.object({
    })
})

export const getEmptyAwakened = (): Awakened => {
  return {
    name: "",
    concept: "",
    email: "",
    uid: "",
    domain: "",

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
      intelligence: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'mental', type: 'power'},
      wits: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'mental', type: 'finesse'},
      resolve: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'mental', type: 'resistance'},
      strength: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'physical', type: 'power'},
      dexterity: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'physical', type: 'finesse'},
      stamina: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'physical', type: 'resistance'},
      presence: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'social', type: 'power'},
      manipulation: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'social', type: 'finesse'},
      composure: {creationPoints: 1, freebiePoints: 0, experiencePoints: 0, category: 'social', type: 'resistance'},
    },

    skills: {

        academics: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},
        computer: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},
        crafts: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},
        investigation: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},
        medicine: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},
        occult: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},
        politics: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},
        science: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'mental'},

        athletics: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},
        brawl: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},
        drive: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},
        firearms: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},
        larceny: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},
        stealth: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},
        survival: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},
        weaponry: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'physical'},

        animal_ken: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'social'},
        empathy: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'social'},
        expression: {creationPoints: 0, freebiePoints: 0, roteSkill: false, experiencePoints: 0, specialities: [], category: 'social'},
        intimidation: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'social'},
        persuasion: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'social'},
        socialize: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'social'},
        streetwise: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'social'},
        subterfuge: {creationPoints: 0, freebiePoints: 0, experiencePoints: 0, roteSkill: false, specialities: [], category: 'social'},

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

    startDate: new Date().toISOString(),
    changeLogs: {},

  }
}

export type Awakened = z.infer<typeof awakenedSchema>

export const fetchAwakenedCharacter = async (characterId:string, currentUser:User, setAwakened:Function, setInitialAwakened:Function, getAwakenedById:Function, navigate:Function) => {
  const localStorageCharacter = localStorage.getItem(`awakened id ${characterId}`);
  if (localStorageCharacter) {
    let awakened = JSON.parse(localStorageCharacter)
    if (awakened.uid === currentUser.uid) {
      setAwakened(JSON.parse(localStorageCharacter));
    } else {
      localStorage.clear()
      navigate('/')
    }
  } else {
    const character = await getAwakenedById(characterId);
    if (character && currentUser && (character.uid === currentUser.uid || currentUser.roles?.some(role => role.title === "vst" && role.venue === 'tattered veil'))) {
      setAwakened(character);
      localStorage.setItem(`awakened id ${characterId}`, JSON.stringify(character));
      setInitialAwakened(character)
    } else {
      localStorage.clear()
      navigate('/')
    }
  }
};

