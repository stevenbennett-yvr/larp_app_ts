import { useState } from "react"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Grid, Stack } from "@mantine/core"
import { loresheetFilter, Loresheet } from "../../../data/GoodIntentions/types/V5Loresheets"
import LoresheetGrid from "./LoresheetGrid"
import LoresheetCard from "./LoresheetCard"
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type LoresheetInputsProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    type: TypeCategory
    venueData: GoodIntentionsVenueStyleSheet
}

const LoresheetInputs = ({ kindred, setKindred, type, venueData }: LoresheetInputsProps) => {
    let loresheets = loresheetFilter(kindred)

    const [openLoresheetTitle, setOpenLoresheetTitle] = useState(kindred.loresheet.name)
    const openLoresheet = loresheets.find((sheet: Loresheet) => sheet.name === openLoresheetTitle)

    return (
        <Stack mt={"xl"} align="center" spacing="xl">

                <Grid w={"100%"}>
                    {openLoresheet ?
                        <LoresheetCard
                            key={openLoresheet.name}
                            loresheet={openLoresheet}
                            setOpenLoresheetTitle={setOpenLoresheetTitle}
                            kindred={kindred}
                            setKindred={setKindred}
                            type={type}
                        />
                        :
                        <LoresheetGrid kindred={kindred} setOpenLoresheetTitle={setOpenLoresheetTitle} venueData={venueData} />
                    }
                </Grid>
        </Stack>
    )
}

export default LoresheetInputs