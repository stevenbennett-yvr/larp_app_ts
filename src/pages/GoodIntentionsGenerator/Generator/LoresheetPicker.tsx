import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Title, Group, ScrollArea, Grid, Card, Text, Button, Stack, Select, Modal } from "@mantine/core"
import { Loresheet, loresheetFilter } from "../../../data/GoodIntentions/types/V5Loresheets"
import { useState } from "react"
import { V5SkillsKey } from "../../../data/GoodIntentions/types/V5Skills"
import { V5BackgroundRef } from "../../../data/GoodIntentions/types/V5Backgrounds"

type LoresheetPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}

export const LoresheetsPicker = ({ kindred, setKindred }: LoresheetPickerProps) => {
    let loresheets = loresheetFilter(kindred)

    const [openLoresheetTitle, setOpenLoresheetTitle] = useState(kindred.loresheet.name)
    const openLoresheet = loresheets.find((sheet: Loresheet) => sheet.name === openLoresheetTitle)


    const getLoresheetCol = (loresheet: Loresheet) => {

        return (
            <Grid.Col>
                <Card
                    mb={20}
                    h={350}
                    style={{ backgroundColor: "rgba(26, 27, 30, 0.90)", borderColor: "black" }}
                    withBorder
                >
                    <Text mb={10} ta={"center"} fz={globals.isSmallScreen ? "lg" : "xl"} weight={500}>
                        {loresheet.name}
                    </Text>
                    <Text fz={"sm"}>{loresheet.description}</Text>
                    <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                        <Button disabled={kindred.loresheet.name !== "" && kindred.loresheet.name !== loresheet.name ? true : false} variant="light" color="blue" fullWidth radius="md" onClick={() => setOpenLoresheetTitle(loresheet.name)}>
                            Open
                        </Button>
                    </div>
                </Card>
            </Grid.Col>
        )

    }

    const height = globals.viewportHeightPx
    return (
        <ScrollArea h={height - 330} w={"100%"} p={20}>
            <Grid w={"100%"}>
                {openLoresheet ? (
                    <OpenedLoresheet
                        ls={openLoresheet}
                        setOpenLoresheetTitle={setOpenLoresheetTitle}
                        kindred={kindred}
                        setKindred={setKindred}
                    />
                ) : (
                    loresheets.map(getLoresheetCol)
                )}
            </Grid>
        </ScrollArea>
    )
}

const OpenedLoresheet = ({
    ls,
    setOpenLoresheetTitle,
    kindred,
    setKindred,
}: {
    ls: Loresheet,
    setOpenLoresheetTitle: (t: string) => void,
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}) => {
    const [skillModalOpened, setModalOpen] = useState(false);
    const closeSkillModal = () => {
        setModalOpen(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Text ta={"center"} fz={globals.largeFontSize}>
                {ls.name}
            </Text>
            <Stack>
                {ls.benefits.map((benefit) => {
                    let updatedSkills = JSON.parse(JSON.stringify(kindred.skills));
                    let filteredSkills = JSON.parse(JSON.stringify(kindred.skills));
                    for (const skillName in filteredSkills) {
                        let skill = skillName as V5SkillsKey;
                        filteredSkills[skill].freebiePoints = 0;
                    }

                    if (benefit.skillBonus.length > 0 || benefit.selectableSkills.length > 0) {
                        benefit.skillBonus.forEach((bonus) => {
                            let skill = bonus.skill;
                            updatedSkills[skill].freebiePoints = 2;
                        });
                    }
                    let updatedBackgrounds = JSON.parse(JSON.stringify(kindred.backgrounds));
                    let filteredBackgrounds = JSON.parse(JSON.stringify(kindred.backgrounds));
                    if (benefit.backgrounds.length > 0) {
                        benefit.backgrounds.forEach((bg) => {
                            updatedBackgrounds = [...updatedBackgrounds, bg]
                            filteredBackgrounds = filteredBackgrounds.filter((background: any) => background.id !== bg.id)
                        })
                    }
                    let updatedMerits = JSON.parse(JSON.stringify(kindred.meritsFlaws));
                    let filteredMerits = JSON.parse(JSON.stringify(kindred.meritsFlaws));
                    if (benefit.meritsAndFlaws.length > 0) {
                        benefit.meritsAndFlaws.forEach((m) => {
                            updatedMerits = [...updatedMerits, m]
                            filteredMerits = filteredMerits.filter((merit: any) => merit.id !== m.id)
                        })
                    }

                    let skillSelectData: V5SkillsKey[] = []
                    if (benefit.selectableSkills.length > 0) {
                        benefit.selectableSkills.forEach((s) => {
                            skillSelectData = [...skillSelectData, s.skill]
                        })
                    }

                    return (
                        <Card style={{ minHeight: "200px" }}>
                            <Text fz={"sm"}>{benefit.name}: {benefit.description}</Text>
                            {kindred.loresheet.benefits.find((b) => b.name === benefit.name) ?
                                <>
                                    <Button
                                        onClick={() => {
                                            const filteredBenefits = kindred.loresheet.benefits.filter(
                                                (b) => b.name !== benefit.name
                                            );
                                            if (filteredBenefits.length === 0) {
                                                setKindred({
                                                    ...kindred,
                                                    loresheet: {
                                                        name: "",
                                                        benefits: [],
                                                    },
                                                    skills: filteredSkills,
                                                    backgrounds: filteredBackgrounds,
                                                    meritsFlaws: filteredMerits,
                                                });
                                            } else {
                                                setKindred({
                                                    ...kindred,
                                                    loresheet: {
                                                        ...kindred.loresheet,
                                                        name: ls.name,
                                                        benefits: filteredBenefits,
                                                    },
                                                    skills: filteredSkills,
                                                    backgrounds: filteredBackgrounds,
                                                    meritsFlaws: filteredMerits,
                                                });
                                            }
                                        }}
                                    >
                                        Deselect
                                    </Button>
                                </>
                                :
                                <>
                                    {skillSelectData.length > 0 ?
                                        <SkillSelectModal kindred={kindred} setKindred={setKindred} skillSelectData={skillSelectData} skillModalOpened={skillModalOpened} closeSkillModal={closeSkillModal} loresheet={ls} benefit={benefit} />
                                        :
                                        <></>}
                                    <Button
                                        onClick={() => {
                                            if (skillSelectData.length > 0) {
                                                setModalOpen(true)
                                            } else {
                                                setKindred({
                                                    ...kindred,
                                                    loresheet: {
                                                        ...kindred.loresheet,
                                                        name: ls.name,
                                                        benefits: [...kindred.loresheet.benefits, {
                                                            name: benefit.name, creationPoints: benefit.level, freebiePoints: 0, experiencePoints: 0
                                                        }],
                                                    },
                                                    skills: updatedSkills,
                                                    backgrounds: updatedBackgrounds,
                                                    meritsFlaws: updatedMerits,
                                                });
                                            }
                                        }}
                                    >Buy (cost:{benefit.level})</Button>
                                </>
                            }
                        </Card>
                    )
                })}
            </Stack>

            <Button variant="outline" color="yellow" mt={35} onClick={() => setOpenLoresheetTitle("")}>
                Back
            </Button>
        </div>
    )
}

type SkillSelectModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    skillSelectData: V5SkillsKey[],
    skillModalOpened: boolean,
    closeSkillModal: () => void,
    loresheet: any,
    benefit: any,
}

