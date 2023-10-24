import { Card, Center, Grid, Image, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { ClanName, Clans, clanNameSchema } from "../../../data/GoodIntentions/types/V5Clans";
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";

type ClanGridProps = {
    setClan: (clan:ClanName) => void
    setModalOpen: (modalOpen:boolean) => void
    venueData: GoodIntentionsVenueStyleSheet
}


const ClanGrid = ({setClan, setModalOpen, venueData }: ClanGridProps) => {

    const bannedClans = venueData.goodIntentionsVariables.bannedClans

    const theme = useMantineTheme()

    const c1 = "rgba(26, 27, 30, 0.90)"

    const createClanPick = (clan: ClanName, c2: string) => {

        const isBannedClan = bannedClans.includes(clan);
        const gray = theme.fn.rgba(theme.colors.gray[8], 0.90)
        const bgColor = isBannedClan ? theme.fn.linearGradient(0, c1, gray) : theme.fn.linearGradient(0, c1, c2)

        const cardStyle = {
            background: bgColor,
            cursor: isBannedClan ? 'not-allowed' : 'pointer',
        };

        return (
            <Grid.Col key={clan} span={4}>
                <Card className={`${isBannedClan ? 'disabled' : 'hoverCard'}`} shadow="sm" padding="lg" radius="md" h={275} style={cardStyle}
                    onClick={() => {
                        if (isBannedClan) {
                            console.log("Banned Clan")
                        } else {
                            setClan(clan)
                            setModalOpen(true);
                        }
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

    return (
            <Stack mt={"xl"} align="center" spacing="xl">
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

                    <Text ta="center" fz="xl" fw={700} mb={"sm"} mt={"md"} c="rgb(175,175,175)">Pretenders</Text>
                    <Grid grow m={0}>
                        {
                            ["Thin-Blood", "Ghoul"].map((c) => clanNameSchema.parse(c)).map((clan) => createClanPick(clan, theme.fn.rgba(theme.colors.yellow[8], 0.90)))
                        }
                    </Grid>
                </Stack>
    )
}

export default ClanGrid