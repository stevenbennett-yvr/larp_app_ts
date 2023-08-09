import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Alert, Card, Center, Text, Group, Stack, Grid, Title } from '@mantine/core';
import { globals } from "../globals"
import DomainSelector from './domain/DomainSelector';
import ChroncileSelector from './chronicle/ChronicleSelector'
import { domainDisplay } from './domain/DomainDisplay';

/* 
  TODO: 
    Create a space for a Domain profile, add a domains Json with domain data.
    Improve user Profile space, ability for user to change their userData. 
    Create game portal cards to take a user to a dedicated game page. ie Tattered Veil, Good Intentions, etc.
    Figma the above items.
*/

export default function Dashboard() {
    //const navigate = useNavigate();
    const { getUser } = useUser();
    const [userData, setUserData] = useState(() => {
      const savedUserData = localStorage.getItem('userData');
      return savedUserData ? JSON.parse(savedUserData) : '';
  });
    const [showDomainSelector, setShowDomainSelector] = useState(false);

  useEffect(() => {
    if (!userData) { // Check if userData is not set
      const fetchUserData = async () => {
        const fetchedUserData = await getUser();
        if (fetchedUserData) {
          setUserData(fetchedUserData);
          setShowDomainSelector(!userData.domain);
          localStorage.setItem('userData', JSON.stringify(fetchedUserData));
        } else {
          console.log("User data not found");
        }
      };
  
      fetchUserData();
    }
  }, [userData, getUser]);

/*   const handleNavigateChronicle = () => {
    navigate("/choose-chronicle");
  }; */

  return (
    <Center h={"100%"}>
      <Stack>
      <Group>
        <Alert mt={globals.isPhoneScreen ? "75px" : "50px"} color='gray' variant='outline'>
          <Group>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text fz={globals.largeFontSize} mb={"lg"}>Profile</Text>
              <Text fz={globals.smallerFontSize}>Email: {userData.email}</Text>
              <Text fz={globals.smallerFontSize}>Cam Number: {userData.camNumber}</Text>
              <Text fz={globals.smallerFontSize}>MC: {userData.mc}</Text>
              <Text fz={globals.smallerFontSize}>Domain: {userData.domain}</Text>
            </Card>
            {domainDisplay(userData)}
          </Group>
        </Alert>
      </Group>
      <Title order={3}>Venue Portals</Title>
      <Grid grow m={0}>
        {ChroncileSelector(userData)}
      </Grid>
      {!userData.domain?
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

