import { Card, Text, Button, Avatar } from "@mantine/core"
import { globals } from "../../../assets/globals"
import domains from '../../../data/CaM/source/domains.json'
import { FacebookLogo, DiscordLogo, WebLogo } from "../../../assets/images/CaM"
import { User } from "../../../data/CaM/types/User"
import { useUser } from "../../../contexts/UserContext"
import { useAuth } from "../../../contexts/AuthContext"

type DomainCardProps = {
  userData: User
}

export const DomainCard = ({ userData }: DomainCardProps) => {
  const { getUser, updateUser } = useUser()
  const { currentUser } = useAuth()

  const handleDomainChange = async () => {
    try {
      let updatedUser = null;
      if (!userData) {
        const fetchedUserData = await getUser();
        if (fetchedUserData) {
          updatedUser = {
            ...fetchedUserData,
            domain: ""
          };
        } else {
          // Handle case when userData is not available
          console.log('User data not found');
          return;
        }
      } else {
        updatedUser = {
          ...userData,
          domain: ""
        };
      }
      if (currentUser) {
        console.log(updatedUser)
        await updateUser(currentUser.uid, updatedUser);
        localStorage.removeItem("userData")
        window.location.reload();
      } else {
        console.log("User is not authenticated")
      }
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  };


  const domain = domains.find((domain) => domain.id === userData.domain)

  if (domain) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fz={globals.largeFontSize} mb={"lg"}>Domain</Text>
        <Text fz={globals.smallerFontSize}>Name: {domain.name}</Text>
        <Text fz={globals.smallerFontSize}>Coordinator: {domain.coordinator}</Text>
        <Button.Group>
          {domain.links?.facebook ? <Button variant='link' onClick={() => window.open(domain.links.facebook)}><Avatar radius="xs" size="sm" src={FacebookLogo} /> Facebook</Button> : <></>}
          {domain.links?.discord ? <Button variant='link' onClick={() => window.open(domain.links.discord)}><Avatar radius="xs" size="sm" src={DiscordLogo} /> Discord</Button> : <></>}
          {domain.links?.website ? <Button variant='link' onClick={() => window.open(domain.links.website)}><Avatar radius="xs" size="sm" src={WebLogo} /> Website</Button> : <></>}
        </Button.Group>
        <Button variant='link' onClick={() => handleDomainChange()}>Change Domain</Button>
      </Card>
    )
  } else {
    return <></>
  }
}