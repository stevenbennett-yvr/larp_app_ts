import { Card, Table, Text, Stack, List, Divider, Center, SimpleGrid, Group } from "@mantine/core"

import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { kindredBackgrounds, V5BackgroundRef, backgroundData, v5BackgroundLevel, v5AdvantageLevel } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { Spheres } from "../../../data/GoodIntentions/types/V5Spheres";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons";
import { globals } from "../../../assets/globals";

type PrintSheetProps = {
    kindred: Kindred,
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

const BackgroundSection = ({ kindred }: PrintSheetProps) => {
    const sortedBackgrounds = kindredBackgrounds(kindred)

    const backgroundCard = (background: V5BackgroundRef) => {
        const backgroundInfo = backgroundData.find((b) => b.name === background.name)
        if (!backgroundInfo) { return null }
        return (
            <Card w={200}>
                <Table>
                    <thead>
                        <tr>
                            <td>
                                <Group>
                                    <FontAwesomeIcon icon={backgroundInfo.icon} style={{ color: "#e03131" }} />
                                    {backgroundInfo.name} {v5BackgroundLevel(background).level}
                                </Group>
                            </td>
                        </tr>
                        {background.sphere && background.sphere.length > 0 ?
                            <tr>
                                <Stack justify="flex-start" align="flex-start" spacing={3}>
                                    <Text size="sm">Spheres:</Text>
                                    <Stack spacing={3}>
                                        {background.sphere.map((s) => (
                                            <Group>
                                            <Text size="xs">{s} </Text>
                                            <FontAwesomeIcon icon={Spheres[s].symbol} style={{ color: "#e03131" }} />
                                            </Group>
                                        ))}
                                    </Stack>
                                </Stack>
                            </tr>
                            : <></>}
                    </thead>
                    <tbody>
                        {background.advantages.map((advantage) => {
                            if (!backgroundInfo.advantages || v5AdvantageLevel(advantage).level < 1) { return null }
                            const advantageInfo = backgroundInfo.advantages.find((a) => a.name === advantage.name)
                            const icon = advantageInfo?.type === "disadvantage" ? flawIcon() : meritIcon()
                            return (
                                <tr key={advantage.name}>
                                    <td>
                                        <Text>{icon} &nbsp;{advantage.name} {v5AdvantageLevel(advantage).level}</Text>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }

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
                    {sortedBackgrounds.map((b) => backgroundCard(b))}
                </SimpleGrid>
            </Stack>
        </Center>

    )

}

export default BackgroundSection