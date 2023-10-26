import { Button, Divider, Grid, Stack, Tooltip, Text } from "@mantine/core"
import { PredatorTypes, PredatorTypeName, PredatorType } from "../../../data/GoodIntentions/types/V5PredatorType"
import { globals } from "../../../assets/globals"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"

type PredatorGridProps = {
    kindred: Kindred,
    setPickedPredatorType: (predatorTypeName: PredatorTypeName) => void
    setModalOpen: (opened: boolean) => void
    setPredatorData: (predatorData: PredatorType) => void
    venueData: GoodIntentionsVenueStyleSheet
}

const PredatorGrid = ({ kindred, setPickedPredatorType, setModalOpen, setPredatorData, venueData }: PredatorGridProps) => {
    const isPhoneScreen = globals.isPhoneScreen

    const isVentrue = kindred.clan === "Ventrue" ? true : false
    const isThinblood = kindred.clan === "Thin-Blood" ? true : false
    const { bannedPredatorTypes } = venueData.goodIntentionsVariables

    const createButton = (predatorTypeName: PredatorTypeName, color: string) => {

        const meritsAndFlaws = PredatorTypes[predatorTypeName].meritsAndFlaws;
        const ventrueMeritNamesToCheck = ["Iron Gullet", "Farmer", "Prey Exclusion"];
        const ventrueHasDesiredMerits = meritsAndFlaws.some(merit => ventrueMeritNamesToCheck.includes(merit.name));
        const thinbloodAdvantageToCheck = "Retainer"
        const thinbloodHasDesiredAdvantage = PredatorTypes[predatorTypeName].backgrounds.some(background => background.advantages.some(advantage => thinbloodAdvantageToCheck.includes(advantage.name)))

        const isBanned = bannedPredatorTypes.includes(predatorTypeName)
        const disabled = isBanned || (isVentrue && ventrueHasDesiredMerits) || (isThinblood && thinbloodHasDesiredAdvantage)

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

    return (
        <Stack spacing="xl">

            <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Predator Type</Text>
            {isVentrue||isThinblood?
            <Text ta="center">If greyed out the option is unavailable to your character</Text>
            :<></>}
            <Divider color="#e03131" />

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
                    <Stack>{(["Cleaver", "Consentualist", "Osiris", "Scene Queen", "Siren"] as PredatorTypeName[]).map((clan) => createButton(clan, "grape"))}</Stack>
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
}


export default PredatorGrid