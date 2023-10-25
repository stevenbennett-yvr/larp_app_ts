import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Grid, Card, Text, Button } from "@mantine/core"
import { Loresheet, loresheetFilter } from "../../../data/GoodIntentions/types/V5Loresheets"
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type LoresheetGridProps = {
    kindred: Kindred
    setOpenLoresheetTitle: (title:string) => void
    venueData: GoodIntentionsVenueStyleSheet
}

export const LoresheetGrid = ({ kindred, setOpenLoresheetTitle, venueData }: LoresheetGridProps) => {
    let { bannedLoresheets } = venueData.goodIntentionsVariables
    let loresheets = loresheetFilter(kindred)

    const getLoresheetCol = (loresheet: Loresheet) => {

        if (bannedLoresheets.includes(loresheet.name)) {return null}

        return (
            <Grid.Col key={loresheet.name}>
                <Card
                    mb={20}
                    h={globals.isPhoneScreen?550:350}
                    style={{ backgroundColor: "rgba(26, 27, 30, 0.90)", borderColor: "black" }}
                    withBorder
                >
                    <Text mb={10} ta={"center"} fz={globals.isSmallScreen ? "lg" : "xl"} weight={500}>
                        {loresheet.name}
                    </Text>
                    <Text fz={"sm"}>{loresheet.description}</Text>
                    <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                        <Button disabled={kindred.loresheet.name !== "" && kindred.loresheet.name !== loresheet.name ? true : false} variant="light" color="blue" fullWidth radius="md" onClick={() => setOpenLoresheetTitle(loresheet.name)}>
                            Open
                        </Button>
                    </div>
                </Card>
            </Grid.Col>
        )
    }

    return (
        <div>
            {
                loresheets.map(getLoresheetCol)
            }
        </div>
    )
}


export default LoresheetGrid