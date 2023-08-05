import { Center, Group, Stack, Card } from '@mantine/core';
import MageCarousel from './components/MageCarousel';
import CharacterCard from './components/CharacterCard';
import { useMageDb } from '../../contexts/MageContext';
import { useEffect } from 'react';

export default function TatteredVeilVenueDashboard() {
    let { awakenedList, fetchAwakened } = useMageDb()

    useEffect(() => {
        // Fetch the character list when the component mounts
        fetchAwakened()
      }, [fetchAwakened]);

    return (
        <Center h={"100%"}>
            <Stack>
                <Group>
                    <Card style={{ maxWidth: 600 }}>
                       <MageCarousel/>
                    </Card>
                </Group>
                <CharacterCard awakenedList={awakenedList}/>
                <Group>
                    {/* Cabal shit */}
                </Group>
            </Stack>
        </Center>
    )
}