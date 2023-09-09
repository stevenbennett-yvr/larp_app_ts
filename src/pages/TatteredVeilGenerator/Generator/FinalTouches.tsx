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



type FinalTouchesProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    backStep: () => void
    nextStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const FinalTouches = ({awakened, setAwakened, backStep, nextStep, showInstructions, setShowInstructions}: FinalTouchesProps) => {
  const {currentUser} = getAuth()

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions)
  }

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
      <Stack>

        <Alert color="gray">
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Final Touches</Text>
                {showInstructions && (
                <div>
                  <p>{`You have the option to provide further details about your character, but it's not mandatory at this stage. If you feel comfortable with the information you've already provided and want to proceed, you can submit your character sheet now and return later to fill in these additional details.`}</p>
                  <hr></hr>
                  <p>{`Now, you have the opportunity to breathe life into your character by describing various aspects that make them unique and interesting. Consider their personality, background, motivations, and desires. What kind of person are they? What drives them? How did they acquire their skills and abilities? What are their defining traits?`}</p>
                  <p>{`While providing these additional details, remember that brevity is important. You don't need to write an extensive backstory or a long essay. Aim to convey the essence of your character in a concise manner. Keep your backstory to less than one page and summarize your character's goals and description within a single paragraph.`}</p>
                  <p>{`It's worth noting that LARP is often improvisational and dynamic. What happens during the game can shape and define your character's story. Details that emerge during the course of play can have a more significant impact than those written on your character sheet. So, while these details are important for setting the stage, be prepared for unexpected twists and turns that may occur during the LARP experience.`}</p>
                </div>
                )}
            <Center>
            <Button variant="outline" color="gray" onClick={toggleInstructions}>
                {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
            </Button>
            </Center>
        </Alert>

        <MageBackground awakened={awakened} setAwakened={setAwakened} />

        <MagePublicInfoSetter awakened={awakened} setAwakened={setAwakened} currentUser={currentUser}/>

      </Stack>

      <Alert color="dark" variant="filled" radius="xs" style={{ zIndex:9999, padding:"0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
          <Group>
              <Button.Group>
                  <Button
                      style={{ margin: "5px" }}
                      color="gray"
                      onClick={backStep}
                  >
                      Back
                  </Button>
                  <Button
                      style={{ margin: "5px" }}
                      color="gray"
                      onClick={() => {
                      nextStep()
                      }}
                  >
                      Next
                  </Button>
              </Button.Group>
          </Group>
      </Alert>
    </Center>
    )
}

export default FinalTouches