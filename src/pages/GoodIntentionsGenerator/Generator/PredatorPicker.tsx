import { Button, Divider, Grid, ScrollArea, Space, Stack, Text, Tooltip, Alert } from "@mantine/core"
import { useState } from "react"
import { PredatorTypes, PredatorTypeName, PredatorType } from "../../../data/GoodIntentions/types/V5PredatorType"
import { globals } from "../../../assets/globals"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import PredatorModal from "./PredatorModal"

type PredatorTypePickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const PredatorTypePicker = ({ kindred, setKindred, nextStep, backStep }: PredatorTypePickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const isVentrue = kindred.clan === "Ventrue" ? true : false
    const isThinblood = kindred.clan === "Thin-Blood" ? true : false
//    const isRavnos = kindred.clan === "Ravnos" ? true : false

    const [pickedPredatorType, setPickedPredatorType] = useState<PredatorTypeName>("")
    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setPickedPredatorType('');
        setModalOpen(false);

    };
    const [predatorData, setPredatorData] = useState<PredatorType>();
    
    const createButton = (predatorTypeName: PredatorTypeName, color: string) => {

        const meritsAndFlaws = PredatorTypes[predatorTypeName].meritsAndFlaws;
        const ventrueMeritNamesToCheck = ["Iron Gullet", "Farmer", "Prey Exclusion"];
        const ventrueHasDesiredMerits = meritsAndFlaws.some(merit => ventrueMeritNamesToCheck.includes(merit.name));
        const thinbloodAdvantageToCheck = "Retainer"
        const thinbloodHasDesiredAdvantage = PredatorTypes[predatorTypeName].backgrounds.some(background => background.advantages.some(advantage => thinbloodAdvantageToCheck.includes(advantage.name)))

        const disabled = (isVentrue && ventrueHasDesiredMerits) || (isThinblood && thinbloodHasDesiredAdvantage)

        return (
            <Tooltip label={PredatorTypes[predatorTypeName].summary} key={predatorTypeName} transitionProps={{ transition: 'slide-up', duration: 200 }}>
                <Button disabled={disabled} color={color} onClick={() => {
                    setPickedPredatorType(predatorTypeName)
                    setModalOpen(true)
                    setPredatorData(PredatorTypes[predatorTypeName])
                }}>{predatorTypeName}</Button>
            </Tooltip>
        )
    }

    const createPredatorTypeStack = () => (
        <Stack spacing="xl">
            <Grid m={0}>
                <Grid.Col span={4}><h1>Violent</h1></Grid.Col>
                <Grid.Col offset={isPhoneScreen ? 1 : 0} span={isPhoneScreen ? 6 : 4}>
                    <Stack>{(["Alleycat", "Extortionist", "Hitcher"] as PredatorTypeName[]).map((clan) => createButton(clan, "red"))}</Stack>
                </Grid.Col>
            </Grid>

            <Divider color="grape" />

            <Grid m={0}>
                <Grid.Col span={4}><h1>Sociable</h1></Grid.Col>
                <Grid.Col offset={isPhoneScreen ? 1 : 0} span={isPhoneScreen ? 6 : 4}>
                    <Stack>{(["Cleaver", "Consensualist", "Osiris", "Scene Queen", "Siren"] as PredatorTypeName[]).map((clan) => createButton(clan, "grape"))}</Stack>
                </Grid.Col>
            </Grid>

            <Divider color="gray" />

            <Grid m={0}>
                <Grid.Col span={4}><h1>Stealth</h1></Grid.Col>
                <Grid.Col offset={isPhoneScreen ? 1 : 0} span={isPhoneScreen ? 6 : 4}>
                    <Stack>{(["Bagger", 'Ferryman', 'Graverobber', "Sandman"] as PredatorTypeName[]).map((clan) => createButton(clan, "gray"))}</Stack>
                </Grid.Col>
            </Grid>

            <Divider color="violet" />

            <Grid m={0}>
                <Grid.Col span={4}><h1>Excluding Mortals</h1></Grid.Col>
                <Grid.Col offset={isPhoneScreen ? 1 : 0} span={isPhoneScreen ? 6 : 4}>
                    <Stack>{(["Farmer",] as PredatorTypeName[]).map((clan) => createButton(clan, "violet"))}</Stack>
                </Grid.Col>
            </Grid>
        </Stack>
    )

    const height = globals.viewportHeightPx
    const heightBreakPoint = 1250
    return (
        <div style={{ width: "100%", marginTop: height < heightBreakPoint ? "50px" : "55px" }}>
            <Text fz={globals.largeFontSize} ta={"center"}>How do you <b>obtain blood?</b></Text>

            <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Predator Type</Text>
            <hr color="#e03131" />
            <Space h={"sm"} />

            {height < heightBreakPoint
                ? <ScrollArea h={height - 230}>
                    {createPredatorTypeStack()}
                </ScrollArea>
                : createPredatorTypeStack()
            }

            {!predatorData ? null :
                <PredatorModal modalOpened={modalOpen} closeModal={handleCloseModal} kindred={kindred} setKindred={setKindred} nextStep={nextStep} pickedPredatorType={pickedPredatorType} predatorData={predatorData} setPredatorData={setPredatorData} />
            }
            <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
                <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
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
                                    nextStep()
                                }}
                                disabled={kindred.predatorType===""}
                            >
                                Next
                            </Button>
                        </Button.Group>

                </Alert>
            </Button.Group>

        </div>
    )
}


export default PredatorTypePicker