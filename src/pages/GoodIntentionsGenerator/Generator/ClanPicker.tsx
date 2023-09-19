import { Button, Card, Center, Grid, Group, Image, Stack, ScrollArea, Text, Title, useMantineTheme, Modal } from "@mantine/core";
import { useState } from "react";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { ClanName, Clans, clanNameSchema } from "../../../data/GoodIntentions/types/V5Clans";
import { globals } from "../../../assets/globals";

type ClanPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
}


const ClanPicker = ({ kindred, setKindred, nextStep }: ClanPickerProps) => {

    const theme = useMantineTheme()

    const c1 = "rgba(26, 27, 30, 0.90)"

    const [clan, setClan] = useState<ClanName>(kindred.clan)

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setClan('');
        setModalOpen(false);
    };

    /*     const clanToColorMap = {
            "Ventrue": theme.colors.blue[6],
            "Tzimisce": theme.colors.blue[8],
            "Lasombra": theme.colors.blue[8],
            "Brujah": theme.colors.red[8],
            "Gangrel": theme.colors.red[8],
            "Banu Haqim": theme.colors.red[8],
            "Toreador": theme.colors.grape[7],
            "Ravnos": theme.colors.grape[8],
            "Ministry": theme.colors.grape[8],
            "Malkavian": theme.colors.green[9],
            "Tremere": theme.colors.green[9],
            "Hecata": theme.colors.green[9],
            "Nosferatu": theme.colors.gray[6],
            "Salubri": theme.colors.gray[6]
        }; */

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
                        {Clans[clan].description}
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
                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c={theme.colors.blue[6]}>Rulers & Commanders</Text>
                    <Grid grow m={0}>
                        {
                            ["Ventrue", "Tzimisce", "Lasombra"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.blue[8], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c={theme.colors.red[8]}>Fighters & Protectors</Text>
                    <Grid grow m={0}>
                        {
                            ["Brujah", "Gangrel", "Banu Haqim"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.red[8], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c={theme.colors.grape[7]}>Seducers & Deceivers</Text>

                    <Grid grow m={0}>
                        {
                            ["Toreador", "Ravnos", "Ministry"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.grape[8], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c="green">Investigators & Researchers</Text>
                    <Grid grow m={0}>
                        {
                            ["Malkavian", "Tremere", "Hecata"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.green[9], 0.90)))
                        }
                    </Grid>

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c="rgb(175,175,175)">Hidden Lurkers</Text>
                    <Grid grow m={0}>
                        {
                            ["Nosferatu", "Salubri"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.gray[6], 0.90)))
                        }
                    </Grid>

                </ScrollArea>

                {clan && (
                    <Modal
                        opened={modalOpen}
                        onClose={handleCloseModal}
                        size={600}
                    >

                        <div>
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
                                <Text fz={globals.largeFontSize} style={{ textAlign: "center" }}>
                                    Nicknames
                                </Text>
                            </Center>
                            <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>
                                    Disciplines:
                                </Text>
                                <Group>

                                </Group>
                            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                <div dangerouslySetInnerHTML={{ __html: Clans[clan].description }} />
                            </Text>
                            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                <div dangerouslySetInnerHTML={{ __html: Clans[clan].description }} />
                            </Text>
                        </div>

                        <Button
                            onClick={() => {
                                setKindred({ ...kindred, clan, merits: [], disciplines: [] })
                                nextStep()
                            }}
                        >Confirm Path</Button>
                    </Modal>
                )}

            </Stack>
        </Center >
    )
}

export default ClanPicker