const SkillSelectModal = ({
    kindred,
    setKindred,
    skillSelectData,
    skillModalOpened,
    closeSkillModal,
    loresheet,
    benefit
}: SkillSelectModalProps) => {
    const [pickedSkill, setPickedSkill] = useState<V5SkillsKey>("performance")

    return (
        <Modal
            opened={skillModalOpened}
            onClose={closeSkillModal}
            size={600}
            h={400}
        >
            <Stack>
                <Select
                    defaultValue=""
                    data={skillSelectData}
                    value={pickedSkill}
                    dropdownPosition="bottom"
                    style={{ paddingBottom: "100px" }}
                    onChange={(val) => {
                        let skill = val as V5SkillsKey
                        setPickedSkill(skill);
                    }}
                />
                <Button
                    onClick={() => {
                        setKindred({
                            ...kindred,

                            skills: {
                                ...kindred.skills,
                                [pickedSkill]: {
                                    ...kindred.skills[pickedSkill],
                                    freebiePoints: 5
                                }
                            },
                            loresheet: {
                                ...kindred.loresheet,
                                name: loresheet.name,
                                benefits: [...kindred.loresheet.benefits, {
                                    name: benefit.name, creationPoints: benefit.level, freebiePoints: 0, experiencePoints: 0
                                }],
                            },
                        }
                        )
                    }}
                >Confirm</Button>
            </Stack>
        </Modal>
    )
}

type BackgroundSelectModalProps = {
    backgroundModalOpened: boolean,
    backgroundCloseModal: () => void,
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    benefit: any
}

const BackgroundSelectModal = ({
    backgroundModalOpened,
    backgroundCloseModal,
    kindred,
    setKindred,
    benefit,
}: BackgroundSelectModalProps) => {

    let pass = true

    const options = benefit.selectableBackgrounds.options
    const totalPoints = benefit.selectableBackgrounds.totalPoints
    let spentPoints = 0
    options.forEach((option: V5BackgroundRef) => {
        spentPoints += option.freebiePoints;
    })
    return (
        <Modal
            opened={backgroundModalOpened}
            onClose={backgroundCloseModal}
            size={600}
        >
            <Stack>
                <Group position="apart">
                    <Text maw={"80%"} fz={"xl"}>
                        {`Pick ${totalPoints} from: `}
                    </Text>
                    <Text>
                        Remaining: <Title ta={"center"} c={"red"}>{`${totalPoints - spentPoints}`}</Title>
                    </Text>
                </Group>
                {options.map((option:V5BackgroundRef) => {
                    if (totalPoints - spentPoints === 0) { pass = true} else { pass = false }
                    
                })}
            </Stack>
        </Modal>
    )
}

export default LoresheetsPicker