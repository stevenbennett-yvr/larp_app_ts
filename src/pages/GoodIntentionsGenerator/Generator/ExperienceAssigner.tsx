import { Alert, Group, Button, Center, Text, ScrollArea } from '@mantine/core'
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"

import { globals } from '../../../assets/globals'
import { spentExperience } from '../../../data/GoodIntentions/types/V5Experience'

import { GoodIntentionsVenueStyleSheet } from '../../../data/CaM/types/VSS'
import V5XpInputs from '../../../components/GoodIntentions/V5XpInputs'

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


    const height = globals.viewportHeightPx
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: "20px" }}>
            <ScrollArea h={height - 140} pb={20}>
                <V5XpInputs kindred={kindred} setKindred={setKindred} venueData={venueData} />

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