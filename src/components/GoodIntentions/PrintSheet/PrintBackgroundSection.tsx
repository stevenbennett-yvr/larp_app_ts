import { Grid, Card, Table, Text, Stack, List, Divider, Center } from "@mantine/core"

import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { kindredBackgrounds, V5BackgroundRef, backgroundData, v5BackgroundLevel, v5AdvantageLevel } from "../../../data/GoodIntentions/types/V5Backgrounds"

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

const BackgroundSection = ({kindred}:PrintSheetProps) => {
    const sortedBackgrounds = kindredBackgrounds(kindred)

    const backgroundCard = (background: V5BackgroundRef) => {
        const backgroundInfo = backgroundData.find((b) => b.name === background.name)
        if (!backgroundInfo) { return null }
        return (
            <Grid.Col span={3} key={background.id}>
                <Center>
                <Card w={200}>
                    <Table>
                        <thead>
                            <tr>
                                <td>
                                    {backgroundInfo.name} {v5BackgroundLevel(background).level}
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {background.advantages.map((advantage) => {
                                if (!backgroundInfo.advantages || v5AdvantageLevel(advantage).level < 1) { return null }
                                const advantageInfo = backgroundInfo.advantages.find((a) => a.name === advantage.name)
                                const icon = advantageInfo?.type === "disadvantage" ? flawIcon() : meritIcon()
                                return (
                                    <tr key={advantage.name}>
                                        <td>
                                            <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(advantage).level}</Text>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Card>
                </Center>
            </Grid.Col>
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
            <Grid columns={globals.isPhoneScreen ? 3 : 9}>
                <Grid.Col w={300} span={3}>
                    {
                        loresheetCard()
                    }
                </Grid.Col>

                    {
                        sortedBackgrounds.map((b) => backgroundCard(b))
                    }

            </Grid>
            </Stack>
        </Center>

    )

}

export default BackgroundSection