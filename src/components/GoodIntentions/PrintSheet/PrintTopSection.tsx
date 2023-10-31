import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Center, Stack, Grid, Text, Avatar } from "@mantine/core"
import { generations } from "../../../data/GoodIntentions/types/V5Generation"
import { globals } from "../../../assets/globals"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";



type PrintSheetProps = {
    kindred: Kindred,
    venueData: GoodIntentionsVenueStyleSheet
}

const TopSection = ({ kindred, venueData }: PrintSheetProps) => {
    const name = kindred.name
    const concept = kindred.concept
    const clan = kindred.clan
    const venueName = venueData.venueStyleSheet.name
    const generation = generations[kindred.generation].generation
    const predatorType = kindred.predatorType

    return (
        <Center>
            <Stack>
            <Grid grow columns={globals.isPhoneScreen ? 4 : 12}>
                    <Grid.Col span={4} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                        <Center style={{ height: "100%" }}>
                            {kindred.backstory.profilePic === "" ?
                                <FontAwesomeIcon icon={faUser} className="fa-6x" />
                                :
                                <Avatar
                                    src={kindred.backstory.profilePic}
                                    size={100}
                                />
                            }
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={4} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                        <Stack align="center">
                            <Text fz="sm">Name: {name}</Text>
                            <Text fz="sm">Concept: {concept}</Text>
                            <Text fz="sm">Venue: {venueName}</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4} w={300}>
                        <Stack align="center">
                            <Text fz="sm">Clan: {clan}</Text>
                            <Text fz="sm">Generation: {generation}</Text>
                            <Text fz="sm">Predator Type: {predatorType}</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Center>
    )
}

export default TopSection