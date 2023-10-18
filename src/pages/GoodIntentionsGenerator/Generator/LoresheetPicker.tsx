import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Table, Title, Group, ScrollArea, Grid, Card, Text, Button, Stack, Select, Modal, Tooltip, NumberInput, Accordion, Center } from "@mantine/core"
import { Loresheet, loresheetFilter } from "../../../data/GoodIntentions/types/V5Loresheets"
import { useState } from "react"
import { V5SkillsKey } from "../../../data/GoodIntentions/types/V5Skills"
import { SphereSelectData, V5BackgroundRef, backgroundData, advantageStep, v5BackgroundLevel, V5AdvantageRef, emptyAdvantage } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import getRating from "../../../utils/getRating"

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

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

    const [backgroundModalOpened, setBackgroundModalOpen] = useState(false);
    const backgroundCloseModal = () => {
        setBackgroundModalOpen(false);
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
                    if (benefit.selectableBackgrounds.options.length > 0) {
                        benefit.selectableBackgrounds.options.forEach((bg) => {
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
                                    {benefit.selectableBackgrounds.options.length > 0 ?
                                        <BackgroundSelectModal backgroundModalOpened={backgroundModalOpened} backgroundCloseModal={backgroundCloseModal} loresheet={ls} benefit={benefit} kindred={kindred} setKindred={setKindred} />
                                        : <></>}
                                    {skillSelectData.length > 0 ?
                                        <SkillSelectModal kindred={kindred} setKindred={setKindred} skillSelectData={skillSelectData} skillModalOpened={skillModalOpened} closeSkillModal={closeSkillModal} loresheet={ls} benefit={benefit} />
                                        :
                                        <></>}
                                    <Button
                                        onClick={() => {
                                            if (skillSelectData.length > 0) {
                                                setModalOpen(true);
                                            } else if (benefit.selectableBackgrounds.options.length > 0) {
                                                setBackgroundModalOpen(true);
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
                                    >
                                        Buy (cost:{benefit.level})
                                    </Button>
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
                        closeSkillModal()
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
    loresheet: Loresheet,
    benefit: any
}

const BackgroundSelectModal = ({
    backgroundModalOpened,
    backgroundCloseModal,
    loresheet,
    benefit,
    kindred,
    setKindred,
}: BackgroundSelectModalProps) => {

    let pass = true
    const [benefitData, setBenefitData] = useState(JSON.parse(JSON.stringify(benefit)));

    const options = benefitData.selectableBackgrounds.options
    const totalPoints = benefitData.selectableBackgrounds.totalPoints

    let spentPoints = 0
    options.forEach((option: V5BackgroundRef) => {
        spentPoints += option.freebiePoints;
        option.advantages.forEach((advantage) => {
            spentPoints += advantage.freebiePoints
        })
    })
    const height = globals.viewportHeightPx
    return (
        <Modal
            opened={backgroundModalOpened}
            onClose={backgroundCloseModal}
            size={700}
        >
            <ScrollArea h={height - 330} w={"100%"} p={20}>
                <Stack>
                    <Group position="apart">
                        <Text maw={"80%"} fz={"xl"}>
                            {`Pick ${totalPoints} from: `}
                        </Text>
                        <Text>
                            Remaining: <Title ta={"center"} c={"red"}>{`${totalPoints - spentPoints}`}</Title>
                        </Text>
                    </Group>
                    {options.map((option: V5BackgroundRef) => {
                        if (totalPoints - spentPoints === 0) { pass = true } else { pass = false }
                        const backgroundInfo = backgroundData.find((entry) => entry.name === option.name)
                        const getAdvantagePoints = (advantage: V5AdvantageRef) => {
                            const advantageInfo = option.advantages.find((a) => a.name === advantage.name)
                            const creation = advantageInfo ? advantageInfo.creationPoints : 0
                            const freebie = advantageInfo ? advantageInfo.freebiePoints : 0
                            return creation + freebie
                        }
                        if (!backgroundInfo) {
                            return null;
                        } else {
                            return (
                                <div>
                                    <Group>
                                        <Tooltip
                                            disabled={backgroundInfo.summary === ""}
                                            label={backgroundInfo.summary}
                                            transitionProps={{ transition: "slide-up", duration: 200 }}
                                            events={{ hover: true, focus: true, touch: true }}
                                        >
                                            <Text w={"80px"}>{option.name}</Text>
                                        </Tooltip>
                                        <NumberInput
                                            value={option.freebiePoints}
                                            min={0}
                                            max={totalPoints - spentPoints === 0 ? option.freebiePoints : 3}
                                            width={"50%"}
                                            onChange={(val: number) => {
                                                setBenefitData({
                                                    ...benefitData,
                                                    selectableBackgrounds: {
                                                        ...benefitData.selectableBackgrounds,
                                                        options: benefitData.selectableBackgrounds.options.map((b: any) =>
                                                            b.id === option.id ? { ...b, freebiePoints: val } : b
                                                        )
                                                    }
                                                })
                                            }}
                                            style={{ width: "100px" }}
                                        />
                                        {backgroundInfo.advantages && backgroundInfo.advantages.length > 0 ?
                                            <Accordion variant="contained">
                                                <Accordion.Item value={backgroundInfo.name}>
                                                    <Accordion.Control>Advantages</Accordion.Control>
                                                    <Accordion.Panel>
                                                        <Table>
                                                            <tbody>
                                                                {backgroundInfo.advantages.map((advantage) => {
                                                                    if (advantage?.type === "disadvantage") { return null }
                                                                    const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                                                                    const advantageRef = option.advantages.find((a) => a.name === advantage.name) || { ...emptyAdvantage, name: advantage.name }
                                                                    const havenSizeMax = option.name === "Haven" ? v5BackgroundLevel(option).level : 0;
                                                                    if (!advantageRef) { return null }
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                <Text align="center">{icon} &nbsp;{advantage.name}</Text>
                                                                                <Center>
                                                                                    {getRating(advantage.cost)}
                                                                                </Center>
                                                                                <Center>
                                                                                    <NumberInput
                                                                                        value={advantageRef.freebiePoints}
                                                                                        min={0}
                                                                                        step={advantageStep(advantageRef, backgroundInfo)}
                                                                                        max={
                                                                                            backgroundInfo.name === "Haven" && advantage.type === "advantage"
                                                                                                ? havenSizeMax
                                                                                                : getAdvantagePoints(advantageRef) === advantage.cost[advantage.cost.length - 1]
                                                                                                    ? advantageRef.creationPoints
                                                                                                    : advantage.cost[advantage.cost.length - 1]
                                                                                        }
                                                                                        onChange={(val: number) => {

                                                                                            const existingAdvantage = option.advantages.find((a) => a.name === advantageRef.name);
                                                                                            if (!existingAdvantage) {
                                                                                                option.advantages.push({ ...advantageRef, freebiePoints: val })
                                                                                            }

                                                                                            const updatedOption = {
                                                                                                ...option,
                                                                                                advantages: option.advantages.map((advantage) =>
                                                                                                    advantage.name === advantageRef.name ? { ...advantage, freebiePoints: val } : advantage
                                                                                                ),
                                                                                            };

                                                                                            // Create a copy of benefitData and update the options array
                                                                                            const updatedBenefitData = {
                                                                                                ...benefitData,
                                                                                                selectableBackgrounds: {
                                                                                                    ...benefitData.selectableBackgrounds,
                                                                                                    options: benefitData.selectableBackgrounds.options.map((o: any) =>
                                                                                                        o.name === option.name ? updatedOption : o
                                                                                                    ),
                                                                                                },
                                                                                            };
                                                                                            setBenefitData(updatedBenefitData);
                                                                                        }}
                                                                                    />
                                                                                </Center>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </Table>
                                                    </Accordion.Panel>
                                                </Accordion.Item>
                                            </Accordion>
                                            : <></>}
                                        {option.name === "Allies" || option.name === "Contacts"?
                                        <Select
                                            label="Pick Sphere for Background"
                                            placeholder="Pick sphere"
                                            data={SphereSelectData}
                                            defaultValue=""
                                            w={180}
                                            onChange={(val) => {
                                                setBenefitData({
                                                    ...benefitData,
                                                    selectableBackgrounds: {
                                                        ...benefitData.selectableBackgrounds,
                                                        options: benefitData.selectableBackgrounds.options.map((b: any) =>
                                                            b.id === option.id ? { ...b, sphere: val } : b
                                                        )
                                                    }
                                                })
                                            }}
                                        />
                                        :<></>}
                                    </Group>
                                </div>
                            )
                        }
                    })}

                    <Button
                        disabled={!(pass)}
                        onClick={() => {
                            const selectableBackgrounds = benefitData.selectableBackgrounds.options.filter((option: any) => option.freebiePoints > 0);
                            const combinedBackgrounds = [
                                ...kindred.backgrounds,
                                ...selectableBackgrounds
                            ]
                            setKindred({
                                ...kindred,
                                backgrounds: combinedBackgrounds,
                                loresheet: {
                                    ...kindred.loresheet,
                                    name: loresheet.name,
                                    benefits: [...kindred.loresheet.benefits, {
                                        name: benefit.name, creationPoints: benefit.level, freebiePoints: 0, experiencePoints: 0
                                    }],
                                },
                            })
                            console.log(benefit)
                            backgroundCloseModal()
                        }}
                    >
                        Confirm
                    </Button>
                </Stack>
            </ScrollArea>
        </Modal>
    )
}

export default LoresheetsPicker