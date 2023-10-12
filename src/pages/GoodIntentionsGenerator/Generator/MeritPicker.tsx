import { faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Alert, Button, Stack, Accordion, Center, NumberInput, useMantineTheme, Table, Text, Group, ScrollArea } from "@mantine/core";

import { globals } from "../../../assets/globals";
import { V5MeritFlaw, V5MeritFlawRef, v5MeritFlawRefs, v5MeritLevel, v5MeritFlawFilter, handleMeritFlawChange } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import Tally from "../../../utils/talley";
import FormulaPicker from "./FormulaPicker";
import GhoulModal from "./GhoulModal";
import { useState } from "react";

type MeritPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}
const getRating = (array: number[]) => {
    let first = array[0]
    let last = array[array.length - 1]

    if (first === last) {
        return <Tally n={last} />
    } else {
        return <Group><Tally n={first} /> to <Tally n={last} /></Group>
    }

}

const MeritPicker = ({ kindred, setKindred, nextStep, backStep }: MeritPickerProps) => {
    const theme = useMantineTheme()

    const meritFlawData = v5MeritFlawFilter(kindred)

    const getTotalPoints = (kindred: Kindred) => {
        let totalFlawPoints = 0;
        let totalMeritPoints = 0;
        Object.values(kindred.meritsFlaws).forEach((mf) => {
            let meritFlawInfo = meritFlawData.find(entry => entry.name === mf.name)
            if (meritFlawInfo?.type === "flaw") {
                totalFlawPoints += mf.creationPoints
            }
            if (meritFlawInfo?.type === "merit") {
                totalMeritPoints += mf.creationPoints
            }
        })
        return { totalFlawPoints, totalMeritPoints }
    }

    const getThinBloodPoints = (kindred: Kindred) => {
        let totalFlawPoints = 0;
        let totalMeritPoints = 0;
        Object.values(kindred.meritsFlaws).forEach((mf) => {
            let meritFlawInfo = meritFlawData.find(entry => entry.name === mf.name)
            if (meritFlawInfo?.type === "flaw" && meritFlawInfo.category === "thin-blood") {
                totalFlawPoints += mf.creationPoints
            }
            if (meritFlawInfo?.type === "merit" && meritFlawInfo.category === "thin-blood") {
                totalMeritPoints += mf.creationPoints
            }
        })
        return { totalFlawPoints, totalMeritPoints }
    }

    const getStep = (meritFlaw: V5MeritFlawRef): number => {
        const meritInfo = meritFlawData.find(entry => entry.name === meritFlaw.name)
        let minCost = meritInfo?.cost[0];
        let maxCost = meritInfo?.cost[meritInfo?.cost.length - 1]
        if (!minCost || !maxCost) { return 1 }
        if (minCost === maxCost) {
            return minCost;
        } else {
            return 1;
        }
    }

    const MeritInput = (merit: V5MeritFlaw) => {

        const meritInfo = meritFlawData.find(entry => entry.name === merit.name)
        const meritRef = kindred.meritsFlaws.find((mf) => mf.name === merit.name) || v5MeritFlawRefs.find((mf) => mf.name === merit.name)
        if (!meritRef || !meritInfo) { return }
        const getMeritPoints = (meritRef: V5MeritFlawRef) => {
            const meritInfo = kindred.meritsFlaws.find((mf) => mf.name === meritRef.name)
            const creation = meritInfo ? meritInfo.creationPoints : 0
            const freebie = meritInfo ? meritInfo.freebiePoints : 0
            return creation + freebie
        }
        return (
            <div>
                <NumberInput
                    disabled={getMeritPoints(meritRef) === 0 && meritInfo.category === "thin-blood" && ((meritInfo.type === "flaw" && getThinBloodPoints(kindred).totalFlawPoints >= 3) || (meritInfo.type === "merit" && getThinBloodPoints(kindred).totalMeritPoints >= 3))}
                    value={getMeritPoints(meritRef)}
                    min={meritRef.freebiePoints}
                    max={meritInfo.cost.length === 1 && meritInfo.cost[0] === 1 ? 1 : v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo?.cost.length - 1] ? meritRef.creationPoints : meritInfo.cost[meritInfo.cost.length - 1]}
                    step={getStep(meritRef)}
                    onChange={(val) => {
                        console.log(val)
                        handleMeritFlawChange(kindred, setKindred, meritRef, "creationPoints", val)
                    }}
                />
            </div>
        )
    }


    const createMeritAccordian = (category: string) => {

        if ((kindred.clan !== "Thin-Blood" && category === "Thin-Blood") || (kindred.clan !== "Ghoul" && category === "Ghoul")) {
            return null
        }

        let bgc = ""

        switch (category) {
            case "Bonding":
                bgc = theme.fn.rgba(theme.colors.red[9], 0.90); // Blue color
                break;
            case "Connection":
                bgc = theme.fn.rgba(theme.colors.red[8], 0.90); // Red color
                break;
            case "Feeding":
                bgc = theme.fn.rgba(theme.colors.red[7], 0.90); // Purple color
                break;
            case "Mystical":
                bgc = theme.fn.rgba(theme.colors.red[6], 0.90); // Green color
                break;
            case "Physical":
                bgc = theme.fn.rgba(theme.colors.red[5], 0.90); // Yellow color
                break;
            case "Psychological":
                bgc = theme.fn.rgba(theme.colors.red[4], 0.90); // Orange color
                break;
            case "Thin-Blood":
                bgc = theme.fn.rgba(theme.colors.red[3], 0.90); // Gray color
                break;
            case "Ghoul":
                bgc = theme.fn.rgba(theme.colors.red[3], 0.90); // Gray color
                break;
        }


        let meritFlawDisplay = meritFlawData
            .filter((mf) => mf.category.toLocaleLowerCase() === category.toLocaleLowerCase())


        return (
            <div>
                <Accordion.Item value={category}>
                    <Accordion.Control style={{ color: "white", backgroundColor: bgc }}>{category.toUpperCase()}</Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        Merit
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {meritFlawDisplay.map((meritFlaw) => {
                                    const icon = meritFlaw.type === "flaw" ? flawIcon() : meritIcon()
                                    return (
                                        <tr key={`${meritFlaw.name} ${meritFlaw.type}`}>
                                            <td style={{ minWidth: "150px" }}>
                                                <Text>{icon} &nbsp; {meritFlaw.name}</Text>
                                                {getRating(meritFlaw.cost)}
                                                {MeritInput(meritFlaw)}
                                            </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${meritFlaw.description}` }} />
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
            </div>
        )

    }

    let categoryArray = ["Thin-Blood", "Ghoul", "Bonding", "Connection", "Feeding", "Mystical", "Physical", "Psychological"]

    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setKindred({
            ...kindred,
            rituals: [],
            ceremonies: [],
        })
        setModalOpen(false);
    };

    const [ghoulModalOpen, setGhoulModalOpen] = useState(false);
    const handleGhoulCloseModal = () => {
        setKindred({
            ...kindred,
            domitor: {
                name:"",
                clan:""
            }
        })
        setGhoulModalOpen(false);
    };

    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen
    const height = globals.viewportHeightPx

    const thinBloodStyle = !(getThinBloodPoints(kindred).totalFlawPoints > 0 && getThinBloodPoints(kindred).totalMeritPoints > 0 && getThinBloodPoints(kindred).totalFlawPoints === getThinBloodPoints(kindred).totalMeritPoints) ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const isAlchemist = kindred.meritsFlaws.find((m) => m.name === "Thin-Blood Alchemist")
    const isDiscipline = kindred.meritsFlaws.find((m) => m.name === "Discipline Affinity")

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px' }}>
            <Stack>
                <ScrollArea h={height - 140} pb={20}>
                    <Text align="center" mt={"xl"} ta="center" fz="xl" fw={700}>Merits & Flaws</Text>
                    {kindred.clan === "Thin-Blood" ?
                        <Text style={thinBloodStyle}>
                            Thin-blood characters must choose between 1 to 3 Thin-Blood Merits and an equal number of Thin-Blood Flaws.
                        </Text> :
                        <></>}
                    <Center>
                        <Accordion w={globals.isSmallScreen ? "100%" : "600px"}>
                            {
                                categoryArray.map((c) => createMeritAccordian(c))
                            }
                        </Accordion>
                    </Center>

                    <FormulaPicker kindred={kindred} setKindred={setKindred} nextStep={nextStep} modalOpened={modalOpen} closeModal={handleCloseModal} />
                    <GhoulModal kindred={kindred} setKindred={setKindred} nextStep={nextStep} modalOpened={ghoulModalOpen} closeModal={handleGhoulCloseModal} />


                </ScrollArea>
                <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
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
                                onClick={
                                    (kindred.clan==="Ghoul")?
                                    () => setGhoulModalOpen(true):
                                    !(isAlchemist || isDiscipline)
                                        ? nextStep
                                        : () => setModalOpen(true)
                                }
                                disabled={getTotalPoints(kindred).totalMeritPoints > 10 || getTotalPoints(kindred).totalMeritPoints !== getTotalPoints(kindred).totalFlawPoints || (kindred.clan === "Thin-Blood" && getThinBloodPoints(kindred).totalMeritPoints === 0 && getThinBloodPoints(kindred).totalFlawPoints === 0)}
                            >
                                Next
                            </Button>
                            <Text fz={globals.smallerFontSize} style={{ margin: "10px" }}>Total Merits: {getTotalPoints(kindred).totalMeritPoints}, Total Flaws: {getTotalPoints(kindred).totalFlawPoints}</Text>
                        </Button.Group>
                    </Group>
                </Alert>
            </Stack>
        </Center>
    )

}

export default MeritPicker