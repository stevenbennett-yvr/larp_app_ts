import { Grid, Card, Center, Image, useMantineTheme, Title } from '@mantine/core'
import { Chronciles } from '../../../data/CaM/types/Chronicles'
import { useNavigate } from 'react-router-dom';
import { VenueStyleSheets } from '../../../data/CaM/types/VSS';
import { GoodIntentionsVenueStyleSheet, TatteredVeilStyleSheet } from '../../../data/CaM/types/VSS';

const ChroncileSelector = (userData: any) => {
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const c1 = "rgba(26, 27, 30, 0.90)"

    let matchingVenues = VenueStyleSheets.filter((venue) => venue.venueStyleSheet.domainCode === userData.domain);

    const createChroniclePicker = (venue:(GoodIntentionsVenueStyleSheet | TatteredVeilStyleSheet)) => {
        let chronicle = venue.venueStyleSheet.chronicle
        const bgColor = theme.fn.linearGradient(0, c1, Chronciles[chronicle].color)


        return (
            <Grid.Col key={chronicle} span={4}>
                <Card 
                    className="hoverCard" 
                    shadow="sm" 
                    padding="lg" 
                    radius="md"  
                    style={{ background: bgColor }}
                    onClick={() => navigate(`${Chronciles[chronicle].path}/${venue.venueStyleSheet.id}`)}
                >
                    <Card.Section>
                        <Center>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={Chronciles[chronicle].logo}
                                height={250}
                                width={250}
                                alt="chronicle"
                            />
                        </Center>
                        <Center>
                            <Title h={30} size="sm" color="dimmed" ta="center">
                                {Chronciles[chronicle].name}
                            </Title>
                        </Center>
                    </Card.Section>
                </Card>
            </Grid.Col>
        )
    }

    return (
        matchingVenues?.map((c) => createChroniclePicker(c))
    )
}

export default ChroncileSelector