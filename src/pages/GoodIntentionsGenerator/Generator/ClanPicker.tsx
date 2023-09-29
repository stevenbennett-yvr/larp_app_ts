import { Button, Card, Center, Grid, Group, Image, Stack, ScrollArea, Text, Title, useMantineTheme, Modal, Avatar, Tooltip } from "@mantine/core";
import { useState } from "react";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { ClanName, Clans, clanNameSchema } from "../../../data/GoodIntentions/types/V5Clans";
import { globals } from "../../../assets/globals";
import { upcase } from "../../../utils/case";
import { disciplines, getEmptyDisciplines } from "../../../data/GoodIntentions/types/V5Disciplines";

type ClanPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
}


const ClanPicker = ({ kindred, setKindred, nextStep }: ClanPickerProps) => {

    const theme = useMantineTheme()

    const c1 = "rgba(26, 27, 30, 0.90)"

    const [clan, setClan] = useState<ClanName>(kindred.clan)

    const disciplinesForClan = Clans[clan].disciplines

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setClan('');
        setModalOpen(false);
    };

    const createClanPick = (clan: ClanName, c2: string) => {
        const bgColor = theme.fn.linearGradient(0, c1, c2)

        return (
            <Grid.Col key={clan} span={4}>
                <Card className="hoverCard" shadow="sm" padding="lg" radius="md" h={275} style={{ background: bgColor, cursor: "pointer", }}
                    onClick={() => {
                        setClan(clan)
                        setModalOpen(true);
                    }}>
                    <Card.Section>
                        <Center pt={10}>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={Clans[clan].symbol}
                                height={120}
                                width={120}
                                alt="Norway"
                            />
                        </Center>
                    </Card.Section>

                    <Center>
                        <Title p="md">{clan}</Title>
                    </Center>

                    <Text h={55} size="sm" color="dimmed" ta="center">
                        {Clans[clan].summary}
                    </Text>
                </Card>
            </Grid.Col>
        )
    }

    const height = globals.viewportHeightPx
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">
                <Text fz={"30px"} ta={"center"}>Pick your <b>Clan</b></Text>

                <ScrollArea h={height - 215} w={"100%"} p={20}>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c={theme.colors.red[8]}>Fighters & Protectors</Text>
                    <Grid grow m={0}>
                        {
                            ["Brujah", "Gangrel", "Banu Haqim"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.red[8], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c="rgb(175,175,175)">Hidden Lurkers</Text>
                    <Grid grow m={0}>
                        {
                            ["Nosferatu", "Salubri", "Caitiff"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.gray[6], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c="green">Investigators & Researchers</Text>
                    <Grid grow m={0}>
                        {
                            ["Malkavian", "Tremere", "Hecata"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.green[9], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c={theme.colors.blue[6]}>Rulers & Commanders</Text>
                    <Grid grow m={0}>
                        {
                            ["Ventrue", "Tzimisce", "Lasombra"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.blue[8], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c={theme.colors.grape[7]}>Seducers & Deceivers</Text>

                    <Grid grow m={0}>
                        {
                            ["Toreador", "Ravnos", "Ministry"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.grape[8], 0.90)))
                        }
                    </Grid>

                </ScrollArea>

                {clan && (
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
                                    src={Clans[clan].logo}
                                    width={300}
                                    alt="Clan"
                                    style={{ filter: "invert(80%)" }}
                                />
                            </Center>
                            <Center>
                                <Text style={{ textAlign: "center" }}>
                                    <div dangerouslySetInnerHTML={{ __html: Clans[clan].nicknames }} />
                                </Text>
                            </Center>
                            <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>
                                Disciplines:
                            </Text>
                            <Center>
                                <Group>
                                    {clan === "Caitiff" ? (
                                        <Text>Access to all Disciplines</Text>
                                    ) : (
                                        disciplinesForClan.map((discipline) => (
                                            <Tooltip label={disciplines[discipline].summary} key={discipline}>
                                                <Group>
                                                    <Avatar size="sm" src={disciplines[discipline].logo} />
                                                    <Text>{upcase(discipline)}</Text>
                                                </Group>
                                            </Tooltip>
                                        ))
                                    )}
                                </Group>
                            </Center>
                            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                <div dangerouslySetInnerHTML={{ __html: Clans[clan].description }} />
                            </Text>
                            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                <div dangerouslySetInnerHTML={{ __html: `<b>Bane:</b> ${Clans[clan].bane}` }} />
                            </Text>
                            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                <div dangerouslySetInnerHTML={{ __html: `<b>Compulsion:</b> ${Clans[clan].compulsion}` }} />
                            </Text>
                        </Stack>

                        <Button
                            onClick={() => {
                                setKindred({ ...kindred, clan, predatorType:{name:""}, meritsFlaws: [], disciplines: getEmptyDisciplines, powers: [] })
                                nextStep()
                            }}
                        >Confirm Clan</Button>
                    </Modal>
                )}

            </Stack>
        </Center >
    )
}

export default ClanPicker