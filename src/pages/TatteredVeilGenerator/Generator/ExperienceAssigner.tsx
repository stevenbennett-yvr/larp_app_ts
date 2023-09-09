//technical imports
import { Alert, Button, Center, Group, Stack, Text } from "@mantine/core";
import { globals } from "../../../assets/globals";

//data imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { currentExperience, spentExperience } from "../../../data/TatteredVeil/types/Experience"
import { MageAttributeXpInputs, MageSkillXpInputs, MageArcanaXpInputs, MageRotesXpInputs, MageMeritXpInputs, MageGnosisXpInputs, MageWisdomXpInputs } from "../../../components/TatteredVeil/XpInputs";

type ExperienceAssignerProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    nextStep: () => void
    backStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const ExperienceAssigner = ({ awakened, setAwakened, nextStep, backStep, showInstructions, setShowInstructions }: ExperienceAssignerProps) => {

    // END RETURN SECTION

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack>
                <Alert color="gray">
                    <Text mt={"xl"} ta="center" fz="xl" fw={700}>Experience</Text>
                    {showInstructions && (
                        <div>
                            <p>
                                Experience is a valuable resource that represents the growth and development of your character. This application will automatically calculate and update your experience based on your character creation date.
                            </p>
                            <Button variant='link' onClick={() => window.open("https://docs.google.com/document/d/1tGEVoGNRznyU0rvCDIXxGkX3kIO6RoDrEosl1t7-pfs/edit#heading=h.qpwncemu56lp")}>For more information on the experience system, click here.</Button>
                            <p>
                                XP serves as a currency that allows you to improve and customize your character over time. It provides opportunities to enhance your abilities, learn new skills, acquire additional powers and deepen your characters story.
                            </p>
                            <p>
                                Experience Point Costs are auto calculated below, but base costs are listed.
                            </p>
                            <ul>
                                <li><strong>Attributes and Skills:</strong> <i>New level x 5</i> for attributes and <i>New level x 3</i> for skills.</li>
                                <li><strong>Skill Specialty:</strong> Developing a skill specialty costs <i>3</i> XP.</li>
                                <li><strong>Ruling Arcana*:</strong> Advancing the ruling Arcana costs <i>New level x 6</i> XP.</li>
                                <li><strong>Common Arcana*:</strong> Advancing the common Arcana costs <i>New level x 7</i> XP.</li>
                                <li><strong>Inferior Arcanum*:</strong> Advancing the inferior Arcanum costs <i>New level x 8</i> XP.</li>
                                <li><strong>Rote:</strong> Purchasing a rote costs <i>2</i> XP per level.</li>
                                <li><strong>Merit:</strong> Acquiring a new merit costs <i>New level x 2</i> XP.</li>
                                <li><strong>Gnosis:</strong> Increasing Gnosis costs <i>New level x 8</i> XP.</li>
                                <li><strong>Wisdom:</strong> Increasing Wisdom costs <i>New level x 3</i> XP.</li>
                            </ul>
                        </div>
                    )}
                    <Center>
                        <Button variant="outline" color="gray" onClick={toggleInstructions}>
                            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                        </Button>
                    </Center>
                </Alert>

                <MageAttributeXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageSkillXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageArcanaXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageRotesXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageMeritXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageGnosisXpInputs awakened={awakened} setAwakened={setAwakened} />
                <MageWisdomXpInputs awakened={awakened} setAwakened={setAwakened} />


                <Alert color={0 > currentExperience(awakened) ? "red" : "dark"} variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
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
                                onClick={nextStep}
                                disabled={!(spentExperience(awakened) >= 50) || 0 > currentExperience(awakened)}
                            >
                                Next
                            </Button>
                            <Text fz={globals.smallerFontSize} style={{ margin: "10px" }} color={0 > currentExperience(awakened) ? "black" : "white"}>Remaining Experience: {currentExperience(awakened)}</Text>
                        </Button.Group>
                    </Group>
                </Alert>
            </Stack>
        </Center>
    )
}

export default ExperienceAssigner