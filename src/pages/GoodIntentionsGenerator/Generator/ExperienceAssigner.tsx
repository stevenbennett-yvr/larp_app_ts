import {  Alert, Group, Button, Divider, Center, Text } from '@mantine/core'
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { useState } from 'react'

import V5AttributeXpInputs from '../../../components/GoodIntentions/XpInputs/V5AttributeXpInputs'
import V5SkillXpInputs from '../../../components/GoodIntentions/XpInputs/V5SkillXpInputs'
import V5DisciplineXpInputs from '../../../components/GoodIntentions/XpInputs/V5DisciplineXpInputs'
import V5PowersInputs from '../../../components/GoodIntentions/XpInputs/V5PowersInputs'
import V5RitualsXpInputs from '../../../components/GoodIntentions/XpInputs/V5RitualsXpInputs'
import V5CeremoniesXpInputs from '../../../components/GoodIntentions/XpInputs/V5CeremonyXpInputs'
import V5BackgroundXpInput from '../../../components/GoodIntentions/XpInputs/V5BackgroundXpInputs'
import V5MeritFlawInputs from '../../../components/GoodIntentions/XpInputs/V5MeritFlawInputs'
import V5BloodPotenceXpInput from '../../../components/GoodIntentions/XpInputs/V5BloodPotenceXpInputs'
import V5HumanityXpInput from '../../../components/GoodIntentions/XpInputs/V5HumanityXpInputs'

import { globals } from '../../../assets/globals'
import { v5DisciplineLevel } from '../../../data/GoodIntentions/types/V5Disciplines'
import { spentExperience } from '../../../data/GoodIntentions/types/V5Experience'

type V5ExperienceAssignerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const V5ExperienceAssigner = ({ kindred, setKindred, nextStep, backStep }: V5ExperienceAssignerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const [ritualModalOpen, setRitualModalOpen] = useState(false);
    const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);

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

    const height = globals.viewportHeightPx
    const heightBreakPoint = 1250
    return (
        <div style={{ width: "100%", marginTop: height < heightBreakPoint ? "50px" : "55px", marginBottom: height < heightBreakPoint ? "50px" : "55px" }}>

                <V5AttributeXpInputs kindred={kindred} setKindred={setKindred} />
                <Divider my="sm"/>
                <V5SkillXpInputs kindred={kindred} setKindred={setKindred} />
                <Divider my="sm"/>
                <V5DisciplineXpInputs kindred={kindred} setKindred={setKindred}></V5DisciplineXpInputs>
                <V5PowersInputs kindred={kindred} setKindred={setKindred} />
                <Divider my="sm"/>

                <V5RitualsXpInputs kindred={kindred} setKindred={setKindred} modalOpened={ritualModalOpen} closeModal={closeRitualsModal} />    
                <V5CeremoniesXpInputs kindred={kindred} setKindred={setKindred} modalOpened={ceremonyModalOpen} closeModal={closeCeremoniesModal} />    
                                
                <Center>
                <Group>
                    {v5DisciplineLevel(kindred, 'blood sorcery').level > 0?
                    <Button color={"gray"} onClick={openRitualsModal}>Get Rituals</Button>
                    :
                    <></>
                }
                {v5DisciplineLevel(kindred, 'oblivion').level > 0?
                    <Button color={"gray"} onClick={openCeremoniesModal}>Get Ceremonies</Button>
                    :
                    <></>
                }
                </Group>
                </Center>
                <Divider my="sm"/>

                <V5BackgroundXpInput kindred={kindred} setKindred={setKindred} />
                <Divider my="sm"/>

                <V5MeritFlawInputs kindred={kindred} setKindred={setKindred} />
                <Divider my="sm"/>

                <V5BloodPotenceXpInput kindred={kindred} setKindred={setKindred} />
                <Divider my="sm"/>

                <V5HumanityXpInput kindred={kindred} setKindred={setKindred} />

                <Alert color="dark" variant="filled" radius="xs" style={{ zIndex:9999, padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
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
                            <Text fz={globals.smallerFontSize} style={{ margin: "10px" }} color={0 > 50 - spentExperience(kindred)? "red" : "white"}>Remaining Experience: {50 - spentExperience(kindred)}</Text>

                        </Button.Group>
                    </Group>
                </Alert>

        </div>
    )
}

export default V5ExperienceAssigner