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
import debounce from 'lodash/debounce';

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

    // Define the debounced version of your fetch function with a 10-second delay
    const debouncedFetchUserAwakened = debounce(fetchUserAwakened, 300); // Adjust the delay (300 milliseconds) as needed
    const debouncedFetchDomainAwakened = debounce(fetchDomainAwakened, 300); // Adjust the delay (300 milliseconds) as needed
    
    // Use the debounced function in your useEffect block without relying on userAwakenedList.length
    useEffect(() => {
        // Fetch the user awakened list when the component mounts
        debouncedFetchUserAwakened();
    }, [debouncedFetchUserAwakened]);

    useEffect(() => {
        // Fetch the domain awakened list when the component mounts
        debouncedFetchDomainAwakened()
    }, [debouncedFetchDomainAwakened]);

    return (
        <Center h={"100%"}>
            {showAsideBar ? <CastAside domainAwakenedList={domainAwakenedList} currentUser={currentUser} /> : <></>}
            <Stack>
                <Center>
                    {showAsideBar ? <Card style={{ maxWidth: 600 }}><MageCarousel /></Card> : <></>}
                </Center>
                <Center>
                    <CharacterCard awakenedList={userAwakenedList} isSt={false} />
                </Center>
                
            </Stack>
        </Center>
    )
}