import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { ScrollArea, Grid, Card, Text, Button } from "@mantine/core"
import { Loresheet, loresheetFilter } from "../../../data/GoodIntentions/types/V5Loresheets"
import { useState } from "react"

type LoresheetPickerProps = {
    kindred: Kindred,
}

export const LoresheetsPicker = ({ kindred }: LoresheetPickerProps) => {
    let loresheets = loresheetFilter(kindred)

    console.log(loresheets)

    const [openLoresheetTitle, setOpenLoresheetTitle] = useState("")
    const openLoresheet = loresheets.find((sheet: Loresheet) => sheet.name === openLoresheetTitle)


    const getLoresheetCol = (loresheet: Loresheet) => {

        return (
            <Grid.Col>
                <Card
                    mb={20}
                    h={350}
                    style={{ backgroundColor: "rgba(26, 27, 30, 0.90)", borderColor: "black" }}
                    withBorder
                >
                    <Text mb={10} ta={"center"} fz={globals.isSmallScreen ? "lg" : "xl"} weight={500}>
                        {loresheet.name}
                    </Text>
                    <Text fz={"sm"}>{loresheet.description}</Text>
                    <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                        <Button variant="light" color="blue" fullWidth radius="md" onClick={() => setOpenLoresheetTitle(loresheet.name)}>
                            Open
                        </Button>
                    </div>
                </Card>
            </Grid.Col>
        )

    }

    const height = globals.viewportHeightPx
    return (
        <ScrollArea h={height - 330} w={"100%"} p={20}>
            <Grid w={"100%"}>
                {openLoresheet ? (
                    <OpenedLoresheet
                        loresheet={openLoresheet}
                        setOpenLoresheetTitle={setOpenLoresheetTitle}
                    />
                ) : (
                    loresheets.map(getLoresheetCol)
                )}
            </Grid>
        </ScrollArea>
    )
}

const OpenedLoresheet = ({
    loresheet,
    setOpenLoresheetTitle,
}: {
    loresheet: Loresheet
    setOpenLoresheetTitle: (t: string) => void
}) => {
    return (
        <div style={{ padding: "20px" }}>
            <Text ta={"center"} fz={globals.largeFontSize}>
                {loresheet.name}
            </Text>
            {loresheet.benefits.map((benefit) => {

                return (
                    <Card>
                        <Text fz={"sm"}>{benefit.description}</Text>
                    </Card>
                )
            })}


            <Button variant="outline" color="yellow" mt={35} onClick={() => setOpenLoresheetTitle("")}>
                Back
            </Button>
        </div>
    )
}


export default LoresheetsPicker