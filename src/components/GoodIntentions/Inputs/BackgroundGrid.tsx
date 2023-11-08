import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Spheres } from "../../../data/GoodIntentions/types/V5Spheres";
import { v5BackgroundLevel, V5BackgroundRef, backgroundData, kindredBackgrounds } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { Text, Grid, Card, Center, Stack, SimpleGrid, Tooltip } from "@mantine/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type BackgroundGridProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    setModalBackground: (modalBackground: V5BackgroundRef | null) => void
    setModalOpen: (modalOpen: boolean) => void
}

const BackgroundGrid = ({ kindred, setModalBackground, setModalOpen }: BackgroundGridProps) => {

    const createBackgroundPick = (bRef: V5BackgroundRef) => {
        const backgroundInfo = backgroundData.find((entry) => entry.name === bRef.name)
        if (!backgroundInfo) { return null }
        return (
            <Grid.Col key={bRef.id} span={4}>
                <Card className="hoverCard" shadow="sm" padding="lg" radius="md" h={200} style={{ cursor: "pointer" }}
                    onClick={() => {
                        setModalBackground(bRef);
                        setModalOpen(true);
                    }}
                >
                    <Center>
                        <SimpleGrid cols={bRef.sphere && bRef.sphere.length > 0 ?3:1}>
                            {bRef.sphere && bRef.sphere.length > 0 ?
                                <Stack justify="flex-start" align="flex-start" spacing={3}>
                                    <Text size="xs">Spheres:</Text>
                                    {bRef.sphere.map((s) => (
                                        <Tooltip label={s} color="gray" withArrow>
                                            <FontAwesomeIcon icon={Spheres[s].symbol} style={{ color: "#e03131" }} />
                                        </Tooltip>
                                    ))}
                                </Stack>
                                : <></>}
                            <FontAwesomeIcon size="4x" icon={backgroundInfo.icon} style={{ color: "#e03131" }} />
                            <></>
                        </SimpleGrid>
                    </Center>

                    <Center>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>{bRef.name} Level {v5BackgroundLevel(bRef).level}</Text>

                    </Center>

                    <Text h={55} size="sm" color="dimmed" ta="center">
                        {backgroundInfo?.summary}
                    </Text>
                </Card>
            </Grid.Col>
        )
    }

    const ownedBackgrounds = kindredBackgrounds(kindred)

    return (
        <Stack mt={"xl"} align="center" spacing="xl">

            <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Owned Backgrounds</Text>
            <Grid grow m={0}>
                {
                    ownedBackgrounds.map((bRef) => createBackgroundPick(bRef))
                }
            </Grid>

        </Stack>
    )
}

export default BackgroundGrid