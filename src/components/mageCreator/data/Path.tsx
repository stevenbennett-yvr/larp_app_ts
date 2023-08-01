import { z } from "zod";
import { arcanaKeySchema } from "./Arcanum";
//Path Icons
import PathArcanthus from '../resources/path/PathAcanthus.webp'
import PathMastigos from '../resources/path/PathMastigos.webp'
import PathMoros from '../resources/path/PathMoros.webp'
import PathObrimos from '../resources/path/PathObrimos.webp'
import PathThyrsus from '../resources/path/PathThyrsus.webp'
//Path Rune
import RuneArcanthus from '../resources/path/PathAcanthusRune.webp'
import RuneMastigos from '../resources/path/PathMastigosRune.webp'
import RuneMoros from '../resources/path/PathMorosRune.webp'
import RuneObrimos from '../resources/path/PathMorosRune.webp'
import RuneThyrsus from '../resources/path/PathThyrsusRune.webp'
//Path Tarot
import Fool from '../resources/path/RWS_Tarot_00_Fool.jpg'
import Devil from '../resources/path/RWS_Tarot_15_Devil.jpg'
import Death from '../resources/path/RWS_Tarot_13_Death.jpg'
import Strength from '../resources/path/RWS_Tarot_08_Strength.jpg'
import Moon from '../resources/path/RWS_Tarot_18_Moon.jpg'

export const pathNameSchema = z.union([
    z.literal('Acanthus'),
    z.literal('Moros'),
    z.literal('Thyrsus'),
    z.literal('Mastigos'),
    z.literal('Obrimos'),
    z.literal(''),
])
export type PathName = z.infer<typeof pathNameSchema>

export const pathSchema = z.object({
  name: pathNameSchema,
  description: z.string(),
  rulingArcana: z.array(arcanaKeySchema),
  inferiorArcana: arcanaKeySchema,
  resistanceAttribute: z.enum(["Composure", "Resolve", ""]),
  logo: z.string(),
  rune: z.string(),
  tarot: z.string(),
  color: z.string(),
});

export type Path = z.infer<typeof pathSchema>
export const pathKeySchema = pathSchema.keyof()
export type PathKey = z.infer<typeof pathKeySchema>

