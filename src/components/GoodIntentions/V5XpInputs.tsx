import { Stack, Group, Button, Divider, Center, Space, Tabs } from '@mantine/core'
import { useState } from 'react'

import { v5DisciplineLevel } from '../../data/GoodIntentions/types/V5Disciplines'
import { Kindred } from '../../data/GoodIntentions/types/Kindred'
import { GoodIntentionsVenueStyleSheet } from '../../data/CaM/types/VSS'
import V5AttributeXpInputs from './XpInputs/V5AttributeXpInputs'
import V5SkillXpInputs from './XpInputs/V5SkillXpInputs'
import DisciplineAccordion from './Inputs/DisciplineAccordion'
import PowerAccordion from './Inputs/PowerAccordion'
import V5RitualsXpInputs from './XpInputs/V5RitualsXpInputs'
import V5CeremoniesXpInputs from './XpInputs/V5CeremonyXpInputs'
import V5FormulaeXpInputs from './XpInputs/V5FormulaeXpInputs'
import BackgroundFull from './Inputs/BackgroundFull'
import LoresheetInputs from './Inputs/LoresheetPicker'
import V5BloodPotenceXpInput from './XpInputs/V5BloodPotenceXpInputs'
import MeritBuy from './Inputs/MeritsBuy'
import MeritsGrid from './Inputs/MeritsGrid'

type V5ExperienceAssignerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    venueData: GoodIntentionsVenueStyleSheet
}

const V5XpInputs = ({ kindred, setKindred, venueData }: V5ExperienceAssignerProps) => {

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

    return (
        <Stack>
            <V5AttributeXpInputs kindred={kindred} setKindred={setKindred} />
            <Divider my="sm" />
            <V5SkillXpInputs kindred={kindred} setKindred={setKindred} />
            <Divider my="sm" />
            <DisciplineAccordion kindred={kindred} setKindred={setKindred} />
            <PowerAccordion kindred={kindred} setKindred={setKindred} venueData={venueData} type='experiencePoints' />
            <V5RitualsXpInputs kindred={kindred} setKindred={setKindred} venueData={venueData} modalOpened={ritualModalOpen} closeModal={closeRitualsModal} />
            <V5CeremoniesXpInputs kindred={kindred} setKindred={setKindred} venueData={venueData} modalOpened={ceremonyModalOpen} closeModal={closeCeremoniesModal} />
            <V5FormulaeXpInputs kindred={kindred} setKindred={setKindred} modalOpened={formulaModalOpen} closeModal={closeFormulaModal} venueData={venueData} />

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
        </Stack>

    )
}

export default V5XpInputs