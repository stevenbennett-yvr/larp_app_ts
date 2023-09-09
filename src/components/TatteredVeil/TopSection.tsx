import { globals } from "../../assets/globals"
import { Grid, Stack, Text, Center, Avatar, Image } from "@mantine/core"

import { Awakened } from "../../data/TatteredVeil/types/Awakened"
import { Paths } from "../../data/TatteredVeil/types/Path"
import { Orders } from "../../data/TatteredVeil/types/Order"

type TopSectionProps = {
    awakened: Awakened
}

export const TopSection = ({ awakened }: TopSectionProps) => {
    return (
        <Grid columns={globals.isPhoneScreen ? 3 : 9}>
            <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                <Center>
                    <Avatar
                        src={awakened.background.profilePic}
                        size={100}
                        style={{
                            backgroundImage: `linear-gradient(to bottom right, ${Paths[awakened.path].color}, ${Orders[awakened.order].color})`,
                        }}
                    />
                </Center>
            </Grid.Col>
            <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                <Stack align="center">
                    <Text fz="sm">Shadow Name: {awakened.name}</Text>
                    <Text fz="sm">Concept: {awakened.concept}</Text>
                    <Text fz="sm">Order: {awakened.order}</Text>
                    <Image
                        fit="contain"
                        height={40}
                        width={40}
                        src={Orders[awakened.order].rune}
                        style={{
                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                        }}
                    />
                </Stack>
            </Grid.Col>
            <Grid.Col span={3} >
                <Stack align="center">
                    <Text fz="sm">Virtue: {awakened.virtue}</Text>
                    <Text fz="sm">Vice: {awakened.vice}</Text>
                    <Text fz="sm">Path: {awakened.path}</Text>
                    <Image
                        fit="contain"
                        height={40}
                        width={40}
                        src={Paths[awakened.path].rune}
                        style={{
                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                        }}
                    />
                </Stack>
            </Grid.Col>
        </Grid>
    )
}