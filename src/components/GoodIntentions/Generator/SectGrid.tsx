import { Card, Center, Grid, Image, Text, Title, useMantineTheme } from "@mantine/core";
import { SectName, Sects, sectNameSchema } from "../../../data/GoodIntentions/types/V5Sect";
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";

type SectGridProps = {
    setSect: (clan: SectName) => void
    setModalOpen: (modalOpen: boolean) => void
    venueData: GoodIntentionsVenueStyleSheet
}


const SectGrid = ({ setSect, setModalOpen, venueData }: SectGridProps) => {

    const venueSect = venueData.goodIntentionsVariables.sect
    const bannedSects = venueData.goodIntentionsVariables.bannedSects

    const theme = useMantineTheme()

    const c1 = "rgba(26, 27, 30, 0.90)"

    const createSectPick = (sect: SectName, c2: string) => {
        const isVenueSect = sect === venueSect;
        const isBannedSect = bannedSects.includes(sect);
        const gray = theme.fn.rgba(theme.colors.gray[8], 0.90)
        const bgColor = isBannedSect ? theme.fn.linearGradient(0, c1, gray) : theme.fn.linearGradient(0, c1, c2)

        const cardStyle = {
            background: bgColor,
            cursor: isBannedSect ? 'not-allowed' : 'pointer',
            boxShadow: isVenueSect ? '0 0 10px 5px rgba(255, 255, 255, 0.7)' : 'none',
        };

        return (
            <Grid.Col key={sect} span={4}>
                <Card className={`${isBannedSect ? 'disabled' : 'hoverCard'}`} shadow="sm" padding="lg" radius="md" h={275} style={cardStyle}
                    onClick={() => {
                        if (isBannedSect) {
                            console.log("banned");
                        } else {
                            setSect(sect);
                            setModalOpen(true);
                        }
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
                    <Title p="md" color={isBannedSect ? 'dimmed' : undefined}>{sect}</Title>
                </Center>

                <Text h={55} size="sm" color="dimmed" ta="center">
                    {Sects[sect].summary}
                </Text>
            </Card>
            </Grid.Col >
        )
    }

return (
    <Grid grow m={0} style={{paddingTop:"25px"}}>
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
)
}

export default SectGrid