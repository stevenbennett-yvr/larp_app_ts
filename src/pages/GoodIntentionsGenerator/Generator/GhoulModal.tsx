import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Accordion, Title, Select, Button, Space, ScrollArea, Stack, Center, Modal, Text, Card, Image, Grid, Table, Tooltip, NumberInput } from "@mantine/core"
import { useState, useEffect } from "react"
import { ClanName, allClans, Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { DisciplineName, disciplines, disciplineKeySchema, getEmptyDisciplines, DisciplineKey, v5DisciplineLevel } from "../../../data/GoodIntentions/types/V5Disciplines"
import { upcase } from "../../../utils/case"
import { allPowers, Power, getFilteredPower, handlePowerChange, removePower, powerRefs } from "../../../data/GoodIntentions/types/V5Powers"

type GhoulModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    nextStep: () => void,
    modalOpened: boolean
    closeModal: () => void
}

const GhoulModal = ({ kindred, setKindred, nextStep, modalOpened, closeModal }: GhoulModalProps) => {
    const smallScreen = globals.isSmallScreen
    const isPhoneScreen = globals.isPhoneScreen

    const [pickedClan, setPickedClan] = useState<ClanName>("")

    let ghoulDescriptor = ""

    switch (pickedClan) {
        case "Banu Haqim":
            ghoulDescriptor = "Banu Haqim ghouls serve unique roles, carefully chosen and subjected to arduous, sometimes perilous trials in preparation for a potential Embrace. All Banu Haqim ghouls have the ability to defend themselves in basic combat, at least long enough to escape to safety.";
            break;
        case "Brujah":
            ghoulDescriptor = "Brujah ghouls are a diverse bunch, often prioritizing their domitor's interests over clan needs. While not a universal rule, Brujah tend to treat their ghouls with more respect compared to other clans. Those affected by the Brujah Clan Curse frequently yearn for independence.";
            break;
        case "Ministry":
            ghoulDescriptor = "Ministry tend to focus on maintaining their cults and occationally create Ghouls as a way of rewarding cult leaders, recruiters or those keeping others in line. If a Ghoul develops the Ministry Clan Curse, which defats the purpouse of having a servants who can walk in sunlight, they are abadoned or put down.";
            break;
        case "Gangrel":
            ghoulDescriptor = "Gangrel Ghouls are often drawn from lifestyles that allow them to be transient, but also to help their domitors in a variety of tasks. A single Gangel gouls may be tasked wtih maintaining Mortal Connections, aiding in long distance travel, locating victims and disposing of bodies at a turn.";
            break;
        case "Hecata":
            ghoulDescriptor = "Hecata ghouls are divided into three groups: Candicates for the embrace, old touchstones and valuable tools. The duties of most are geared towards their natural talents. Embrace candidates are encouraged to increase their knowledge of Necromancy and engage in family politics.";
            break;
        case "Malkavian":
            ghoulDescriptor = "A Malkavian's blood often governs how, when and why they select a ghoul. Some recognize their limitations and choose Ghouls to help them maintain the Masquerade, support their disability and survive.";
            break;
        case "Nosferatu":
            ghoulDescriptor = "Nosferatu, in general, avoid making ghouls of high-ranking or visible members of society. Instead they focus on those who keep the city functioning, the movers and shakers who operate unseen. Often those candidates overlooked by other clans.";
            break;
        case "Ravnos":
            ghoulDescriptor = "Ravnos ghouls are not subjected to extensive screening beforehand. Most ghouls are created for short-term, specific tasks, to be abandoned at completion. With the true nature of the relationship only revealed if the ghoul proves particularly adaptable and cunning..";
            break;
        case "Lasombra":
            ghoulDescriptor = "Lasombra, owing to their Dominate discipline, don't rely on ghouls as much as other clans do. As such, Lasombra ghouls typically excel at a particular task, supporting their masters on personal matters or in areas related to holdings, security, or politics.";
            break;
        case "Toreador":
            ghoulDescriptor = "Toreador maintain exceptionally close relationships with their ghouls, often seeking out mortals they can admire or individuals they can artistically shape into objects of admiration. Beauty is a factor, but Toreador ghouls must possess unique attributes, talents, or resources to keep their domitor's attention long-term.";
            break;
        case "Tremere":
            ghoulDescriptor = "Tremere, more so than other clans, adhere to strict guidelines for creating and maintaining ghouls, whether or not they're meant for the Embrace. Ghouls are often assigned by higher-ups on the Pyramid, and the Clan monitors them closely to safeguard Tremere secrets and protocols.";
            break;
        case "Tzimisce":
            ghoulDescriptor = "Tzimisce ghouls undergo a unique transformation, reflecting the Clan's penchant for body modification. Chosen for their resilience and adaptability, these ghouls often serve as guardians or enforcers. They experience a profound connection to the Clan, sharing in its appreciation for physical transformation and body horror.";
            break;
        case "Ventrue":
            ghoulDescriptor = "Due to their mastery of Disciplines, the Ventrue have reduced reliance on Ghouls compared to other Clans. As a result, Ventrue ghouls undergo an extensive vetting process and are regarded more as dedicated employees or military subordinates by culture of the clan.";
            break;
        case "Salubri":
            ghoulDescriptor = "Salubri ghouls are handpicked with great care, chosen for their potential to embody the Clan's values of healing and compassion. These ghouls often serve as guardians of their domitors and are encouraged to develop their skills in the art of healing. ";
            break;
    }

    let filteredClans = allClans.filter(clan => clan !== "Caitiff" && clan !== "Thin-Blood");

    const disciplinesForClan = Clans[pickedClan].disciplines;

    const createDisciplinePicker = (discipline: DisciplineName) => {
        const totalPoints = Object.values(kindred.disciplines).reduce(
            (acc, d) => acc + d.creationPoints,
            0
        );
        const isMaxedOut = totalPoints === 2;

        return (
            <Grid.Col key={`${discipline} ghoul picker`} span={2}>
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
                                max={1}
                                disabled={kindred.disciplines[discipline].creationPoints === 0 && isMaxedOut}
                                value={kindred.disciplines[discipline].creationPoints}
                                onChange={(val) => {
                                    setKindred({ ...kindred, powers:[], disciplines: { ...kindred.disciplines, [discipline]: { ...kindred.disciplines[discipline], creationPoints: val } } })
                                }}
                            >
                            </NumberInput>
                        </Card.Section>
                    </Card>

                </Tooltip>
            </Grid.Col>
        )
    }

    const [learnablePowers, setLearnablePowers] = useState<Power[]>(getFilteredPower(kindred))
    useEffect(() => {
        setLearnablePowers(getFilteredPower(kindred))
    }, [kindred])

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
                        style={{ backgroundColor: "#25262B" }}
                        icon={<Image height={20} width={20} src={disciplines[discipline].logo} />}>
                        {discipline.toUpperCase()}
                        {selectedPowersInDiscipline.length < kindred.disciplines[discipline].creationPoints ?
                            <Text><b style={{ color: "#880808" }}>{kindred.disciplines[discipline].creationPoints - selectedPowersInDiscipline.length} Remaining</b></Text> :
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

    const disciplinePowersSelected = (kindred: Kindred, discipline: DisciplineKey) => {
        const selectedPowers = kindred.powers.filter((power) => {
            const matchingPower = allPowers.find((p) => power.name === p.name);
            return matchingPower?.discipline === discipline;
        });

        return selectedPowers.length < v5DisciplineLevel(kindred, discipline).level;
    };

    const knownDisciplines = Object.keys(kindred.disciplines).filter((disciplineKey) => {
        const discipline = kindred.disciplines[disciplineKey as DisciplineKey]
        return discipline.creationPoints > 0;
    })

    const height = globals.viewportHeightPx
    return (
        <Modal
            opened={modalOpened}
            onClose={closeModal}
            size={600}
        >
            <Stack align="center" spacing="xl" w={"100%"}>
                <ScrollArea h={smallScreen ? height - 320 : height - 400} pb={20} w={"105%"}>
                    <Center>
                        <Select
                            label="Choose Domitor Clan"
                            value={pickedClan}
                            data={filteredClans}
                            onChange={(val) => {
                                if (val === null) return (null)
                                let clanName = val as ClanName
                                setPickedClan(clanName)
                                setKindred({ ...kindred, disciplines: getEmptyDisciplines })
                            }}
                        />
                    </Center>
                    <Space h={"lg"} />

                    <Text align="center">{ghoulDescriptor}</Text>
                    <Space h={"lg"} />
                    <Center>
                        {pickedClan !== "" ?
                            <Grid columns={isPhoneScreen ? 4 : 8} grow m={0}>
                                {
                                    disciplinesForClan.map((o) => disciplineKeySchema.parse(o)).map((discipline) => createDisciplinePicker(discipline))
                                }
                            </Grid> :
                            <></>}
                    </Center>
                    <Accordion variant="contained" >
                        {
                            (knownDisciplines as DisciplineKey[]).map((d) => createPowerAccordion(d))
                        }
                    </Accordion>
                </ScrollArea>
                <Button
                    disabled={(knownDisciplines as DisciplineKey[]).some((d) => disciplinePowersSelected(kindred, d))}
                    onClick={() => {
                        nextStep()
                    }}
                >Next</Button>
            </Stack>
        </Modal>
    )
}

export default GhoulModal