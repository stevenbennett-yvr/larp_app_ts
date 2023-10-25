import { Alert, Stack, Group, Button, Divider, Center, Text, Space, ScrollArea, Tabs } from '@mantine/core'
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { useState } from 'react'

import V5AttributeXpInputs from '../../../components/GoodIntentions/XpInputs/V5AttributeXpInputs'
import V5SkillXpInputs from '../../../components/GoodIntentions/XpInputs/V5SkillXpInputs'
import V5RitualsXpInputs from '../../../components/GoodIntentions/XpInputs/V5RitualsXpInputs'
import V5CeremoniesXpInputs from '../../../components/GoodIntentions/XpInputs/V5CeremonyXpInputs'
import V5BloodPotenceXpInput from '../../../components/GoodIntentions/XpInputs/V5BloodPotenceXpInputs'
import V5HumanityXpInput from '../../../components/GoodIntentions/XpInputs/V5HumanityXpInputs'
import V5FormulaeXpInputs from '../../../components/GoodIntentions/XpInputs/V5FormulaeXpInputs'

import { globals } from '../../../assets/globals'
import { v5DisciplineLevel } from '../../../data/GoodIntentions/types/V5Disciplines'
import { spentExperience } from '../../../data/GoodIntentions/types/V5Experience'
import BackgroundFull from '../../../components/GoodIntentions/Inputs/BackgroundFull'
import LoresheetInputs from '../../../components/GoodIntentions/Inputs/LoresheetPicker'
import MeritsGrid from '../../../components/GoodIntentions/Inputs/MeritsGrid'
import MeritBuy from '../../../components/GoodIntentions/Inputs/MeritsBuy'
import DisciplineAccordion from '../../../components/GoodIntentions/Inputs/DisciplineAccordion'
import PowerAccordion from '../../../components/GoodIntentions/Inputs/PowerAccordion'
import { GoodIntentionsVenueStyleSheet } from '../../../data/CaM/types/VSS'

type V5ExperienceAssignerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
    venueData: GoodIntentionsVenueStyleSheet
}

const V5ExperienceAssigner = ({ kindred, setKindred, nextStep, backStep, venueData }: V5ExperienceAssignerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const [ritualModalOpen, setRitualModalOpen] = useState(false);
    const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);
    const [formulaModalOpen, setFormulaModalOpen] = useState(false);

    const openRitualsModal = () => {
        setRitualModalOpen(true)
    };

    const closeRitualsModal = () => {
        setRitualModalOpen(false)
    };

    const openCeremoniesModal = () => {
        setCeremonyModalOpen(true)
    };

    const closeCeremoniesModal = () => {
        setCeremonyModalOpen(false)
    };

    const openFormulaModal = () => {
        setFormulaModalOpen(true)
    };

    const closeFormulaModal = () => {
        setFormulaModalOpen(false)
    };

    const height = globals.viewportHeightPx
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: "20px" }}>
            <ScrollArea h={height - 140} pb={20}>
                <V5AttributeXpInputs kindred={kindred} setKindred={setKindred} />
                <Divider my="sm" />
                <V5SkillXpInputs kindred={kindred} setKindred={setKindred} />
                <Divider my="sm" />
                <DisciplineAccordion kindred={kindred} setKindred={setKindred} />
                <PowerAccordion kindred={kindred} setKindred={setKindred} venueData={venueData} type='experiencePoints' />
                <V5RitualsXpInputs kindred={kindred} setKindred={setKindred} venueData={venueData} modalOpened={ritualModalOpen} closeModal={closeRitualsModal} />
                <V5CeremoniesXpInputs kindred={kindred} setKindred={setKindred} venueData={venueData} modalOpened={ceremonyModalOpen} closeModal={closeCeremoniesModal} />
                <V5FormulaeXpInputs kindred={kindred} setKindred={setKindred} modalOpened={formulaModalOpen} closeModal={closeFormulaModal} />

                <Space h="md" />
                <Center>
                    <Group>
                        {v5DisciplineLevel(kindred, 'blood sorcery').level > 0 ?
                            <Button color={"gray"} onClick={openRitualsModal}>Get Rituals</Button>
                            :
                            <></>
                        }
                        {v5DisciplineLevel(kindred, 'oblivion').level > 0 ?
                            <Button color={"gray"} onClick={openCeremoniesModal}>Get Ceremonies</Button>
                            :
                            <></>
                        }
                        {v5DisciplineLevel(kindred, 'thin-blood alchemy').level > 0 ?
                            <Button color={"gray"} onClick={openFormulaModal}>Get Formulae</Button>
                            :
                            <></>
                        }
                    </Group>
                </Center>
                <Divider my="sm" />

                <Tabs defaultValue="backgrounds">
                    <Tabs.List grow>
                        <Tabs.Tab value="backgrounds">
                            Backgrounds
                        </Tabs.Tab>
                        <Tabs.Tab value="loresheet" >
                            Loresheets
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="backgrounds">
                        <BackgroundFull kindred={kindred} setKindred={setKindred} type='experiencePoints' />
                    </Tabs.Panel>

                    <Tabs.Panel value="loresheet">
                        <LoresheetInputs kindred={kindred} setKindred={setKindred} venueData={venueData} type='experiencePoints' />
                    </Tabs.Panel>

                </Tabs>

                <Divider my="sm" />

                <Center>
                    <Stack>
                    <MeritBuy kindred={kindred} setKindred={setKindred} venueData={venueData} />
                    <MeritsGrid kindred={kindred} setKindred={setKindred} venueData={venueData} type="experiencePoints" />
                    </Stack>
                </Center>
                <Divider my="sm" />

                <V5BloodPotenceXpInput kindred={kindred} setKindred={setKindred} />
                <Divider my="sm" />

                <V5HumanityXpInput kindred={kindred} setKindred={setKindred} />

                <Alert color="dark" variant="filled" radius="xs" style={{ zIndex: 9999, padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
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
                                    nextStep()
                                }}
                                disabled={6 < 50 - spentExperience(kindred)}
                            >
                                Next
                            </Button>
                            <Text fz={globals.smallerFontSize} style={{ margin: "10px" }} color={0 > 50 - spentExperience(kindred) ? "red" : "white"}>Remaining Experience: {50 - spentExperience(kindred)}</Text>

                        </Button.Group>
                    </Group>
                </Alert>
            </ScrollArea>
        </Center>
    )
}

export default V5ExperienceAssigner