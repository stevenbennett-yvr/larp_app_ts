import { useState, useEffect } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { useUser } from '../../contexts/UserContext';
import { Alert, Card, Center, Text, Group, Stack, Grid, Title } from '@mantine/core';
import { globals } from "../../assets/globals"
import DomainSelector from './components/DomainSelector';
import ChroncileSelector from './components/ChronicleSelector';
import { DomainCard } from './components/DomainDisplay';
import { getEmptyUser } from '../../data/CaM/types/User';

/* 
  TODO: 
    Create a space for a Domain profile, add a domains Json with domain data.
    Improve user Profile space, ability for user to change their userData. 
    Create game portal cards to take a user to a dedicated game page. ie Tattered Veil, Good Intentions, etc.
    Figma the above items.
*/

export default function Dashboard() {
  //const navigate = useNavigate();
  const { fetchUserData } = useUser();
  const [userData, setUserData] = useLocalStorage({key:'userData', defaultValue: getEmptyUser() });
  const [showDomainSelector, setShowDomainSelector] = useState(false);

  useEffect(() => {
    if (userData.uid==="") {
      fetchUserData(setUserData);
    }
  }, [fetchUserData, userData, setUserData]);

  useEffect(() => {
    if (userData.uid!==""&&userData.domain==="") {
      setShowDomainSelector(true)
    }
  }, [userData])

  return (
    <Center h={"100%"}>
      <Stack>
        <Group>
          <Alert mt={globals.isPhoneScreen ? "75px" : "50px"} color='gray' variant='outline'>
            <Group>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fz={globals.largeFontSize} mb={"lg"}>Profile</Text>
                <Text fz={globals.smallerFontSize}>Email: {userData.email}</Text>
                <Text fz={globals.smallerFontSize}>MC: {userData.mc}</Text>
                <Text fz={globals.smallerFontSize}>Domain: {userData.domain}</Text>
              </Card>
              <DomainCard userData={userData} setShowDomainSelector={setShowDomainSelector} />
            </Group>
          </Alert>
        </Group>
        <Title order={3}>Venue Portals</Title>
        <Grid grow m={0}>
          {ChroncileSelector(userData)}
        </Grid>
        {showDomainSelector ?
          <DomainSelector
            showDomainSelector={showDomainSelector}
            setShowDomainSelector={setShowDomainSelector}
            userData={userData}
          />
          :
          <></>
        }
      </Stack>
    </Center>
  )
}