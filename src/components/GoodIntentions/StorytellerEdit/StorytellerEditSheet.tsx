import { Center, Stack } from "@mantine/core"

import V5AttributeStInputs from "./V5AttributeStInputs"
import V5SkillStInputs from './V5SkillStInputs'
import V5DisciplineStInputs from "./V5DisciplineStInputs"

import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import PowerAccordion from "../Inputs/PowerAccordion"

type StorytellerEditSheetProps = {
    kindred:Kindred;
    setKindred: (kindred:Kindred) => void;
    venueData: GoodIntentionsVenueStyleSheet
}

const StorytellerEditSheet = ({kindred, setKindred, venueData}: StorytellerEditSheetProps) => {

    return (
        <Center>
            <Stack>
                <V5AttributeStInputs kindred={kindred} setKindred={setKindred}/>
                <V5SkillStInputs kindred={kindred} setKindred={setKindred} />
                <V5DisciplineStInputs kindred={kindred} setKindred={setKindred} />
                <PowerAccordion kindred={kindred} setKindred={setKindred} type="creationPoints" venueData={venueData} />
            </Stack>
        </Center>
    )
}

export default StorytellerEditSheet