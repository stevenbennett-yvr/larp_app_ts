import { Center, Group, Stack, Card } from '@mantine/core';
import MageCarousel from './components/MageCarousel';
import CharacterCard from './components/CharacterCard';
import CastAside from './components/CastAside';
import { useMageDb } from '../../contexts/MageContext';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function TatteredVeilVenueDashboard() {
    let { userAwakenedList, fetchUserAwakened, domainAwakenedList, fetchDomainAwakened } = useMageDb()
    const { currentUser } = useAuth()

    useEffect(() => {
        // Fetch the character list when the component mounts
        if (userAwakenedList.length === 0) {
            fetchUserAwakened();
        }
        if (domainAwakenedList.length === 0) {
            fetchDomainAwakened();
        }
      }, [fetchUserAwakened, userAwakenedList.length, fetchDomainAwakened, domainAwakenedList.length]);

    return (
        <Center h={"100%"}>
            <CastAside domainAwakenedList={domainAwakenedList} currentUser={currentUser}/>
            <Stack>
                <Group>
                    <Card style={{ maxWidth: 600 }}>
                       <MageCarousel/>
                    </Card>
                </Group>
                <CharacterCard awakenedList={userAwakenedList}/>
            </Stack>
        </Center>
    )
}