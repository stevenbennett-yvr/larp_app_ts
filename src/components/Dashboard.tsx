import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Alert, Card, Center, Text, Button } from '@mantine/core';
import { globals } from "../globals"
import { useNavigate } from "react-router-dom";

/* 
  TODO: 
    Create a space for a Domain profile, add a domains Json with domain data.
    Improve user Profile space, ability for user to change their userData. 
    Create game portal cards to take a user to a dedicated game page. ie Tattered Veil, Good Intentions, etc.
    Figma the above items.
*/

export default function Dashboard() {
    const navigate = useNavigate();
    const { getUser } = useUser();
    const [userData, setUserData] = useState(() => {
      const savedUserData = localStorage.getItem('userData');
      return savedUserData ? JSON.parse(savedUserData) : '';
  });

    useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser();
      if (userData) {
        // User data exists, set it in the state
        setUserData(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        // User data does not exist
        console.log("User data not found");
      }
    };

    fetchUserData();
  }, [getUser]);

  const handleNavigateChronicle = () => {
    navigate("/choose-chronicle");
  };

      return (
        <Center h={"100%"}>
        <Alert mt={globals.isPhoneScreen ? "75px" : "50px"} color='gray' variant='outline'>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text fz={globals.largeFontSize} mb={"lg"}>Profile</Text>
              <Text fz={globals.smallerFontSize}>Email: {userData.email}</Text>
              <Text fz={globals.smallerFontSize}>Cam Number: {userData.camNumber}</Text>
              <Text fz={globals.smallerFontSize}>MC: {userData.mc}</Text>
              <Text fz={globals.smallerFontSize}>Domain: {userData.domain}</Text>
            </Card>
            <Button onClick={handleNavigateChronicle}>Create Character</Button>
        </Alert>
        </Center>
      )

}

