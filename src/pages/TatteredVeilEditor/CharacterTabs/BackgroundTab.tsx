//Technical Imports
import { Alert, Button, Center, Group, Stack, Text } from "@mantine/core";
//Asset Imports
import { globals } from "../../../assets/globals";
//Context Imports
import { getAuth } from "firebase/auth";
//Component Imports
import MageBackground from "../../../components/TatteredVeil/MageBackgroundSetter";
import MagePublicInfoSetter from "../../../components/TatteredVeil/MagePublicInfoSetter";
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { currentExperience } from "../../../data/TatteredVeil/types/Experience";

type BackgroundPageProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void,
    handleUpdate: () => void,
    setShowRetire: any,
}

const BackgroundPage = ({awakened, setAwakened, handleUpdate, setShowRetire}: BackgroundPageProps) => {
  const {currentUser} = getAuth()

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
      <Stack>

      <MageBackground awakened={awakened} setAwakened={setAwakened}/>
      <MagePublicInfoSetter awakened={awakened} setAwakened={setAwakened} currentUser={currentUser}/>

      </Stack>

      <Alert color={0 > currentExperience(awakened) ? "red" : "dark"} variant="outline" radius="xs" style={{ zIndex: 9999, padding: "0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
                    <Group>
                        <Button.Group>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                disabled={0 > currentExperience(awakened)}
                                onClick={() => handleUpdate()}>
                                Update
                            </Button>
                            <Text fz={globals.smallerFontSize} style={{ margin: "10px" }} color={0 > currentExperience(awakened) ? "#FF6B6B" : "white"}>Remaining Experience: {currentExperience(awakened)}</Text>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={() => setShowRetire(true)}>
                                Retire
                            </Button>
                        </Button.Group>
                    </Group>
                </Alert>
    </Center>
    )
}

export default BackgroundPage