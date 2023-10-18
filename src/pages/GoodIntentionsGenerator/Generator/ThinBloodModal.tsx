import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Select, Grid, Card, Group, Text, Badge, Button, Space, ScrollArea, Stack, Center, Modal, Image } from "@mantine/core"
import { upcase } from "../../../utils/case"
import { disciplines, allDisciplines, DisciplineKey } from "../../../data/GoodIntentions/types/V5Disciplines"
import { FormulaRef, Formulae, formulaRefs } from "../../../data/GoodIntentions/types/V5Formulae"
import { useState } from "react"
import { allClans, ClanName, Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { handleMeritFlawChange } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws"

type FormulaPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    nextStep: () => void,
    modalOpened: boolean
    closeModal: () => void
}

const FormulaPicker = ({ kindred, setKindred, nextStep, modalOpened, closeModal }: FormulaPickerProps) => {
    const phoneScreen = globals.isPhoneScreen
    const smallScreen = globals.isSmallScreen



    const getformulaCardCols = () => {
        return Formulae.map((formula) => {
            if (formula.level > 1) { return null }
            const formulaRef = formulaRefs.find((entry) => entry.name === formula.name)
            if (!formulaRef) { return null }


            const onClick = () => {
                const updatedformulas = [...kindred.formulae, { ...formulaRef, creationPoints: 1 }];
                setKindred({ ...kindred, disciplines: { ...kindred.disciplines, "thin-blood alchemy": { ...kindred.disciplines["thin-blood alchemy"], creationPoints: 1 } }, formulae: updatedformulas });
            };
            const deselect = () => {
                setKindred({ ...kindred, formulae: [] });
            }
            const isformulaSelected = kindred.formulae.some((f: FormulaRef) => f.name === formula.name)
            let cardHeight = phoneScreen ? 400 : 215
            if (formula.name.length > 15) cardHeight += 25
            return (
                <Grid.Col key={formula.name} span={12}>
                    <Card mb={20} h={cardHeight} style={{ backgroundColor: "rgba(26, 27, 30, 0.90)" }}>
                        <Group mt="0" mb="xs">
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={disciplines["thin-blood alchemy"].logo}
                                height={30}
                                width={30}
                                alt="order"
                            />
                            <Text fz={smallScreen && !phoneScreen ? "xs" : "sm"} weight={500}>
                                {formula.name}
                            </Text>
                            <Badge pos={"absolute"} top={0} right={0} radius={"xs"} color="pink" variant="light">
                                lv {formula.level}
                            </Badge>
                        </Group>

                        <Text fz={"sm"} size="sm" color="dimmed">
                            {upcase(formula.summary)}
                        </Text>

                        <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                            {isformulaSelected ?
                                <Button onClick={deselect} variant="light" color="red" fullWidth radius="md">
                                    <Text truncate>Deselect {formula.name}</Text>
                                </Button>
                                :
                                <Button onClick={onClick} disabled={kindred.formulae.length !== 0} variant="light" color="blue" fullWidth radius="md">
                                    <Text truncate>Select {formula.name}</Text>
                                </Button>
                            }
                        </div>
                    </Card>
                </Grid.Col>
            )
        })
    }

    const isAlchemist = kindred.meritsFlaws.find((m) => m.name === "Thin-Blood Alchemist")
    const isDiscipline = kindred.meritsFlaws.find((m) => m.name === "Discipline Affinity")

    let mostDisciplines = allDisciplines.filter((disciplineName) => {
        return disciplineName !== "thin-blood alchemy";
    })
    let defaultDiscipline = ""
    for (const discipline in kindred.disciplines) {
        let key = discipline as DisciplineKey
        if (kindred.disciplines[key].creationPoints > 0) {
            defaultDiscipline=discipline
        }
    }
    const [pickedDiscipline, setPickedDiscipline] = useState(defaultDiscipline)
    const height = globals.viewportHeightPx


    const isCursed = kindred.meritsFlaws.find((m) => m.name === "Clan Curse")
    const isBestial = kindred.meritsFlaws.find((m) => m.name === "Bestial Temper")
    const isCatenating = kindred.meritsFlaws.find((m) => m.name === "Catenating blood")
    const [clan, setClan] = useState<ClanName>(kindred.clan)
    let curseData = allClans.filter(clan => clan !== "Thin-Blood" && clan !== "Ghoul" && clan !== "Caitiff");
    if (isBestial) { curseData = ["Brujah", "Gangrel"] }
    if (isCatenating) { curseData = [ "Tremere" ] }


    return (
        <Modal
            opened={modalOpened}
            onClose={closeModal}
            size={600}
        >
            <Stack align="center" spacing="xl" w={"100%"}>
                <ScrollArea h={smallScreen ? height - 320 : height - 400} pb={20} w={"105%"}>
                    <Center>
                        {isDiscipline ?
                            <Select
                                label="Choose Discipline Affinity"
                                value={pickedDiscipline}
                                data={mostDisciplines}
                                onChange={(val) => {
                                    if (val === null) return (null)

                                    setPickedDiscipline(val)
                                }}
                            />
                            : <></>}
                    </Center>
                    <Space h={"lg"} />
                    <Center>
                        <Stack>
                    {isCursed ? 
                            <Select
                            label="Choose A Clan Curse"
                            value={clan}
                            data={curseData}
                            onChange={(val:ClanName) => {
                                if (val === null) return (null)
                                setClan(val)
                            }}
                        />
                        :<></>}
                        {clan?
                        <Text align="center">{Clans[clan].bane}</Text>
                        :<></>}
                        </Stack>
                    </Center>
                    <Space h={"lg"} />
                    <Center>
                        {isAlchemist ?
                            <Stack>
                                <Text fw={700} fz={smallScreen ? "14px" : "28px"} align="center">
                                    ⛤ Pick 1 free Formula ⛤
                                </Text>
                                <Space h={"sm"} />
                                <Group>
                                    <Center>
                                        <Grid w={"50%"}>{getformulaCardCols()}</Grid>
                                    </Center>
                                </Group>
                            </Stack>
                            : <></>}
                    </Center>
                </ScrollArea>
                <Button
                    disabled={
                        (isAlchemist && kindred.formulae.length <= 0)
                        ||
                        (isDiscipline && pickedDiscipline === "")
                    }
                    onClick={() => {
                        if (pickedDiscipline === "") {
                            // Create a new object with 0 creation points for all disciplines
                            const newDisciplines = { ...kindred.disciplines };

                            // Set "thin-blood alchemy" to its existing value (if it exists)
                            if (newDisciplines.hasOwnProperty("thin-blood alchemy")) {
                                newDisciplines["thin-blood alchemy"] = kindred.disciplines["thin-blood alchemy"];
                            }

                            // Update the kindred object with the new discipline values
                            setKindred({
                                ...kindred,
                                disciplines: newDisciplines
                            });
                        }
                        if (pickedDiscipline !== "") {
                            
                            for (const disciplineKey in kindred.disciplines) {
                                let key = disciplineKey as DisciplineKey
                                if (key !== "thin-blood alchemy") {
                                    kindred.disciplines[key] = {
                                        ...kindred.disciplines[key],
                                        creationPoints: 0,
                                    };
                                }
                            }
                            let discipline = pickedDiscipline as DisciplineKey
                            setKindred({
                                ...kindred,
                                disciplines: {
                                    ...kindred.disciplines,
                                    [discipline]: {
                                        ...kindred.disciplines[discipline],
                                        creationPoints:1
                                    }
                                },
                                powers: []
                            })
                        }
                        if (clan !== "" && isCursed) {
                            handleMeritFlawChange(kindred, setKindred, isCursed, "note", clan)
                        }
                        nextStep()
                    }}
                >Next</Button>
            </Stack>
        </Modal>
    )
}

export default FormulaPicker