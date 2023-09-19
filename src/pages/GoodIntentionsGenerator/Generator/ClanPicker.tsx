import { Card, Center, Grid, Image, ScrollArea, Text, Title, useMantineTheme } from "@mantine/core";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { ClanName } from "../../../data/GoodIntentions/types/V5Clans";
import { globals } from "../../../assets/globals";


type ClanPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
}


const ClanPicker = ({ kindred, setKindred, nextStep }: ClanPickerProps) => {

    const theme = useMantineTheme()

    const c1 = "rgba(26, 27, 30, 0.90)"

    const createClanPick = (clan: ClanName, c2: string) => {
        const bgColor = theme.fn.linearGradient(0, c1, c2)

        return (
            <Grid.Col key={clan} span={4}>
                <Card className="hoverCard" shadow="sm" padding="lg" radius="md" h={275} style={{ background: bgColor, cursor: "pointer", }}
                    onClick={() => {
                        setKindred({ ...kindred, clan, disciplines: [] })
                        nextStep()
                    }}>
                    <Card.Section>
                        <Center pt={10}>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={Clans[clan].logo}
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
        <div style={{ height: height - 250 }}>
            <Text fz={"30px"} ta={"center"}>Pick your <b>Clan</b></Text>


            <Text ta="center" fz="xl" fw={700} c="red">Clan</Text>
            <hr color="#e03131" />

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
        </div >
    )
}

export default ClanPicker