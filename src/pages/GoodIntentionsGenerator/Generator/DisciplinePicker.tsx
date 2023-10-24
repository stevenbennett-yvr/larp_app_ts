import { Text, Center, Stack, Alert, Group, Button } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { v5DisciplineLevel, DisciplineKey } from "../../../data/GoodIntentions/types/V5Disciplines"
import { allPowers } from "../../../data/GoodIntentions/types/V5Powers"
import { useState } from "react"
import RitualsModal from "./RitualModal"
import DisciplineGrid from "../../../components/GoodIntentions/Inputs/DisciplineGrid"
import PowerAccordion from "../../../components/GoodIntentions/Inputs/PowerAccordion"
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type DisciplinesPickerProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
    nextStep: () => void;
    backStep: () => void;
    venueData: GoodIntentionsVenueStyleSheet;
}

const DisciplinesPicker = ({ kindred, setKindred, nextStep, backStep, venueData }: DisciplinesPickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setKindred({
            ...kindred,
            rituals: [],
            ceremonies: [],
        })
        setModalOpen(false);
    };

    // Rote Accordion

    const knownDisciplines = Object.keys(kindred.disciplines).filter((disciplineKey) => {
        const discipline = kindred.disciplines[disciplineKey as DisciplineKey]
        return discipline.creationPoints > 0;
    })

    const getSelectedPowers = (kindred: Kindred, discipline: DisciplineKey) => {
        return kindred.powers.filter((power) => {
            const matchingPower = allPowers.find((p) => power.name === p.name);
            return matchingPower?.discipline === discipline;
        });
    };

    const disciplinePowersSelected = (kindred: Kindred, discipline: DisciplineKey, type:TypeCategory) => {
        const selectedPowers = getSelectedPowers(kindred, discipline);
        return type==="experiencePoints"? (selectedPowers.length < v5DisciplineLevel(kindred, discipline).level):(kindred.disciplines[discipline].creationPoints > selectedPowers.length)
    };

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

                <DisciplineGrid kindred={kindred} setKindred={setKindred} />

                <PowerAccordion kindred={kindred} setKindred={setKindred} venueData={venueData} type="creationPoints" />

            </Stack>

            <RitualsModal modalOpened={modalOpen} closeModal={handleCloseModal} venueData={venueData} kindred={kindred} setKindred={setKindred} nextStep={nextStep} />

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
                                if (kindred.disciplines["blood sorcery"].creationPoints === 0 && kindred.disciplines["oblivion"].creationPoints === 0) { nextStep() } else { setModalOpen(true) }
                            }}
                            disabled={(knownDisciplines as DisciplineKey[]).some((d) => disciplinePowersSelected(kindred, d, "creationPoints"))}
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