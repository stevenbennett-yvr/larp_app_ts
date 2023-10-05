import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Ceremonies, ceremonyRefs } from "../../../data/GoodIntentions/types/V5Ceremonies"
import { globals } from "../../../assets/globals"
import { Grid, Card, Group, Text, Badge, Button, Space, ScrollArea, Stack, Center, Modal, Image } from "@mantine/core"
import { upcase } from "../../../utils/case"
import { disciplines, v5DisciplineLevel } from "../../../data/GoodIntentions/types/V5Disciplines"
import { v5xp } from "../../../data/GoodIntentions/V5Experience"

type CeremoniesModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    modalOpened: boolean
    closeModal: () => void
}

const V5CeremoniesXpInputs = ({ kindred, setKindred, modalOpened, closeModal }: CeremoniesModalProps) => {
    const phoneScreen = globals.isPhoneScreen
    const smallScreen = globals.isSmallScreen


    const getCeremonyCardColsFreebie = () => {
        return Ceremonies.map((ceremony) => {
            const ceremonyRef = ceremonyRefs.find((entry) => entry.name === ceremony.name)
            if (!ceremonyRef) { return null }

            const onClick = () => {
                const updatedCeremonies = [...kindred.ceremonies, { ...ceremonyRef, creationPoints: 1 }];
                setKindred({ ...kindred, ceremonies: updatedCeremonies });
            };
            const deselect = () => {
                setKindred({ ...kindred, ceremonies: [] });
            }
            const isCeremonySelected = kindred.ceremonies.some((r) => r.name === ceremony.name)
            let cardHeight = phoneScreen ? 180 : 215
            if (ceremony.name.length > 15) cardHeight += 25
            if (ceremony.level > 1) { return null }
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
                            {isCeremonySelected ?
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

    const getCeremonyCardColsXp = () => {
        return Ceremonies.map((ceremony) => {
            const ceremonyRef = ceremonyRefs.find((entry) => entry.name === ceremony.name)
            const isCeremonySelected = kindred.ceremonies.some((r) => r.name === ceremony.name)
            let check = ceremonyRef
            if (isCeremonySelected) {
                check = kindred.ceremonies.find((r) => r.name === ceremony.name);
            }

            if (!ceremonyRef || !check) { return null }

            const onClick = () => {

                const updatedCeremonies = [...kindred.ceremonies, { ...ceremonyRef, experiencePoints: ceremony.level * v5xp.ceremony }];
                setKindred({ ...kindred, ceremonies: updatedCeremonies });
            };
            const deselect = () => {
                const updatedCeremonies = kindred.ceremonies.filter(ceremony => ceremony.name !== ceremonyRef.name);
                setKindred({ ...kindred, ceremonies: updatedCeremonies });
            };
            let cardHeight = phoneScreen ? 180 : 215
            if (ceremony.name.length > 15) cardHeight += 25
            if (ceremony.level > v5DisciplineLevel(kindred, "oblivion").level) { return null }
            else {
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
                                {isCeremonySelected ?
                                    <Button onClick={deselect} disabled={check?.creationPoints > 0} variant="light" color="red" fullWidth radius="md">
                                        <Text truncate>Deselect {ceremony.name}</Text>
                                    </Button>
                                    :
                                    <Button onClick={onClick} variant="light" color="blue" fullWidth radius="md">
                                        <Text truncate>Buy {ceremony.name}</Text>
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
                {kindred.ceremonies.length === 0 ?
                    <Text fw={700} fz={smallScreen ? "14px" : "28px"} align="left">
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
                                {kindred.disciplines["oblivion"].creationPoints > 0 && kindred.ceremonies.length === 0 ?
                                    <Grid>{getCeremonyCardColsFreebie()}</Grid>
                                    :
                                    <Grid>{getCeremonyCardColsXp()}</Grid>
                                }
                            </Center>
                        </Group>
                    </Center>
                </ScrollArea>
            </Stack>

        </Modal>
    )
}

export default V5CeremoniesXpInputs