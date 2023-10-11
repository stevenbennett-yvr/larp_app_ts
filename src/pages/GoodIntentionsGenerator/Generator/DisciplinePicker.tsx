import { Table, Text, Center, Grid, Tooltip, Image, Card, Title, NumberInput, Stack, Alert, Group, Button, Accordion } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { v5DisciplineLevel, DisciplineName, disciplines, disciplineKeySchema, DisciplineKey, allDisciplines } from "../../../data/GoodIntentions/types/V5Disciplines"
import { Power, getFilteredPower, handlePowerChange, powerRefs, removePower, allPowers } from "../../../data/GoodIntentions/types/V5Powers"
import { upcase } from "../../../utils/case"
import { useEffect, useState } from "react"
import RitualsModal from "./RitualModal"

type DisciplinesPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const DisciplinesPicker = ({ kindred, setKindred, nextStep, backStep }: DisciplinesPickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setKindred({
            ...kindred,
            rituals: [],
            ceremonies:[],
        })
        setModalOpen(false);
    };

    let mostDisciplines = allDisciplines.filter((disciplineName) => {
        return disciplineName !== "thin-blood alchemy";
    })

    const disciplinesForClan = kindred.clan === "Caitiff" ? mostDisciplines : Clans[kindred.clan].disciplines;
    const otherDisciplines = mostDisciplines.filter((disciplineName) => {
        // Add a condition to filter out "thin blood alchemy"
        return !disciplinesForClan.includes(disciplineName);
    });

    const [inClanFirst, inClanSecond, inClanThird] = disciplinesForClan;

    const [inClanDots, setInClanDots] = useState<number[]>(
        [kindred.disciplines[inClanFirst].creationPoints, kindred.disciplines[inClanSecond].creationPoints, kindred.disciplines[inClanThird].creationPoints]
    );

    const handleDisciplineCreationPointChange = (discipline: DisciplineKey, val: number): void => {

        const updatedDisciplines = {
            ...kindred.disciplines,
            [discipline]: {
                ...kindred.disciplines[discipline],
                creationPoints: val
            }
        }

        setInClanDots(
            [updatedDisciplines[inClanFirst].creationPoints, updatedDisciplines[inClanSecond].creationPoints, updatedDisciplines[inClanThird].creationPoints]
        )

        setKindred({
            ...kindred,
            disciplines: updatedDisciplines,
            powers: []
        })
    }

    const createDisciplinePicker = (discipline: DisciplineName, inClan: boolean) => {
        const totalPoints = Object.values(kindred.disciplines).reduce(
            (acc, d) => acc + d.creationPoints,
            0
        );
        const isMaxedOut = totalPoints === 4;

        const isCategoryCreationPointsZero = kindred.disciplines[discipline].creationPoints === 0;

        const isDisabled = isMaxedOut && isCategoryCreationPointsZero ? true : (!inClan && !(inClanDots.includes(1) && inClanDots.includes(2)));
        const maxPoints = isMaxedOut ? 0 : inClanDots.includes(2) ? 1 : 2;


        return (
            <Grid.Col key={discipline} span={2}>
                <Tooltip
                    multiline
                    width={220}
                    withArrow
                    transitionProps={{ duration: 400 }} // Adjust the duration as needed
                    label={disciplines[discipline].summary}
                    position={globals.isPhoneScreen ? "bottom" : "top"}
                    events={{ hover: true, focus: false, touch: false }}
                >
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                    >
                        <Card.Section>
                            <Center>
                                <Image
                                    fit="contain"
                                    withPlaceholder
                                    src={disciplines[discipline].logo}
                                    height={50}
                                    width={50}
                                    alt="order"
                                    style={isDisabled ? { filter: "brightness(0)" } : {}}
                                />
                            </Center>
                            <Center>
                                <Title h={30} size="sm" color="dimmed" ta="center">
                                    {upcase(discipline)}
                                </Title>
                            </Center>
                            <NumberInput
                                key={`${discipline}`}
                                min={0}
                                max={maxPoints}
                                disabled={isDisabled}
                                value={kindred.disciplines[discipline].creationPoints}
                                onChange={(val: number) =>
                                    handleDisciplineCreationPointChange(discipline, val)
                                }
                            >
                            </NumberInput>
                        </Card.Section>
                    </Card>

                </Tooltip>
            </Grid.Col>
        )
    }

    // Rote Accordion

    const [learnablePowers, setLearnablePowers] = useState<Power[]>(getFilteredPower(kindred))
    useEffect(() => {
        setLearnablePowers(getFilteredPower(kindred))
    }, [kindred])

    const knownDisciplines = Object.keys(kindred.disciplines).filter((disciplineKey) => {
        const discipline = kindred.disciplines[disciplineKey as DisciplineKey]
        return discipline.creationPoints > 0;
    })

    const handleSelect = (power: Power) => {
        const powerRef = powerRefs.find((p) => p.name === power.name)
        if (powerRef && !kindred.powers.some(existingPower => existingPower.name === power.name)) {
            handlePowerChange(kindred, setKindred, powerRef, "creationPoints", 1)
        }
    }

    const handleDeselect = (power: Power) => {
        const powerRef = powerRefs.find((p) => p.name === power.name)
        if (powerRef) {
            removePower(kindred, setKindred, powerRef)
        }
    }

    const getHighestSelectedLevelInDiscipline = (kindred: Kindred, disciplineCategory: DisciplineKey) => {
        let highestLevel = 0;

        kindred.powers.forEach((power) => {
            let powerData = allPowers.find((p) => power.name === p.name)
            if (!powerData) { return 0 }
            if (powerData.discipline === disciplineCategory && powerData.level > highestLevel) {
                highestLevel = powerData.level;
            }
        });

        return highestLevel;
    };

    const disciplinePowersSelected = (kindred: Kindred, discipline: DisciplineKey) => {
        const selectedPowers = kindred.powers.filter((power) => {
            const matchingPower = allPowers.find((p) => power.name === p.name);
            return matchingPower?.discipline === discipline;
        });

        return selectedPowers.length < v5DisciplineLevel(kindred, discipline).level;
    };

    const createPowerAccordion = (discipline: DisciplineKey) => {
        const filteredPowers = learnablePowers.filter((power) => power.discipline.toLowerCase() === discipline.toLowerCase())

        filteredPowers.sort((a, b) => {
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        });

        // Count the number of selected powers in the current discipline
        const selectedPowersInDiscipline = kindred.powers.filter((power) => allPowers.find((p) => power.name === p.name)?.discipline === discipline);

        return (
            <div>
                <Accordion.Item value={discipline}>
                    <Accordion.Control 
                        style={{ backgroundColor:"#25262B"}}
                        icon={<Image height={20} width={20} src={disciplines[discipline].logo} />}>
                            {discipline.toUpperCase()} 
                            {selectedPowersInDiscipline.length < kindred.disciplines[discipline].creationPoints? 
                                <Text><b style={{ color: "#880808" }}>{kindred.disciplines[discipline].creationPoints - selectedPowersInDiscipline.length} Remaining</b></Text>:
                                <></>}
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Power</th>
                                    <th>Description</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPowers.map((power) => {
                                    const isPowerSelected = selectedPowersInDiscipline.some((p) => p.name === power.name);
                                    return (
                                        <tr key={`${power.name} desktop`}>
                                            <td>
                                                <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{power.name}</Text>
                                                <Image
                                                    fit="contain"
                                                    withPlaceholder
                                                    src={disciplines[discipline].logo}
                                                    height={30}
                                                    width={30}
                                                    alt="order"
                                                />
                                                <p style={{ color: "white" }}>{power.discipline} {power.level} {power.amalgamPrerequisites.length > 0 ? `+ ${power.amalgamPrerequisites[0].discipline} ${power.amalgamPrerequisites[0].level}` : ""}</p>
                                            </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${power.summary} <p>${power.dicePool}</p>` }} />
                                            <td>
                                                {isPowerSelected ? (
                                                    <Button color="red" onClick={() => { handleDeselect(power); }}>Deselect</Button>
                                                ) : (
                                                    disciplinePowersSelected(kindred, discipline) && (getHighestSelectedLevelInDiscipline(kindred, discipline) >= power.level - 1) ? (
                                                        <Button color="gray" onClick={() => { handleSelect(power); }}>Select</Button>
                                                    ) : (
                                                        <Button disabled>Select</Button>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
            </div>
        )
    }
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '120px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">

                <Group ta={"center"}>
                    <Text >
                        One In-Clan discipline at 2;
                    </Text>
                    <Text >
                        One In-Clan discipline at 1;
                    </Text>
                    <Text >
                        and one In-Clan or Out-of-Clan Discipline at 1;
                    </Text>
                </Group>
                <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">In-Clan</Text>

                {kindred.clan === "Caitiff" ?
                    <Grid columns={isPhoneScreen ? 4 : 8} grow m={0}>
                        {
                            disciplinesForClan.map((o) => disciplineKeySchema.parse(o)).map((discipline) => createDisciplinePicker(discipline, true))
                        }
                    </Grid>
                    :
                    <div>
                        <Grid columns={isPhoneScreen ? 4 : 6} grow m={0}>
                            {
                                disciplinesForClan.map((o) => disciplineKeySchema.parse(o)).map((discipline) => createDisciplinePicker(discipline, true))
                            }
                        </Grid>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Out-of-Clan</Text>

                        <Grid columns={isPhoneScreen ? 4 : 8} grow m={0}>
                            {
                                otherDisciplines.map((o) => disciplineKeySchema.parse(o)).map((discipline) => createDisciplinePicker(discipline, false))
                            }
                        </Grid>
                    </div>
                }


                    <Accordion variant="contained" >
                        {
                            (knownDisciplines as DisciplineKey[]).map((d) => createPowerAccordion(d))
                        }
                    </Accordion>
            </Stack>

            <RitualsModal modalOpened={modalOpen} closeModal={handleCloseModal} kindred={kindred} setKindred={setKindred} nextStep={nextStep} />

            <Alert color="dark" variant="filled" radius="md" style={{ padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
                <Group>
                    <Button.Group>
                        <Button
                            style={{ margin: "5px" }}
                            color="gray"
                            onClick={backStep}
                        >
                            Back
                        </Button>
                        <Button
                            style={{ margin: "5px" }}
                            color="gray"
                            onClick={() => {
                                if (v5DisciplineLevel(kindred,"blood sorcery").level === 0 && v5DisciplineLevel(kindred,"oblivion").level === 0)
                                { nextStep( ) } else 
                                { setModalOpen(true) }
                            }}
                            disabled={(knownDisciplines as DisciplineKey[]).some((d) => disciplinePowersSelected(kindred, d))}
                        >
                            Next
                        </Button>
                    </Button.Group>
                </Group>
            </Alert>
        </Center>

    )
}

export default DisciplinesPicker