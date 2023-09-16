import { useState, useEffect } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import { Center, Tabs, Stack } from '@mantine/core';

import { useNavigate, useParams } from "react-router-dom"
import { useUser } from "../../contexts/UserContext";
import { User } from '../../data/CaM/types/User';
import { Awakened, getEmptyAwakened, fetchAwakenedCharacter } from '../../data/TatteredVeil/types/Awakened';
import { useMageDb } from '../../contexts/MageContext';
import { globals } from '../../assets/globals';
import { logChanges } from '../TatteredVeilGenerator/Generator/utils/Logging';

import AwakenedStTab from './CharacterTabs/AwakenedSTTab';

const AwakenedSTEditor = () => {
    const { characterId } = useParams();
    const { getAwakenedById, updateAwakened } = useMageDb();
    const navigate = useNavigate();

    // get User data
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

    // get Character data.
    const [initialAwakened, setInitialAwakened] = useLocalStorage<Awakened>({
        key: `initAwakened id ${characterId}`,
        defaultValue: getEmptyAwakened(),
    });
    const [awakened, setAwakened] = useLocalStorage<Awakened>({
        key: `awakened id ${characterId}`,
        defaultValue: getEmptyAwakened(),
    });

    useEffect(() => {
        if (characterId && userData) {
            fetchAwakenedCharacter(characterId, userData, setAwakened, setInitialAwakened, getAwakenedById, navigate);
        }
    }, [characterId, userData, setInitialAwakened, setAwakened]);


    const handleUpdate = () => {

        if (awakened.id && awakened !== initialAwakened) {
            const updatedAwakened = {
                ...awakened,
                changeLogs: {
                    ...awakened.changeLogs,
                    [new Date().toISOString()]: logChanges(initialAwakened, awakened),
                },
            };

            updateAwakened(awakened.id, updatedAwakened);
            setAwakened(updatedAwakened);
            setInitialAwakened(updatedAwakened);
        }
    }

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Tabs defaultValue="core" orientation={globals.isPhoneScreen ? "vertical" : "horizontal"}>
                <Stack spacing='0'>
                    <Center>
                        <Tabs.List style={{ paddingBottom: "10px" }}>
                            <Tabs.Tab value="core">Character Sheet</Tabs.Tab>
                        </Tabs.List>
                    </Center>

                    <Tabs.Panel value="core" pt="xs">
                        {awakened ?
                            <AwakenedStTab awakened={awakened} setAwakened={setAwakened} handleUpdate={handleUpdate} />
                            : null}
                    </Tabs.Panel>

                </Stack>
            </Tabs>
        </Center>
    )
};

export default AwakenedSTEditor;