//technical imports
import { Alert, Button, Center, Group, Stack, Table, Text } from "@mantine/core";
import { globals } from "../../../assets/globals";
import { useState, useEffect } from "react";

//data imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";

import { nWoD1eCurrentAttributeLevel } from "../../../data/nWoD1e/nWoD1eAttributes";
import { currentMeritLevel } from "../../../data/TatteredVeil/types/Merits";
import { currentExperience } from "../../../data/TatteredVeil/types/Experience"
import ExperienceAside from "./components/experienceAside";
import { MageAttributeXpInputs, MageArcanaXpInputs, MageGnosisXpInputs, MageMeritXpInputs, MageRotesXpInputs, MageSkillXpInputs, MageWisdomXpInputs } from "../../../components/TatteredVeil/XpInputs";
import { TopSection } from "../../../components/TatteredVeil/TopSection";

type AwakenedSheetProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    handleUpdate: () => void
    setShowRetire: any
}

const AwakenedSheet = ({ awakened, setAwakened, handleUpdate, setShowRetire }: AwakenedSheetProps) => {

    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])


    //OHTER SECTION

    const otherSection = () => {
        const dexterityLevel = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level;
        const strengthLevel = nWoD1eCurrentAttributeLevel(awakened, 'strength').level;
        const fleetOfFootMerit = awakened.merits.find(merit => merit.name === 'Fleet of Foot');
        const fleetOfFootLevel = fleetOfFootMerit ? currentMeritLevel(fleetOfFootMerit).level : 0;
        const calculatedSpeed = dexterityLevel + strengthLevel + 5 + fleetOfFootLevel;
        const calculateDefense = Math.min(nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level, nWoD1eCurrentAttributeLevel(awakened, 'wits').level)

        const fastReflexMerit = awakened.merits.find(merit => merit.name === 'Fast Reflexes');
        const fastReflexLevel = fastReflexMerit ? currentMeritLevel(fastReflexMerit).level : 0;
        const calculateInit = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level + nWoD1eCurrentAttributeLevel(awakened, 'composure').level + fastReflexLevel

        return (
            <Center>
                {globals.isPhoneScreen ?
                    <Table striped withBorder fontSize="sm" style={{ maxWidth: "100px" }}>
                        <tbody>
                            <tr>
                                <td>
                                    Size: 
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Speed: 
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculatedSpeed}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Defense: 
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateDefense}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Init: 
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateInit}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    :
                    <Table striped withBorder fontSize="xs" style={{ maxWidth: "400px" }}>
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
                }
            </Center>
        )
    }

    // END RETURN SECTION

    return (
        <Center>
            <Stack>

                <TopSection awakened={awakened} />
                {otherSection()}

                <MageAttributeXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageSkillXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageArcanaXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageRotesXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageMeritXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageGnosisXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageWisdomXpInputs awakened={awakened} setAwakened={setAwakened} />

                <Alert color={0 > currentExperience(awakened) ? "red" : "dark"} variant="outline" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
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
            </Stack>
            {showAsideBar ? <ExperienceAside awakened={awakened}></ExperienceAside> : <></>} 

        </Center>
    )
}

export default AwakenedSheet