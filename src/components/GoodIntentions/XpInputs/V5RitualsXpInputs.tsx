import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Rituals, ritualRefs } from "../../../data/GoodIntentions/types/V5Rituals"
import { globals } from "../../../assets/globals"
import { Grid, Card, Group, Text, Badge, Button, Space, ScrollArea, Stack, Center, Modal, Image } from "@mantine/core"
import { upcase } from "../../../utils/case"
import { disciplines, v5DisciplineLevel } from "../../../data/GoodIntentions/types/V5Disciplines"
import { v5xp } from "../../../data/GoodIntentions/types/V5Costs"
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"

type RitualsModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    modalOpened: boolean
    closeModal: () => void
    venueData: GoodIntentionsVenueStyleSheet
}

const V5RitualsXpInputs = ({ kindred, setKindred, modalOpened, closeModal, venueData }: RitualsModalProps) => {
    const phoneScreen = globals.isPhoneScreen
    const smallScreen = globals.isSmallScreen

    const { bannedRituals } = venueData.goodIntentionsVariables

    const getRitualCardColsFreebie = () => {
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
            if (ritual.level > 1 || bannedRituals.includes(ritual.name)) { return null }
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

    const getRitualCardColsXp = () => {
        return Rituals.map((ritual) => {
            const ritualRef = ritualRefs.find((entry) => entry.name === ritual.name)
            const isRitualSelected = kindred.rituals.some((r) => r.name === ritual.name);
            let check = ritualRef
            if (isRitualSelected) {
                check = kindred.rituals.find((r) => r.name === ritual.name);
            }

            if (!ritualRef || !check || bannedRituals.includes(ritual.name)) { return null; }

            const onClick = () => {

                const updatedRituals = [...kindred.rituals, { ...ritualRef, experiencePoints: ritual.level * v5xp.ritual }];
                setKindred({ ...kindred, rituals: updatedRituals });
            };
            const deselect = () => {
                const updatedRituals = kindred.rituals.filter(ritual => ritual.name !== ritualRef.name);
                setKindred({ ...kindred, rituals: updatedRituals });
            };

            let cardHeight = phoneScreen ? 180 : 215
            if (ritual.name.length > 15) cardHeight += 25
            if (ritual.level > v5DisciplineLevel(kindred, "blood sorcery").level) { return null }
            else {
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
                                    <Button onClick={deselect} disabled={check?.creationPoints > 0} variant="light" color="red" fullWidth radius="md">
                                        <Text truncate>Deselect {ritual.name}</Text>
                                    </Button>
                                    :
                                    <Button onClick={onClick} variant="light" color="blue" fullWidth radius="md">
                                        <Text truncate>Buy {ritual.name}</Text>
                                    </Button>
                                }
                            </div>
                        </Card>
                    </Grid.Col>
                )
            }
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
                {kindred.rituals.length === 0 ?
                    <Text fw={700} fz={smallScreen ? "14px" : "28px"} align="left">
                        ⛤ Pick 1 free Ritual ⛤
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
                                {kindred.rituals.length === 0 ?
                                    <Grid>{getRitualCardColsFreebie()}</Grid>
                                    :
                                    <Grid>{getRitualCardColsXp()}</Grid>
                                }
                            </Center>
                        </Group>
                    </Center>
                </ScrollArea>
            </Stack>

        </Modal>
    )
}

export default V5RitualsXpInputs