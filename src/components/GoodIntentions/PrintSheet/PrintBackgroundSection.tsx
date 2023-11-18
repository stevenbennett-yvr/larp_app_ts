import { Card, Text, Stack, List, Divider, Center, SimpleGrid } from "@mantine/core"

import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { kindredBackgrounds } from "../../../data/GoodIntentions/types/V5Backgrounds"

import BackgroundCard from "../Cards/BackgroundCard";

import { globals } from "../../../assets/globals";

type PrintSheetProps = {
    kindred: Kindred,
}



const BackgroundSection = ({ kindred }: PrintSheetProps) => {
    const sortedBackgrounds = kindredBackgrounds(kindred)

    const loresheetCard = () => {
        return (
            <Center>
                <Card w={200}>
                    {
                        kindred.loresheet.benefits.length > 0 ?
                            <Stack>
                                <Text><b>Loresheet:</b> {kindred.loresheet.name}</Text>
                                <List>
                                    {kindred.loresheet.benefits.map((benefit) => {
                                        return (
                                            <List.Item key={benefit.name}>
                                                <Text>{benefit.name}</Text>
                                            </List.Item>
                                        )
                                    })}
                                </List>
                            </Stack>
                            : <></>
                    }
                </Card>
            </Center>
        )
    }

    return (
        <Center>
            <Stack>
                <Divider my="sm" label="Backgrounds" labelPosition="center" />
                <SimpleGrid cols={globals.isPhoneScreen ? 1 : 3}>
                    {loresheetCard()}
                    {sortedBackgrounds.map((b) => <BackgroundCard background={b} />)}
                </SimpleGrid>
            </Stack>
        </Center>

    )

}

export default BackgroundSection