//technical imports
import { Alert, Avatar, Button, Center, Grid, Group, Image, Stack, Table, Text } from "@mantine/core";
import { globals } from "../../../assets/globals";

//data imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { Paths } from "../../../data/TatteredVeil/types/Path";
import { Orders } from "../../../data/TatteredVeil/types/Order";

import { currentAttributeLevel } from "../../../data/TatteredVeil/types/Attributes";
import { currentMeritLevel } from "../../../data/TatteredVeil/types/Merits";
import { currentExperience } from "../../../data/TatteredVeil/types/Experience"
import ExperienceAside from "./components/experienceAside";
import { MageAttributeXpInputs, MageArcanaXpInputs, MageGnosisXpInputs, MageMeritXpInputs, MageRotesXpInputs, MageSkillXpInputs, MageWisdomXpInputs } from "../../../components/TatteredVeil/XpInputs";

type AwakenedSheetProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    handleUpdate: () => void
    setShowRetire: any
}

const AwakenedSheet = ({awakened, setAwakened, handleUpdate, setShowRetire}: AwakenedSheetProps) => {



    const topSection = () => {
        return(
            <Grid columns={9}>
                <Grid.Col span={3} style={{ borderRight: "1px solid #ccc" }}>
                    <Center>
                        <Avatar
                            src={awakened.background.profilePic}
                            size={150}
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, ${Paths[awakened.path].color}, ${Orders[awakened.order].color})`,
                            }}
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col span={3} style={{ borderRight: "1px solid #ccc" }}>
                    <Stack>
                        <Text>Shadow Name: {awakened.name}</Text>
                        <Text>Concept: {awakened.concept}</Text>
                        <Group>
                            <Text>Order: {awakened.order}</Text>
                            <Image
                            fit="contain"
                            height={40}
                            width={40}
                            src={Orders[awakened.order].rune}
                            style={{
                                opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                            }}
                            />
                        </Group>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={3} >
                    <Stack>
                        <Text>Virtue: {awakened.virtue}</Text>
                        <Text>Vice: {awakened.vice}</Text>
                        <Group>
                            <Text>Path: {awakened.path}</Text>
                            <Image
                                fit="contain"
                                height={40}
                                width={40}
                                src={Paths[awakened.path].rune}
                                style={{
                                    opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                                  }}
                            />
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
        )
    }

    //OHTER SECTION

    const otherSection = () => {
        const dexterityLevel = currentAttributeLevel(awakened, 'dexterity').level;
        const strengthLevel = currentAttributeLevel(awakened, 'strength').level;
        const fleetOfFootMerit = awakened.merits.find(merit => merit.name === 'Fleet of Foot');
        const fleetOfFootLevel = fleetOfFootMerit ? currentMeritLevel(fleetOfFootMerit).level : 0;
        const calculatedSpeed = dexterityLevel + strengthLevel + 5 + fleetOfFootLevel;
        const calculateDefense = Math.min(currentAttributeLevel(awakened, 'dexterity').level, currentAttributeLevel(awakened, 'wits').level)

        const fastReflexMerit = awakened.merits.find(merit => merit.name === 'Fast Reflexes');
        const fastReflexLevel = fastReflexMerit ? currentMeritLevel(fastReflexMerit).level : 0;
        const calculateInit = currentAttributeLevel(awakened, 'dexterity').level + currentAttributeLevel(awakened, 'composure').level + fastReflexLevel

        return (
            <Center>
            <Table striped withBorder style={{ maxWidth: "400px" }}>
            <thead>
                <tr>
                <th>Size</th>
                <th>Speed</th>
                <th>Defense</th>
                <th>Init Mod</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td style={{ textAlign: 'center' }}>
                    {awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5}
                </td>
                <td style={{ textAlign: 'center' }}>
                    {calculatedSpeed}
                </td>
                <td style={{ textAlign: 'center' }}>
                    {calculateDefense}
                </td>
                <td style={{ textAlign: 'center' }}>
                    {calculateInit}
                </td>
                </tr>
            </tbody>
            </Table>
            </Center>
        )
    }

    // END RETURN SECTION

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
            <Stack>

                {topSection()}
                {otherSection()}

                <MageAttributeXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageSkillXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageArcanaXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageRotesXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageMeritXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageGnosisXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageWisdomXpInputs awakened={awakened} setAwakened={setAwakened} />

            <Alert color={0 > currentExperience(awakened)?"red":"dark"} variant="outline" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
              <Group>
                <Button.Group>
                <Button 
                style={{ margin: "5px" }}
                color="gray"
                disabled={0 > currentExperience(awakened)} 
                onClick={() => handleUpdate()}>
                  Update
                </Button>    
                   <Text fz={globals.smallerFontSize} style={{ margin: "10px"}} color={0 > currentExperience(awakened)?"#FF6B6B":"white"}>Remaining Experience: {currentExperience(awakened)}</Text>
                <Button 
                style={{ margin: "5px" }}
                color="gray"
                onClick={() => setShowRetire(true)}>
                  Retire
              </Button>
              </Button.Group>
            </Group>
            </Alert>
            </Stack>
            <ExperienceAside awakened={awakened}></ExperienceAside>

        </Center>
    )
}

export default AwakenedSheet