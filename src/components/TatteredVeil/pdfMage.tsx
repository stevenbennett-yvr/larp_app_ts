import { PDFBool, PDFDocument, PDFName } from 'pdf-lib';
import base64Pdf from '../../assets/pdf/tatteredVeil/Awakening2-Page.base64'
import { Awakened } from '../../data/TatteredVeil/types/Awakened';
import { attributesKeySchema, nWoD1eCurrentAttributeLevel } from '../../data/nWoD1e/nWoD1eAttributes';
import { nWoD1eCurrentSkillLevel, skillsKeySchema } from '../../data/nWoD1e/nWoD1eSkills';
import { arcanaKeySchema, currentArcanumLevel } from '../../data/TatteredVeil/types/Arcanum';
import { currentMeritLevel } from '../../data/TatteredVeil/types/Merits';
import { Gnoses, currentGnosisLevel } from '../../data/TatteredVeil/types/Gnosis';
import { currentWisdomLevel } from '../../data/TatteredVeil/types/Wisdom';
import { calculatePool, getRoteByName } from '../../data/TatteredVeil/types/Rotes';
import { notifications } from '@mantine/notifications';

const loadTemplate = async (pdf = base64Pdf) => {
    return fetch(pdf)
        .then(r => r.text())
}
export const testTemplate = async (basePdf: string) => {
    let form
    try {
        const bytes = base64ToArrayBuffer(basePdf);
        const pdfDoc = await PDFDocument.load(bytes);
        form = pdfDoc.getForm();
        console.log(form)
    } catch (err) {
        return { success: false, error: new Error("Can't get form from pdf - is it a fillable pdf?") }
    }
}

