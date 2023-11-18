import { Card, Table, Text, Stack, Group } from "@mantine/core"

import { Spheres } from "../../../data/GoodIntentions/types/V5Spheres";
import { V5BackgroundRef, backgroundData, v5BackgroundLevel, v5AdvantageLevel } from "../../../data/GoodIntentions/types/V5Backgrounds";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons";

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

type BackgroundCardProps = {
    background: V5BackgroundRef
}

const BackgroundCard = ({background}:BackgroundCardProps) => {
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

export default BackgroundCard