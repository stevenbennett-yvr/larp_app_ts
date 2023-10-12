import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Formulae, formulaRefs } from "../../../data/GoodIntentions/types/V5Alchemy"
import { globals } from "../../../assets/globals"
import { Grid, Card, Group, Text, Badge, Button, Space, ScrollArea, Stack, Center, Modal, Image } from "@mantine/core"
import { upcase } from "../../../utils/case"
import { disciplines, v5DisciplineLevel } from "../../../data/GoodIntentions/types/V5Disciplines"
import { v5xp } from "../../../data/GoodIntentions/V5Experience"

type FormulaeModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    modalOpened: boolean
    closeModal: () => void
}

const V5FormulaeXpInputs = ({ kindred, setKindred, modalOpened, closeModal }: FormulaeModalProps) => {
    const phoneScreen = globals.isPhoneScreen
    const smallScreen = globals.isSmallScreen


    const getCeremonyCardColsFreebie = () => {
        return Formulae.map((formula) => {
            const formulaRef = formulaRefs.find((entry) => entry.name === formula.name)
            if (!formulaRef) { return null }

            const onClick = () => {
                const updatedFormulae = [...kindred.formulae, { ...formulaRef, creationPoints: 1 }];
                setKindred({ ...kindred, formulae: updatedFormulae });
            };
            const deselect = () => {
                setKindred({ ...kindred, formulae: [] });
            }
            const isCeremonySelected = kindred.formulae.some((r) => r.name === formula.name)
            let cardHeight = phoneScreen ? 180 : 215
            if (formula.name.length > 15) cardHeight += 25
            if (formula.level > 1) { return null }
            return (
                <Grid.Col key={formula.name} span={smallScreen ? 12 : 6}>
                    <Card mb={20} h={cardHeight} style={{ backgroundColor: "rgba(26, 27, 30, 0.90)" }}>
                        <Group mt="0" mb="xs">
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={disciplines["thin-blood alchemy"].logo}
                                height={30}
                                width={30}
                                alt="order"
                            />
                            <Text fz={smallScreen && !phoneScreen ? "xs" : "sm"} weight={500}>
                                {formula.name}
                            </Text>
                            <Badge pos={"absolute"} top={0} right={0} radius={"xs"} color="pink" variant="light">
                                lv {formula.level}
                            </Badge>
                        </Group>

                        <Text fz={"sm"} size="sm" color="dimmed">
                            {upcase(formula.summary)}
                        </Text>

                        <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                            {isCeremonySelected ?
                                <Button onClick={deselect} variant="light" color="red" fullWidth radius="md">
                                    <Text truncate>Deselect {formula.name}</Text>
                                </Button>
                                :
                                <Button onClick={onClick} disabled={kindred.formulae.length !== 0} variant="light" color="blue" fullWidth radius="md">
                                    <Text truncate>Select {formula.name}</Text>
                                </Button>
                            }
                        </div>
                    </Card>
                </Grid.Col>
            )
        })
    }

    const getCeremonyCardColsXp = () => {
        return Formulae.map((formula) => {
            const formulaRef = formulaRefs.find((entry) => entry.name === formula.name)
            const isCeremonySelected = kindred.formulae.some((r) => r.name === formula.name)
            let check = formulaRef
            if (isCeremonySelected) {
                check = kindred.formulae.find((r) => r.name === formula.name);
            }

            if (!formulaRef || !check) { return null }

            const onClick = () => {

                const updatedFormulae = [...kindred.formulae, { ...formulaRef, experiencePoints: formula.level * v5xp.formula }];
                setKindred({ ...kindred, formulae: updatedFormulae });
            };
            const deselect = () => {
                const updatedFormulae = kindred.formulae.filter(formula => formula.name !== formulaRef.name);
                setKindred({ ...kindred, formulae: updatedFormulae });
            };
            let cardHeight = phoneScreen ? 180 : 215
            if (formula.name.length > 15) cardHeight += 25
            if (formula.level > v5DisciplineLevel(kindred, "thin-blood alchemy").level) { return null }
            else {
                return (
                    <Grid.Col key={formula.name} span={smallScreen ? 12 : 6}>
                        <Card mb={20} h={cardHeight} style={{ backgroundColor: "rgba(26, 27, 30, 0.90)" }}>
                            <Group mt="0" mb="xs">
                                <Image
                                    fit="contain"
                                    withPlaceholder
                                    src={disciplines["thin-blood alchemy"].logo}
                                    height={30}
                                    width={30}
                                    alt="order"
                                />
                                <Text fz={smallScreen && !phoneScreen ? "xs" : "sm"} weight={500}>
                                    {formula.name}
                                </Text>
                                <Badge pos={"absolute"} top={0} right={0} radius={"xs"} color="pink" variant="light">
                                    lv {formula.level}
                                </Badge>
                            </Group>

                            <Text fz={"sm"} size="sm" color="dimmed">
                                {upcase(formula.summary)}
                            </Text>

                            <div style={{ position: "absolute", bottom: "0", width: "100%", padding: "inherit", left: 0 }}>
                                {isCeremonySelected ?
                                    <Button onClick={deselect} disabled={check?.creationPoints > 0} variant="light" color="red" fullWidth radius="md">
                                        <Text truncate>Deselect {formula.name}</Text>
                                    </Button>
                                    :
                                    <Button onClick={onClick} variant="light" color="blue" fullWidth radius="md">
                                        <Text truncate>Buy {formula.name}</Text>
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
                {kindred.formulae.length === 0 ?
                    <Text fw={700} fz={smallScreen ? "14px" : "28px"} align="left">
                        ⛤ Pick 1 free Formula ⛤
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
                                {kindred.disciplines["thin-blood alchemy"].creationPoints > 0 && kindred.formulae.length === 0 ?
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

export default V5FormulaeXpInputs