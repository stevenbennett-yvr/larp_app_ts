import { z } from "zod";
import OrderAdamantineArrow from "../resources/order/OrderAdamantineArrow.webp"
import OrderFreeCouncil from '../resources/order/OrderFreeCouncil.webp'
import OrderGuardians from '../resources/order/OrderGuardiansoftheVeil.webp'
import orderMysterium from '../resources/order/OrderMysterium.webp'
import orderSilver from '../resources/order/OrderSilverLadder.webp'
import mageSkull from '../resources/SkullMTAw.webp'
import coverArrow from '../resources/order/Mtawtheadamantinearrow.webp'
import coverFree from '../resources/order/Mtawthefreecouncil.webp'
import coverGuardians from '../resources/order/Mtawguardiansoftheveil.webp'
import coverMyster from '../resources/order/Mtawthemysterium.webp'
import coverSilver from '../resources/order/Mtawthesilverladder.webp'
import coverMage from '../resources/order/Mtawrulebook.webp'

import RuneArrow from '../resources/order/Adamantine_Arrow_glyph.webp'
import RuneFree from '../resources/order/Free_Council_glyph.webp'
import RuneGuard from '../resources/order/Guardians_of_the_Veil_glyph.webp'
import RuneMyst from '../resources/order/RuneOrderMysterium.webp'
import RuneSilver from '../resources/order/RuneOrderSilverLadder.webp'

export const orderNameSchema = z.union([
    z.literal('The Adamantine Arrow'),
    z.literal('The Free Council'),
    z.literal('The Guardians of the Veil'),
    z.literal('The Mysterium'),
    z.literal('The Silver Ladder'),
    z.literal('Apostate'),
    z.literal(''),
])

export type OrderName = z.infer<typeof orderNameSchema>

export const orderSchema = z.object({
    name: orderNameSchema,
    description: z.string(),
    logo: z.string(),
    rune: z.string(),
    roteSpecialities: z.array(z.string()),
    color: z.string(),
    cover: z.string(),
    link: z.string(),
})

export type Order = z.infer<typeof orderSchema>
export const orderKeySchema = orderSchema.keyof()
export type orderKey = z.infer<typeof orderKeySchema>

export const Orders: Record<OrderName, Order> = {
    "The Adamantine Arrow" : {
        name: "The Adamantine Arrow",
        description: `
        <p><strong>The Adamantine Arrow:</strong> Philosopher-Warriors.</p> 
        <p>The Adamantine Arrow is an order of mages who embody the ideals of strength, discipline, and resilience. They combine martial prowess with metaphysical knowledge to protect the Mysteries and uphold justice.</p>
        <p><i>Rote Secialities:</i> Athletics, Intimidation, Medicine</p>          
        `,
        logo: OrderAdamantineArrow,
        rune: RuneArrow,
        roteSpecialities: ["Athletics", "Intimidation", "Medicine"],
        color: "#B0C4DE",
        cover: coverArrow,
        link: 'https://www.drivethrurpg.com/product/51534'
    },
    "The Free Council" : {
        name: "The Free Council",
        description: `
        <p><strong>The Free Council: </strong>Democratic Mages of methods old and new</p>
        <p>The Free Council is a diverse and dynamic order that embraces innovation, democracy, and individualism. They believe in adapting ancient magical traditions to the modern world and strive for personal freedom and social progress.</p>
        <p><i>Rote Secialities:</i> Crafts, Persuasion, Science</p>          </Card.Body>
        `,
        logo: OrderFreeCouncil,
        rune: RuneFree,
        roteSpecialities: ["Crafts", "Persuasion", "Science"],
        color: "#B87333",
        cover: coverFree,
        link: 'https://www.drivethrurpg.com/product/25983'
    },
    "The Guardians of the Veil" : {
        name: "The Guardians of the Veil",
        description: `
        <p><strong>The Guardians of the Veil: </strong>Secret Police, Coverup, Internal Affairs</p>
        <p>The Guardians of the Veil is an enigmatic order that operates in the shadows, protecting the occult world from exposure and maintaining the Veil of secrecy. They are skilled in deception, investigation, and maintaining the delicate balance between the magical and mundane.</p>          
        <p><i>Rote Secialities:</i>Investigation, Stealth, Subterfuge</p>          </Card.Body>
        `,
        logo: OrderGuardians,
        rune: RuneGuard,
        roteSpecialities: ["Investigation", "Stealth", "Subterfuge"],
        color: "#656970",
        cover: coverGuardians,
        link: 'https://www.drivethrurpg.com/product/3549'
    },
    "The Mysterium": {
        name: "The Mysterium",
        description: `
        <p><strong>The Mysterium: </strong>Lore-Seekers, Relic Hunters, Mystery Cult</p>
        <p>The Mysterium is a scholarly order that devotes itself to the study and preservation of magical knowledge and artifacts. They explore ancient mysteries, unravel arcane secrets, and seek to unlock the hidden truths of the world.</p>
        <p><i>Rote Secialities:</i> Investigation, Occult, Survival</p>          </Card.Body>
        `,
        logo: orderMysterium,
        rune: RuneMyst,
        roteSpecialities: ["Investigation", "Occult", "Survival"],
        color: "#C0C0C0",
        cover: coverMyster,
        link: 'https://www.drivethrurpg.com/product/50486'
    },
    "The Silver Ladder": {
        name: "The Silver Ladder",
        description: `
        <p><strong>The Silver Ladder: </strong>Politicians, Power-Brokers, Demogogues</p>
        <p>The Silver Ladder is a political order that seeks to shape the world according to their vision of order and enlightenment. They are skilled in manipulation, rhetoric, and weaving magical influence over the power structures of society.</p>
        <p><i>Rote Secialities:</i> Expression, Persuasion, Subterfuge</p>
        `,
        logo: orderSilver,
        rune: RuneSilver,
        roteSpecialities: ["Expression", "Persuasion", "Subterfuge"],
        color: "#D4AF37",
        cover: coverSilver,
        link: 'https://www.drivethrurpg.com/product/56644'
    },
    Apostate: {
        name: "Apostate",
        description: `
        <p><strong>Apostates</strong> are mages who have declined to join the orders or who else was forgotten under foot. You do not gain any Rote Specialities.</p>
        <p><u>Apostasy is not recommended for beginners.</u> </p>
        `,
        logo: mageSkull,
        rune: mageSkull,
        roteSpecialities: [],
        color: "#757575",
        cover: coverMage,
        link: "https://www.drivethrurpg.com/product/2743/Mage-The-Awakening"
    },
    "": {
        name: "",
        description: "",
        logo: "",
        rune: "",
        roteSpecialities: [],
        color: "",
        cover: "",
        link: ""
    }
}