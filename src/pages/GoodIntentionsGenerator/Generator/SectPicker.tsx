import { Button, Card, Center, Grid, Group, Image, Stack, ScrollArea, Text, Title, useMantineTheme, Modal, Tooltip, Divider } from "@mantine/core";
import { useState } from "react";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { globals } from "../../../assets/globals";
import { upcase } from "../../../utils/case";
import { SectName, Sects, sectNameSchema } from "../../../data/GoodIntentions/types/V5Sect";
import { Clans } from "../../../data/GoodIntentions/types/V5Clans";

type SectPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
}


const SectPicker = ({ kindred, setKindred, nextStep }: SectPickerProps) => {

    const theme = useMantineTheme()

    const c1 = "rgba(26, 27, 30, 0.90)"

    const [sect, setSect] = useState<SectName>(kindred.sect)

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setSect('');
        setModalOpen(false);
    };

    const createSectPick = (sect: SectName, c2: string) => {
        const bgColor = theme.fn.linearGradient(0, c1, c2)

        return (
            <Grid.Col key={sect} span={4}>
                <Card className="hoverCard" shadow="sm" padding="lg" radius="md" h={275} style={{ background: bgColor, cursor: "pointer", }}
                    onClick={() => {
                        setSect(sect)
                        setModalOpen(true);
                    }}>
                    <Card.Section>
                        <Center pt={10}>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={Sects[sect].symbol}
                                height={120}
                                width={120}
                                alt="Norway"
                            />
                        </Center>
                    </Card.Section>

                    <Center>
                        <Title p="md">{sect}</Title>
                    </Center>

                    <Text h={55} size="sm" color="dimmed" ta="center">
                        {Sects[sect].summary}
                    </Text>
                </Card>
            </Grid.Col>
        )
    }

    const height = globals.viewportHeightPx
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">
                <Text fz={"30px"} ta={"center"}>Pick your <b>Sect</b></Text>

                <ScrollArea h={height - 215} w={"100%"} p={20}>

                    <Grid grow m={0}>
                        {
                            ["Camarilla"].map((c) => sectNameSchema.parse(c)).map((sect) => createSectPick(sect, theme.fn.rgba(theme.colors.blue[8], 0.90)))
                        }
                        {
                            ["Anarch"].map((c) => sectNameSchema.parse(c)).map((sect) => createSectPick(sect, theme.fn.rgba(theme.colors.red[8], 0.90)))
                        }
                        {
                            ["Autarkis"].map((c) => sectNameSchema.parse(c)).map((sect) => createSectPick(sect, theme.fn.rgba(theme.colors.green[9], 0.90)))
                        }
                    </Grid>

                </ScrollArea>

                {sect && (
                    <Modal
                        opened={modalOpen}
                        onClose={handleCloseModal}
                        size={600}
                    >

                        <Stack>
                            <Center pt={10}>
                                <Image
                                    fit="contain"
                                    withPlaceholder
                                    src={Sects[sect].logo}
                                    width={300}
                                    alt="Sect"
                                    style={{ filter: "invert(80%)" }}
                                />
                            </Center>
                            <Center>
                                <Text style={{ textAlign: "center" }}>
                                    <div dangerouslySetInnerHTML={{ __html: Sects[sect].nicknames }} />
                                </Text>
                            </Center>
                            <Divider my="sm" />

                            <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>
                                Predominate Clans:
                            </Text>
                            <Center>
                                <Group>
                                    {
                                        Sects[sect].clans.map((clan) =>
                                        (
                                            <Tooltip label={Clans[clan.name].summary} key={clan.name}>
                                                <Group>
                                                    <Image width={24} src={Clans[clan.name].symbol} style={{ filter: "invert(80%)" }} />
                                                    <Text>{upcase(clan.name)} {clan.note !== "" ? `(${clan.note})` : ``}</Text>
                                                </Group>
                                            </Tooltip>
                                        ))
                                    }
                                </Group>
                            </Center>
                            <Divider my="sm" />

                            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                <div dangerouslySetInnerHTML={{ __html: Sects[sect].description }} />
                            </Text>
                        </Stack>
                        <Divider my="sm" />

                        <Button
                            onClick={() => {
                                setKindred({
                                    ...kindred,
                                    sect
                                })
                                nextStep()
                            }}
                        >Confirm Sect</Button>
                    </Modal>
                )}

            </Stack>
        </Center >
    )
}

export default SectPicker