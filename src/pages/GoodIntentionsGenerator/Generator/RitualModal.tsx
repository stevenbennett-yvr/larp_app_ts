import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Rituals, ritualRefs } from "../../../data/GoodIntentions/types/V5Rituals"
import { Ceremonies, ceremonyRefs } from "../../../data/GoodIntentions/types/V5Ceremonies"
import { globals } from "../../../assets/globals"
import { Grid, Card, Group, Text, Badge, Button, Space, ScrollArea, Stack, Center, Modal, Image } from "@mantine/core"
import { upcase } from "../../../utils/case"
import { disciplines } from "../../../data/GoodIntentions/types/V5Disciplines"

type RitualsModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    nextStep: () => void,
    modalOpened: boolean
    closeModal: () => void
}

const RitualsModal = ({ kindred, setKindred, nextStep, modalOpened, closeModal }: RitualsModalProps) => {
    const phoneScreen = globals.isPhoneScreen
    const smallScreen = globals.isSmallScreen


    const getRitualCardCols = () => {
        return Rituals.map((ritual) => {
            const ritualRef = ritualRefs.find((entry) => entry.name === ritual.name)
            if (!ritualRef) { return null }

            const onClick = () => {
                const updatedRituals = [...kindred.rituals, { ...ritualRef, creationPoints: 1 }];
                setKindred({ ...kindred, rituals: updatedRituals });
            };
            const deselect = () => {
                setKindred({ ...kindred, rituals: [] });
            }
            const isRitualSelected = kindred.rituals.some((r) => r.name === ritual.name)
            let cardHeight = phoneScreen ? 180 : 215
            if (ritual.name.length > 15) cardHeight += 25
            return (
                <Grid.Col key={ritual.name} span={smallScreen ? 12 : 6}>
                    <Card mb={20} h={cardHeight} style={{ backgroundColor: "rgba(26, 27, 30, 0.90)" }}>
                        <Group mt="0" mb="xs">
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={disciplines["blood sorcery"].logo}
                                height={30}
                                width={30}
                                alt="order"
                            />
                            <Text fz={smallScreen && !phoneScreen ? "xs" : "sm"} weight={500}>
                                {ritual.name}
                            </Text>
                            <Badge pos={"absolute"} top={0} right={0} radius={"xs"} color="pink" variant="light">
                                lv {ritual.level}
                            </Badge>
                        </Group>

                        <Text fz={"sm"} size="sm" color="dimmed">
                            {upcase(ritual.summary)}
                        </Text>

                        <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                            {isRitualSelected ?
                                <Button onClick={deselect} variant="light" color="red" fullWidth radius="md">
                                    <Text truncate>Deselect {ritual.name}</Text>
                                </Button>
                                :
                                <Button onClick={onClick} disabled={kindred.rituals.length !== 0} variant="light" color="blue" fullWidth radius="md">
                                    <Text truncate>Select {ritual.name}</Text>
                                </Button>
                            }
                        </div>
                    </Card>
                </Grid.Col>
            )
        })
    }

    const getCeremonyCardCols = () => {
        return Ceremonies.map((ceremony) => {
            const ceremonyRef = ceremonyRefs.find((entry) => entry.name === ceremony.name)
            if (!ceremonyRef) { return null }
            const onClick = () => {
                const updatedRituals = [...kindred.rituals, { ...ceremonyRef, creationPoints: 1 }];
                setKindred({ ...kindred, ceremonies: updatedRituals });
            };
            const deselect = () => {
                setKindred({ ...kindred, ceremonies: [] });
            }
            const isRitualSelected = kindred.ceremonies.some((r) => r.name === ceremony.name)



            let cardHeight = phoneScreen ? 180 : 215
            if (ceremony.name.length > 15) cardHeight += 25
            return (
                <Grid.Col key={ceremony.name} span={smallScreen ? 12 : 6}>
                    <Card mb={20} h={cardHeight} style={{ backgroundColor: "rgba(26, 27, 30, 0.90)" }}>
                        <Group mt="0" mb="xs">
                        <Image
                                fit="contain"
                                withPlaceholder
                                src={disciplines["oblivion"].logo}
                                height={30}
                                width={30}
                                alt="order"
                            />
                            <Text fz={smallScreen && !phoneScreen ? "xs" : "sm"} weight={500}>
                                {ceremony.name}
                            </Text>
                            <Badge pos={"absolute"} top={0} right={0} radius={"xs"} color="pink" variant="light">
                                lv {ceremony.level}
                            </Badge>
                        </Group>

                        <Text fz={"sm"} size="sm" color="dimmed">
                            {upcase(ceremony.summary)}
                        </Text>

                        <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                        {isRitualSelected ?
                                <Button onClick={deselect} variant="light" color="red" fullWidth radius="md">
                                    <Text truncate>Deselect {ceremony.name}</Text>
                                </Button>
                                :
                                <Button onClick={onClick} disabled={kindred.ceremonies.length !== 0} variant="light" color="blue" fullWidth radius="md">
                                    <Text truncate>Select {ceremony.name}</Text>
                                </Button>
                            }
                        </div>
                    </Card>
                </Grid.Col>
            )
        })
    }

    const height = globals.viewportHeightPx
    return (
        <Modal
            opened={modalOpened}
            onClose={closeModal}
            size={600}
        >
            <Group grow>
                {kindred.disciplines["blood sorcery"].creationPoints > 0 ?
                    <Text fw={700} fz={smallScreen ? "14px" : "28px"} align="left">
                        ⛤ Pick 1 free Ritual ⛤
                    </Text>
                    :
                    <></>
                }


                {kindred.disciplines["oblivion"].creationPoints > 0 ?
                    <Text fw={700} fz={smallScreen ? "14px" : "28px"} align="right">
                        ⛤ Pick 1 free Ceremony ⛤
                    </Text>
                    :
                    <></>
                }
            </Group>
            <hr color="#e03131" />
            <Space h={"sm"} />

            <Stack align="center" spacing="xl" w={"100%"}>
                <ScrollArea h={smallScreen ? height - 320 : height - 400} pb={20} w={"105%"}>
                    <Center>
                        <Group>
                            <Center>
                                {kindred.disciplines["blood sorcery"].creationPoints > 0 ?
                                    <Grid w={"50%"}>{getRitualCardCols()}</Grid>
                                    : <></>}
                                {kindred.disciplines["oblivion"].creationPoints > 0 ?
                                    <Grid w={"50%"}>{getCeremonyCardCols()}</Grid>
                                    : <></>}
                            </Center>
                        </Group>
                    </Center>
                </ScrollArea>
                <Button
                    disabled={
                        (kindred.disciplines["blood sorcery"].creationPoints > 0 && kindred.rituals.length <= 0)
                        ||
                        (kindred.disciplines["oblivion"].creationPoints > 0 && kindred.ceremonies.length <= 0)
                    }
                    onClick={() => {
                        nextStep()
                    }}
                >Next</Button>
            </Stack>

        </Modal>
    )
}

export default RitualsModal