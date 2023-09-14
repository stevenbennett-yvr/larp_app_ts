import { Center, Group, Stack, Card } from '@mantine/core';
import MageCarousel from './components/MageCarousel';
import CharacterCard from './components/CharacterCard';
import CastAside from './components/CastAside';
import { useMageDb } from '../../contexts/MageContext';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { globals } from '../../assets/globals';

export default function TatteredVeilVenueDashboard() {
    let { userAwakenedList, fetchUserAwakened, domainAwakenedList, fetchDomainAwakened } = useMageDb()
    const { currentUser } = useAuth()
    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])

    useEffect(() => {
        // Fetch the character list when the component mounts
        if (userAwakenedList.length === 0 && domainAwakenedList.length === 0) {
            fetchUserAwakened();
            fetchDomainAwakened();
        }
    }, [userAwakenedList.length, domainAwakenedList.length, fetchUserAwakened, fetchDomainAwakened]);

    return (
        <Center h={"100%"}>
            {showAsideBar ? <CastAside domainAwakenedList={domainAwakenedList} currentUser={currentUser} /> : <></>}
            <Stack>
                <Group>
                    {showAsideBar ? <Card style={{ maxWidth: 600 }}><MageCarousel /></Card> : <></>}
                </Group>
                <CharacterCard awakenedList={userAwakenedList} />
            </Stack>
        </Center>
    )
}