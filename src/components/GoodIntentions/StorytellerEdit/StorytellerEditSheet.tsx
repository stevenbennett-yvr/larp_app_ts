import { Center, Stack } from "@mantine/core"

import V5AttributeStInputs from "./StAttributes"

import { Kindred } from "../../../data/GoodIntentions/types/Kindred"

type StorytellerEditSheetProps = {
    kindred:Kindred;
    setKindred: (kindred:Kindred) => void;
}

const StorytellerEditSheet = ({kindred, setKindred}: StorytellerEditSheetProps) => {

    return (
        <Center>
            <Stack>
                <V5AttributeStInputs kindred={kindred} setKindred={setKindred}/>
            </Stack>
        </Center>
    )
}

export default StorytellerEditSheet