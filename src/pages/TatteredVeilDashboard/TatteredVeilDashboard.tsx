import { Center, Stack, Card } from '@mantine/core';
import MageCarousel from './components/MageCarousel';
import CharacterCard from './components/CharacterCard';
import CastAside from './components/CastAside';
import { useMageDb } from '../../contexts/MageContext';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { globals } from '../../assets/globals';
import { useUser } from '../../contexts/UserContext';
import { User } from '../../data/CaM/types/User';

export default function TatteredVeilVenueDashboard() {
    let { userAwakenedList, fetchUserAwakened, domainAwakenedList, fetchDomainAwakened } = useMageDb()
    const { currentUser } = useAuth()

    const { getUser } = useUser();
    const [userData, setUserData] = useState<User>(() => {
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : '';
    });
    useEffect(() => {
        if (!userData) { // Check if userData is not set
            const fetchUserData = async () => {
                const fetchedUserData = await getUser();
                console.log("fetch userData")
                if (fetchedUserData) {
                    setUserData(fetchedUserData);
                    localStorage.setItem('userData', JSON.stringify(fetchedUserData));
                } else {
                    console.log("User data not found");
                }
            };

            fetchUserData();
        }
    }, []);

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
                <Center>
                    {showAsideBar ? <Card style={{ maxWidth: 600 }}><MageCarousel /></Card> : <></>}
                </Center>
                {userData.roles?.some(role => role.title === "vst" && role.venue === "tattered veil") ? <CharacterCard awakenedList={domainAwakenedList} /> :
                    <Center>
                        <CharacterCard awakenedList={userAwakenedList} />
                    </Center>
                }
            </Stack>
        </Center>
    )
}