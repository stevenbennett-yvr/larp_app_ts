import { Grid, Card, Center, Image, useMantineTheme, Title } from '@mantine/core'
import { Chronciles, ChronicleName, chronicleNameSchema } from '../../../data/CaM/types/Chronicles'
import { useNavigate } from 'react-router-dom';
import domains from '../../../data/CaM/source/domains.json'

const ChroncileSelector = (userData: any) => {
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const domain = domains.find((domain) => domain.id === userData.domain)
    const c1 = "rgba(26, 27, 30, 0.90)"

    let currentChronicles = domain?.currentChronicles

    const createChroniclePicker = (chronicle: ChronicleName) => {
        const bgColor = theme.fn.linearGradient(0, c1, Chronciles[chronicle].color)



        return (
            <Grid.Col key={chronicle} span={4}>
                <Card 
                    className="hoverCard" 
                    shadow="sm" 
                    padding="lg" 
                    radius="md"  
                    style={{ background: bgColor }}
                    onClick={() => navigate(Chronciles[chronicle].path)}
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
        currentChronicles?.map((c) => chronicleNameSchema.parse(c)).map((chronicle) => createChroniclePicker(chronicle))
    )
}

export default ChroncileSelector