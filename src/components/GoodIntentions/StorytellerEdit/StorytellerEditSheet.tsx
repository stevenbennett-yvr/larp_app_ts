import { Center, SimpleGrid, Stack } from "@mantine/core"
import { globals } from "../../../assets/globals"

import V5AttributeStInputs from "./V5AttributeStInputs"
import V5SkillStInputs from './V5SkillStInputs'
import V5DisciplineStInputs from "./V5DisciplineStInputs"
import BackgroundStInput from "./V5BackgroundStInputs"

import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import PowerAccordion from "../Inputs/PowerAccordion"

type StorytellerEditSheetProps = {
    kindred:Kindred;
    setKindred: (kindred:Kindred) => void;
    venueData: GoodIntentionsVenueStyleSheet
}

const StorytellerEditSheet = ({kindred, setKindred, venueData}: StorytellerEditSheetProps) => {

    const isPhoneScreen = globals.isPhoneScreen

    return (
        <Center>
            <Stack>
                <V5AttributeStInputs kindred={kindred} setKindred={setKindred}/>
                <V5SkillStInputs kindred={kindred} setKindred={setKindred} />
                <SimpleGrid cols={isPhoneScreen?1:2}>
                <V5DisciplineStInputs kindred={kindred} setKindred={setKindred} />
                <PowerAccordion kindred={kindred} setKindred={setKindred} type="creationPoints" venueData={venueData} />
                </SimpleGrid>
                <BackgroundStInput kindred={kindred} setKindred={setKindred} />
            </Stack>
        </Center>
    )
}

export default StorytellerEditSheet