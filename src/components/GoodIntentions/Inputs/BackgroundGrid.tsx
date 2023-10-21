import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { v5BackgroundLevel, V5BackgroundRef, backgroundData, kindredBackgrounds } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { Text, Grid, Card, Center, Stack, Divider } from "@mantine/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup, faCat, faAddressBook, faFaceGrinStars, faHouseChimney, faCow, faMasksTheater, faCoins } from "@fortawesome/free-solid-svg-icons"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type BackgroundGridProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    setModalBackground: (modalBackground:V5BackgroundRef|null) => void
    setModalOpen: (modalOpen: boolean) => void
}

const BackgroundGrid = ({ kindred, setModalBackground, setModalOpen }: BackgroundGridProps) => {

    const getIcon = (name: string) => {
        if (name === "Allies") {
            return faUserGroup
        }
        if (name === "Familiar") {
            return faCat
        }
        if (name === "Contacts") {
            return faAddressBook
        }
        if (name === "Fame") {
            return faFaceGrinStars
        }
        if (name === "Haven") {
            return faHouseChimney
        }
        if (name === "Herd") {
            return faCow
        }
        if (name === "Mask") {
            return faMasksTheater
        }
        if (name === "Resources") {
            return faCoins
        }
    }

    const createBackgroundPick = (bRef: V5BackgroundRef) => {
        const backgroundInfo = backgroundData.find((entry) => entry.name === bRef.name)
        const icon = getIcon(bRef.name)
        if (!backgroundInfo || !icon) { return null }
        return (
            <Grid.Col key={bRef.id} span={4}>
                <Card className="hoverCard" shadow="sm" padding="lg" radius="md" h={200} style={{ cursor: "pointer" }}
                    onClick={() => {
                        setModalBackground(bRef);
                        setModalOpen(true);
                    }}
                >
                    <Center pt={10}>
                        <FontAwesomeIcon size="4x" icon={icon} style={{ color: "#e03131" }} />
                    </Center>

                    <Center>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>{bRef.name} Level {v5BackgroundLevel(bRef).level} {bRef.sphere}</Text>

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
            <Divider w={400} color="#e03131" />
            <Grid grow m={0}>
                {
                    ownedBackgrounds.map((bRef) => createBackgroundPick(bRef))
                }
            </Grid>

        </Stack>
    )
}

export default BackgroundGrid