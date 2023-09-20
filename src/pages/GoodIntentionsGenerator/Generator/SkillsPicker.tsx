import { Button, Divider, Grid, Group, ScrollArea, Space, Text, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { V5Skills, V5SkillsKey, v5EmptySkills, skillsDescriptions, v5skillsKeySchema } from "../../../data/GoodIntentions/types/V5Skills"
import { globals } from "../../../assets/globals"
import { upcase } from "../../../utils/case"
import { SpecialtyModal } from "./SpecialtyModal"


type SkillsPickerProps = {
    character: Kindred,
    setCharacter: (character: Kindred) => void
    nextStep: () => void
}

type SkillsSetting = {
    special: V5SkillsKey[],
    strongest: V5SkillsKey[],
    decent: V5SkillsKey[],
    acceptable: V5SkillsKey[],
}

type DistributionKey = "Jack of All Trades" | "Balanced" | "Specialist"

type SkillDistribution = { strongest: number, decent: number, acceptable: number, special: number }

const distributionDescriptions: Record<DistributionKey, string> = {
    "Jack of All Trades": "Decent at many things, good at none (1/8/10)",
    Balanced: "Best default choice (3/5/7)",
    Specialist: "Uniquely great at one thing, bad at most (1/3/3/3)",
}

const distributionByType: Record<DistributionKey, SkillDistribution> = {
    "Jack of All Trades": {
        special: 0,
        strongest: 1,
        decent: 8,
        acceptable: 10
    },
    Balanced: {
        special: 0,
        strongest: 3,
        decent: 5,
        acceptable: 7
    },
    Specialist: {
        special: 1,
        strongest: 3,
        decent: 3,
        acceptable: 3
    },
}

const getAll = (skillSetting: SkillsSetting): V5SkillsKey[] => {
    return Object.values(skillSetting).reduce((acc, s) => [...acc, ...s], [])
}

const SkillsPicker = ({ character, setCharacter, nextStep }: SkillsPickerProps) => {
    const phoneScreen = globals.isPhoneScreen

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
    const [skills, setSkills] = useState(v5EmptySkills)
    const [pickedSkills, setPickedSkills] = useState<SkillsSetting>({ special: [], strongest: [], decent: [], acceptable: [] })
    const [pickedDistribution, setPickedDistribution] = useState<DistributionKey | null>('Balanced')
    const distr = pickedDistribution ? distributionByType[pickedDistribution] : { special: 0, strongest: 0, decent: 0, acceptable: 0 }

    const createButton = (skill: V5SkillsKey, i: number) => {
        const alreadyPicked = [...pickedSkills.special, ...pickedSkills.strongest, ...pickedSkills.decent, ...pickedSkills.acceptable].includes(skill)

        let onClick: () => void
        if (alreadyPicked) {
            onClick = () => {
                setPickedSkills({
                    special: pickedSkills.special.filter((it) => it !== skill),
                    strongest: pickedSkills.strongest.filter((it) => it !== skill),
                    decent: pickedSkills.decent.filter((it) => it !== skill),
                    acceptable: pickedSkills.acceptable.filter((it) => it !== skill),
                })
            }
        }
        else if (pickedSkills.special.length < distr.special) {
            onClick = () => {
                setPickedSkills({ ...pickedSkills, special: [...pickedSkills.special, skill] })
            }
        }
        else if (pickedSkills.strongest.length < distr.strongest) {
            onClick = () => {
                setPickedSkills({ ...pickedSkills, strongest: [...pickedSkills.strongest, skill] })
            }
        } else if (pickedSkills.decent.length < distr.decent) {
            onClick = () => {
                setPickedSkills({ ...pickedSkills, decent: [...pickedSkills.decent, skill] })
            }
        } else if (pickedSkills.acceptable.length < distr.acceptable - 1) {  // -1 so the very last pick opens modal
            onClick = () => {
                setPickedSkills({ ...pickedSkills, acceptable: [...pickedSkills.acceptable, skill] })
            }
        } else {
            const finalPick = { ...pickedSkills, acceptable: [...pickedSkills.acceptable, skill] }
            onClick = () => {
                const skills: V5Skills = {
                    athletics: { ...character.skills.athletics, creationPoints:0},
                    brawl: { ...character.skills.brawl, creationPoints:0},
                    craft: { ...character.skills.craft, creationPoints:0},
                    drive: { ...character.skills.drive, creationPoints:0},
                    firearms: { ...character.skills.firearms, creationPoints:0},
                    melee: { ...character.skills.melee, creationPoints:0},
                    larceny: { ...character.skills.larceny, creationPoints:0},
                    stealth: { ...character.skills.stealth, creationPoints:0},
                    survival: { ...character.skills.survival, creationPoints:0},

                    "animal ken": { ...character.skills["animal ken"], creationPoints:0},
                    etiquette: { ...character.skills.etiquette, creationPoints:0},
                    insight: { ...character.skills.insight, creationPoints:0},
                    intimidation: { ...character.skills.intimidation, creationPoints:0},
                    leadership: { ...character.skills.leadership, creationPoints:0},
                    performance: { ...character.skills.performance, creationPoints:0},
                    persuasion: { ...character.skills.persuasion, creationPoints:0},
                    streetwise: { ...character.skills.streetwise, creationPoints:0},
                    subterfuge: { ...character.skills.subterfuge, creationPoints:0},

                    academics: { ...character.skills.academics, creationPoints:0},
                    awareness: { ...character.skills.awareness, creationPoints:0},
                    finance: { ...character.skills.finance, creationPoints:0},
                    investigation: { ...character.skills.investigation, creationPoints:0},
                    medicine: { ...character.skills.medicine, creationPoints:0},
                    occult: { ...character.skills.occult, creationPoints:0},
                    politics: { ...character.skills.politics, creationPoints:0},
                    science: { ...character.skills.science, creationPoints:0},
                    technology: { ...character.skills.technology, creationPoints:0},
                }
                finalPick.special.forEach((special) => skills[special].creationPoints = 4)
                finalPick.strongest.forEach((strongest) => skills[strongest].creationPoints = 3)
                finalPick.decent.forEach((decent) => skills[decent].creationPoints = 2)
                finalPick.acceptable.forEach((acceptable) => skills[acceptable].creationPoints = 1)

                setPickedSkills(finalPick)
                setSkills(skills)

                openModal()
            }
        }

        const dots = (() => {
            if (pickedSkills.special.includes(skill)) return "🚀"
            if (pickedSkills.strongest.includes(skill)) return "🥇"
            if (pickedSkills.decent.includes(skill)) return "🥈"
            if (pickedSkills.acceptable.includes(skill)) return "🥉"
            return ""
        })()

        const trackClick = () => {
        }

        return (
            <Grid.Col key={skill} span={4}>
                <Tooltip disabled={alreadyPicked} label={skillsDescriptions[skill]} transitionProps={{ transition: 'slide-up', duration: 200 }} events={globals.tooltipTriggerEvents}>
                    <Button p={phoneScreen ? 0 : "default"} variant={alreadyPicked ? "outline" : "filled"} leftIcon={dots} disabled={pickedDistribution === null} color="grape" fullWidth onClick={() => { trackClick(); onClick() }}>
                        <Text fz={phoneScreen ? 12 : "inherit"}>{upcase(skill)}</Text>
                    </Button>
                </Tooltip>
                {i % 3 === 0 || i % 3 === 1 ? <Divider size="xl" orientation="vertical" /> : null}
            </Grid.Col>
        )
    }

    const toPick = (() => {
        if (pickedSkills.special.length < distr.special) return "special"
        if (pickedSkills.strongest.length < distr.strongest) return "strongest"
        if (pickedSkills.decent.length < distr.decent) return "decent"
        else return "acceptable"
    })()

    const specialStyle = toPick === "special" ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const strongestStyle = toPick === "strongest" ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const decentStyle = toPick === "decent" ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const acceptableStyle = toPick === "acceptable" ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }

    const closeModalAndUndoLastPick = () => {
        setPickedSkills({ ...pickedSkills, acceptable: pickedSkills.acceptable.slice(0, -1) })
        closeModal()
    }

    const createSkillButtons = () => (
        <Group>
            <Grid grow m={0}>
                <Grid.Col span={4}><Text fs="italic" fw={700} ta="center">Physical</Text></Grid.Col>
                <Grid.Col span={4}><Text fs="italic" fw={700} ta="center">Social</Text></Grid.Col>
                <Grid.Col span={4}><Text fs="italic" fw={700} ta="center">Mental</Text></Grid.Col>
                {
                    ["athletics", "animal ken", "academics",
                        "brawl", "etiquette", "awareness",
                        "craft", "insight", "finance",
                        "drive", "intimidation", "investigation",
                        "firearms", "leadership", "medicine",
                        "melee", "performance", "occult",
                        "larceny", "persuasion", "politics",
                        "stealth", "streetwise", "science",
                        "survival", "subterfuge", "technology"
                    ].map((s) => v5skillsKeySchema.parse(s)).map((clan, i) => createButton(clan, i))
                }
            </Grid>
        </Group>
    )
    const height = globals.viewportHeightPx
    const heightBreakPoint = 930

    return (
        <div style={{ marginTop: height < heightBreakPoint ? "40px" : 0 }}>
            {!pickedDistribution
                ? <Text fz={globals.largeFontSize} ta={"center"}>Pick your <b>Skill Distribution</b></Text>
                : <>
                    {pickedDistribution === "Specialist" ? <Text style={specialStyle} fz={"30px"} ta={"center"}>{toPick === "special" ? ">" : ""} Pick your <b>{distr.special - pickedSkills.special.length} specialty</b> skill</Text> : null}
                    <Text style={strongestStyle} ta={"center"}>{toPick === "strongest" ? ">" : ""} Pick your <b>{distr.strongest - pickedSkills.strongest.length} strongest</b> skills</Text>
                    <Text style={decentStyle} ta={"center"}>{toPick === "decent" ? ">" : ""} Pick <b>{distr.decent - pickedSkills.decent.length}</b> skills you&apos;re <b>decent</b> in</Text>
                    <Text style={acceptableStyle} ta={"center"}>{toPick === "acceptable" ? ">" : ""} Pick <b>{distr.acceptable - pickedSkills.acceptable.length}</b> skills you&apos;re <b>ok</b> in</Text>
                </>
            }

            {pickedDistribution !== null
                ? null
                : <>
                    <Space h="xl" />
                    <Grid grow>
                        {(["Jack of All Trades", "Balanced", "Specialist"] as DistributionKey[]).map((distribution) => {
                            return (
                                <Grid.Col span={4} key={distribution}>
                                    <Tooltip disabled={pickedDistribution !== null} label={distributionDescriptions[distribution]} transitionProps={{ transition: 'slide-up', duration: 200 }} events={globals.tooltipTriggerEvents}>
                                        <Button p={phoneScreen ? 0 : "default"} disabled={pickedDistribution !== null} color="red" fullWidth onClick={() => { setPickedDistribution(distribution) }}>
                                            <Text fz={phoneScreen ? 12 : "inherit"}>{distribution}</Text>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                            )
                        })}
                    </Grid>
                    <Space h="xl" />
                    <Space h="xl" />
                </>
            }

            <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Skills</Text>
            <hr color="#e03131" />

            <Space h="sm" />


            {height < heightBreakPoint
                ? <ScrollArea h={height - 340}>
                    {createSkillButtons()}
                </ScrollArea>
                : createSkillButtons()
            }

            <SpecialtyModal modalOpened={modalOpened} closeModal={closeModalAndUndoLastPick} setCharacter={setCharacter} nextStep={nextStep} character={character} pickedSkillNames={getAll(pickedSkills)} skills={skills} />
        </div>
    )
}

export default SkillsPicker