export const Paths: Record<PathName, Path> = {
    Acanthus: {
        name: "Acanthus",
        description: `
        <p>An Acanthus mage walks the Path of Thistle that winds through the realm of Arcadia to the Watchtower of the Lunargent Thorn. In Arcadia, everything is enchanted and wears a magical glamour of intense beauty or ugliness. Arcadia is where destinies are forged and time warps at the will of the powerful.</p>
        <p>The Ruling Arcana for Arcadia are <u>Fate</u> and <u>Time</u>. Fairy stories from around the world reflect the timelessness of the realm as people who enter places under its influence and spend an evening often emerge many years later since that is how time is measured in the Fallen World. Likewise, a promise or oath is binding, and none can betray it without terrible consequences. The Inferior Arcana for Arcadia is <u>Forces</u>.</p>
        <p>Your favored Resistance Attribute is <u>Composure.</u> </p>
        `,
        rulingArcana: [
            "fate",
            "time"
        ],
        inferiorArcana: "forces",
        resistanceAttribute: "Composure",
        logo: PathArcanthus,
        rune: RuneArcanthus,
        tarot: Fool,
        color: "#5ECFBB"
    },
    Mastigos: {
        name: "Mastigos",
        description: `
        <p>A Mastigos mage walks the Path of Scourging through the nightmarish labyrinth of the realm of Pandemonium, at the center of which is the Watchtower of the Iron Gauntlet. Pandemonium is also called the Realm of Nightmares, for its echoes appear to Sleepers most often in their most terrible and dreaded dreams, where Sleepers fall from endless heights never to hit the ground or run for what seems like hours but never make any progress. Their worst fears or repressed emotions are brought forth in places touched by Pandemonium to be examined and judged by strangers who mock and condemn them. Through such a gauntlet of humiliation and submission, a soul is scourged of its sins and is thus purified to reunite, cleansed and free, with the divine.</p>
        <p>The Ruling Arcana of Pandemonium are <u>Mind</u> and <u>Space</u>. The darkest corners of the unconscious mind are readily apparent here and worn like badges while all roads twist in upon themselves and leading a traveler to confrontations with his own failings. While Mastigos Warlocks are often considered diabolists and demon-summoners (those who make deals with the Devil), Mastigos are more properly the masters of such infernal urges, and those who by strength of will command that within them which is most unsavory. While all humans sin, the Mastigos learn from the follies of the material world and use them to attain higher power. The Inferior Arcanum for Pandemonium is <u>Matter</u>.</p>
        <p>Your favored Resistance Attribute is <u>Resolve.</u> </p>
        `,
        rulingArcana: [
            "space", "mind"
        ],
        inferiorArcana: "matter",
        resistanceAttribute: "Resolve",
        logo: PathMastigos,
        rune: RuneMastigos,
        tarot: Devil,
        color: "#DD2C00"
    },
    Moros: {
        name: "Moros",
        description: `
        <p>A Moros mage walks the Path of Doom, treading the barren wastes and black rivers of the realm of Stygia to attain the Watchtower of the Lead Coin. There is a price to be paid for entering places influenced by Stygia since there are many tollgates on the road, and the soul must travel through death to attain new life. This price isn’t in mundane lucre but in the treasure reaped by the soul during life. If the soul’s weight is light, like that of precious metals, the soul can rise above its death. But if the soul is heavy, like lead, the soul must remain in the abode of shades until the soul can relinquish its hold on life.</p>
        <p>The Ruling Arcana of Stygia are <u>Death</u> and <u>Matter,</u> for it is the place of shells, whether it’s the hollow shells of egos worn in life or the heavy shells of material greed. Whatever is heaviest falls to the influence of this realm, such as ghosts that are anchored to the world they have already left, material treasures that distract the soul from its true work and even metaphorical darkness, which weighs down the light. The Inferior Arcanum for Stygia is <u>Spirit.</u></p>
        <p>Your favored Resistance Attribute is <u>Composure.</u> </p>
        `,
        rulingArcana: [
            "matter", "death"
        ],
        inferiorArcana: "spirit",
        resistanceAttribute: "Composure",
        logo: PathMoros,
        rune: RuneMoros,
        tarot: Death,
        color: "#7f7d99"
    },
    Obrimos: {
        name: "Obrimos",
        description: `
        <p>An Obrimos mage walks the Path of the Mighty while gliding on celestial winds through the realm of the Aether and the firmament of the stars to reach the Watchtower of the Golden Key. Only the elect can enter here since it is guarded by the Hosts with their swords of fire. Lightning strikes any who fly with false wings as Icarus was downed by his hubris. Those who would wield the Supernal flame must not flinch in the face of adversity but cleave to one of the many visions of the divine.</p>
        <p>The Ruling Arcana of the Aether are <u>Forces</u> and <u>Prime.</u> The very realm bristles with energy — sometimes too much energy that threatens to burn those not shielded by divine purpose. The raw power of the prima material, the fire of Creation that fuels magic, is born here and meted out to the Tapestry by Providence. Other mages often fear Obrimos Theurgists for their temperaments as much as for their judgmental attitudes. Nonetheless, all admire their strength and call upon them first when the need is dire. The Inferior Arcanum for the Aether is <u>Death.</u></p>
        <p>Your favored Resistance Attribute is <u>Resolve.</u> </p>
        `,
        rulingArcana: [
            "forces", "prime"
        ],
        inferiorArcana: "death",
        resistanceAttribute: "Resolve",
        logo: PathObrimos,
        rune: RuneObrimos,
        tarot: Strength,
        color: "#f5f940"
    },
    Thyrsus: {
        name: "Thyrsus",
        description: `
        <p>A Thyrsus mage walks the Path of Ecstasy while forging his own trail through the realm of the Primal Wild to discover the Watchtower of the Stone Book. Most of the hallmarks of civilization are not yet dreamt in this realm, where the world into which mortals were first born thrives in all its grandeur and horror. This place speaks to the primordial in all beings by causing them to lose themselves to ecstasies of the flesh or spirit and exalting in being alive. Some claim that all wine is blessed with the taste of the Primal Wild and that those who get madly drunk dance in its humid embrace.</p>
        <p>The Ruling Arcana of the Primal Wild are <u>Life</u> and <u>Spirit.</u> The pounding drums of the heart and lungs, the surging blood in every vein, the tingling nerves and salty sweat are things that are an alphabet of desire written in this realm. Not just flesh, but ephemera, too, is included as the instincts of beast and spirit alike are wrought in the Primal Wild’s jungles. The Inferior Arcanum for the Primal Wild is <u>Mind.</u></p>
        <p>Your favored Resistance Attribute is <u>Composure.</u> </p>
        `,
        rulingArcana: [
            "life", "spirit"
        ],
        inferiorArcana: "mind",
        resistanceAttribute: "Composure",
        logo: PathThyrsus,
        rune: RuneThyrsus,
        tarot: Moon,
        color: "#fd7615"
    },
    "": {
        name: "",
        description: ``,
        rulingArcana: [],
        inferiorArcana: "prime",
        resistanceAttribute: "",
        logo: "",
        rune:"",
        tarot: '',
        color: "",
    }
}