import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Center, Tabs, Stack } from "@mantine/core";
//import { GoodIntentionsVSSs } from "../../data/CaM/types/VSS";
import { useAuth } from "../../contexts/AuthContext";
import { useCharacterDb } from "../../contexts/CharacterContext";
import { useUser } from '../../contexts/UserContext';
import { useLocalStorage } from '@mantine/hooks';
import { getEmptyUser } from '../../data/CaM/types/User';
import { useGiVssDb } from "../../contexts/GiVssContext";

import { globals } from "../../assets/globals";

import DashboardCore from "../../components/GoodIntentions/Dashboard/DashboardCore";
import GiVssEdit from "./GiVssEdit";

export default function GoodIntentionsDashboard() {

    // Get UserData

    const { fetchUserData } = useUser();
    const [userData, setUserData] = useLocalStorage({ key: 'userData', defaultValue: getEmptyUser() });

    useEffect(() => {
        if (userData.uid === "") {
            fetchUserData(setUserData);
        }
    }, [fetchUserData, userData, setUserData])

    // Get VenueData

    const { getVssById, onSubmitVss, updateVss } = useGiVssDb();
    const { venueId } = useParams();
    const { currentUser } = useAuth();
    const { userLocalKindred, getCharacterByUIDAndVSS } = useCharacterDb();
    const [venueData, setVenueData] = useState<any>(null)

    useEffect(() => {
        // Fetch venue data only when venueId changes
        if (venueId) {
            getVssById(venueId, setVenueData);
        }
    }, [venueId, getVssById]);

    useEffect(() => {
        getCharacterByUIDAndVSS(currentUser?.uid ?? '', venueData?.venueStyleSheet.id ?? '');
    }, [currentUser, venueData, getCharacterByUIDAndVSS])

    if (venueData === null) {
        console.log("Loading...");
        return <Center h={"100%"}><div>Loading...</div></Center>;
    }

    if (!venueData) {
        console.log("invalid venue id")
        return <Center h={"100%"}><div>Invalid Venue ID</div></Center>;
    }

    // Check if ST
    const isSt = userData.roles && userData.roles.includes(venueData.venueStyleSheet.storyteller);

    const handleVss = (venueData: any) => {
        if (!venueData.id) {
            onSubmitVss(venueData)
        } else {
            updateVss(venueData.id, venueData)
        }
    }

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '100px' }}>
            <Tabs variant="outline" defaultValue={"vss"} orientation={globals.isPhoneScreen ? "vertical" : "horizontal"}>
                <Stack spacing="0">
                    <Center>
                        <Tabs.List className="no-print">
                            <Tabs.Tab value="vss" pt="">Venue</Tabs.Tab>
                            {isSt ?
                                <Tabs.Tab value="vssEdit" pt="">
                                    vssEdit
                                </Tabs.Tab>
                                : null}
                        </Tabs.List>
                    </Center>

                    <Tabs.Panel value="vss" pt="xs">
                        <DashboardCore venueData={venueData} userLocalKindred={userLocalKindred} />
                    </Tabs.Panel>
                    <Tabs.Panel value="vssEdit" pt="xs">
                        <GiVssEdit vssData={venueData} setVssData={setVenueData} handleVss={handleVss} />
                    </Tabs.Panel>
                </Stack>
            </Tabs>
        </Center>
    )
}
