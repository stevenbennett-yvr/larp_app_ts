import { Center, Group, Stack, Card } from '@mantine/core';
import MageCarousel from './components/MageCarousel';

export default function TatteredVeilVenueDashboard() {

    return (
        <Center h={"100%"}>
            <Stack>
                <Group>
                    <Card style={{ maxWidth: 600 }}>
                       <MageCarousel/>
                    </Card>
                </Group>
                <Group>
                    {/*  */}
                </Group>
                <Group>
                    {/*  */}
                </Group>
            </Stack>
        </Center>
    )
}