function base64ToArrayBuffer(base64: string) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export const downloadPdf = (fileName: string, bytes: Uint8Array) => {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

export const createPdf = async (awakened: Awakened) => {
    const basePdf = await loadTemplate(base64Pdf)
    const bytes = base64ToArrayBuffer(basePdf)

    const pdfDoc = await PDFDocument.load(bytes)
    const form = pdfDoc.getForm()

    // Top fields
    form.getTextField("name").setText(awakened.name)
    form.getTextField("player").setText(awakened.email)
    form.getTextField("chronicle").setText("Tattered Veil")
    form.getDropdown("Virtue").select(awakened.virtue)
    form.getDropdown("Vice").select(awakened.vice)
    form.getTextField("concept").setText(awakened.concept)
    form.getDropdown("path").select(awakened.path)
    form.getDropdown("order").select(awakened.order)

    // Attributes
    const attributeNumbers = {
        'intelligence': 0,
        'wits': 8,
        'resolve': 16,
        'strength': 24,
        'dexterity': 32,
        'stamina': 40,
        'presence': 48,
        'manipulation': 56,
        'composure': 64
    };

    (['intelligence',
        'wits',
        'resolve',
        'strength',
        'dexterity',
        'stamina',
        'presence',
        'manipulation',
        'composure'].map((a) => attributesKeySchema.parse(a))).forEach((attr) => {
            const lvl = nWoD1eCurrentAttributeLevel(awakened, attr).level;
            const attrNumber = attributeNumbers[attr];
            for (let i = 1; i <= lvl; i++) {
                form.getCheckBox(`dot${attrNumber + i}`).check();
            }
        });

    // Skills

    let j = 1

    const skillNumbers = {
        "athletics": 136,
        "brawl": 144,
        "drive": 152,
        "firearms": 160,
        "weaponry": 168,
        "larceny": 176,
        "stealth": 184,
        "survival": 192,

        "animal_ken": 200,
        "socialize": 208,
        "empathy": 216,
        "intimidation": 224,
        "expression": 232,
        "persuasion": 240,
        "streetwise": 248,
        "subterfuge": 256,

        "academics": 72,
        "computer": 80,
        "crafts": 88,
        "investigation": 96,
        "medicine": 104,
        "occult": 112,
        "politics": 120,
        "science": 128,
    };


    (["academics",
        "computer",
        "crafts",
        "investigation",
        "medicine",
        "occult",
        "politics",
        "science",

        "athletics",
        "brawl",
        "drive",
        "firearms",
        "weaponry",
        "larceny",
        "stealth",
        "survival",

        "animal_ken",
        "socialize",
        "empathy",
        "intimidation",
        "expression",
        "persuasion",
        "streetwise",
        "subterfuge",

    ].map((a) => skillsKeySchema.parse(a))).forEach((attr) => {
        const lvl = nWoD1eCurrentSkillLevel(awakened, attr).level;
        const number = skillNumbers[attr];
        for (let i = 1; i <= lvl; i++) {
            form.getCheckBox(`dot${number + i}`).check();
        }
        if (awakened.skills[attr].roteSkill) {
            form.getCheckBox(`rotecheck${j}`).check()
        }
        j += 1
    });

    let a = 1
    // Arcana
    const arcanaLocals = {
        "death": 264,
        "fate": 272,
        "forces": 280,
        "life": 288,
        "matter": 296,
        "mind": 304,
        "prime": 312,
        "space": 328,
        "spirit": 320,
        "time": 336,
    };

    (["death", "fate", "forces", "life", "matter", "mind", "prime", "spirit", "space", "time"].map((a) => arcanaKeySchema.parse(a))).forEach((attr) => {
        const lvl = currentArcanumLevel(awakened, attr).level;
        const attrNumber = arcanaLocals[attr];
        for (let i = 1; i <= lvl; i++) {
            form.getCheckBox(`dot${attrNumber + i}`).check();
        }
        if (awakened.arcana[attr].type === 'Ruling' || awakened.arcana[attr].type === 'Inferior') {
            form.getTextField(`arcana${a}`).setText(awakened.arcana[attr].type)
        }
        a += 1
    });

    // Merit

    const merits = awakened.merits
    let md = 344
    merits.map((m, index) => {
        const lvl = currentMeritLevel(m).level;
        form.getDropdown(`merits${1 + index}`).select(m.name)
        console.log(md)
        for (let i = 1; i <= lvl; i++) {
            form.getCheckBox(`dot${md + i}`).check()
        }
        md += 8
    })

    // Health
    const health = (awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5) + nWoD1eCurrentAttributeLevel(awakened, 'stamina').level
    for (let i = 1; i <= health; i++) {
        form.getCheckBox(`hdot${i}`).check()
    }

    // Willpower
    const willpower = nWoD1eCurrentAttributeLevel(awakened, 'resolve').level + nWoD1eCurrentAttributeLevel(awakened, 'composure').level
    for (let i = 1; i <= willpower; i++) {
        form.getCheckBox(`willdot${i}`).check()
    }

    // Mana
    const mana = Gnoses[currentGnosisLevel(awakened).level].mana
    form.getTextField('ppt1').setText(mana)

    // Gnosis
    const gnosis = currentGnosisLevel(awakened).level
    for (let i = 1; i <= gnosis; i++) {
        form.getCheckBox(`bpdot${i}`).check()
    }

    // Wisdom
    const wisdom = currentWisdomLevel(awakened).level;
    for (let i = 1; i <= wisdom; i++) {
        form.getCheckBox(`humandot${11 - i}`).check();
    }

    //Size
    const size = awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5
    form.getTextField('size').setText(`${size}`)

    //Speed
    const dexterityLevel = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level;
    const strengthLevel = nWoD1eCurrentAttributeLevel(awakened, 'strength').level;
    const fleetOfFootMerit = awakened.merits.find(merit => merit.name === 'Fleet of Foot');
    const fleetOfFootLevel = fleetOfFootMerit ? currentMeritLevel(fleetOfFootMerit).level : 0;
    const calculatedSpeed = dexterityLevel + strengthLevel + 5 + fleetOfFootLevel;
    form.getTextField('speed').setText(`${calculatedSpeed}`)

    //Defense
    const calculateDefense = Math.min(nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level, nWoD1eCurrentAttributeLevel(awakened, 'wits').level)
    form.getTextField('defense').setText(`${calculateDefense}`)

    //Init Mod
    const fastReflexMerit = awakened.merits.find(merit => merit.name === 'Fast Reflexes');
    const fastReflexLevel = fastReflexMerit ? currentMeritLevel(fastReflexMerit).level : 0;
    const calculateInit = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level + nWoD1eCurrentAttributeLevel(awakened, 'composure').level + fastReflexLevel
    form.getTextField('IM').setText(`${calculateInit}`)

    //Rotes
    const rotes = awakened.rotes
    rotes.map((r, index) => {
        const roteData = getRoteByName(r.name)
        form.getDropdown(`rotearcana${1 + index}`).select(roteData.arcanum)
        form.getTextField(`rotelevel${1 + index}`).setText(`${roteData.level}`)
        form.getDropdown(`rotenames${1 + index}`).select(`${roteData.name}`)
        form.getTextField(`rotesdp${1 + index}`).setText(`${calculatePool(roteData.rotePool, awakened)}`)
        form.getTextField(`rotespage${1 + index}`).setText(`${roteData.source}`)
    })


    form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.True)
    return await pdfDoc.save()
}



export const downloadCharacterSheet = async (awakened: Awakened) => {
    const pdfBytes = await createPdf(awakened)
    notifications.show({
        title: "PDF base produced by MrGone!",
        message: "https://mrgone.rocksolidshells.com/",
        autoClose: 10000,
        color: "grape",
    })

    downloadPdf(`tatteredVeil_${awakened.name}.pdf`, pdfBytes)
}
