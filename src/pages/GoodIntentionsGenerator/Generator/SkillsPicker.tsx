import { Grid, Text, Tooltip, NumberInput, Center, Stack, Button, Group, Alert } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { V5SkillsKey, skillsDescriptions, getV5SkillCPArray } from "../../../data/GoodIntentions/types/V5Skills"
import { globals } from "../../../assets/globals"
import { upcase } from "../../../utils/case"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faComment, faHandFist } from "@fortawesome/free-solid-svg-icons"
import { SkillCategory } from "../../../data/nWoD1e/nWoD1eSkills"
//import { SpecialtyModal } from "./SpecialtyModal"

type SkillsPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void,
    backStep: () => void,
}

const SkillsPicker = ({ kindred, setKindred, nextStep, backStep }: SkillsPickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const pointsArray = getV5SkillCPArray(kindred)
    const checkSkillArray = (pointsArray: number[]) => {
        const counts: any = {
            1: 0,
            2: 0,
            3: 0,
        }

        pointsArray.forEach((value) => {
            if (value in counts) {
                counts[value]++;
            }
        });

        // Check if the counts match the expected values
        const totalResult =
            counts[1] === 7 && counts[2] === 5 && counts[3] === 3;

        // Individual results
        const individualResults = {
            1: counts[1] === 7,
            2: counts[2] === 5,
            3: counts[3] === 3,
        };

        return { totalResult, individualResults };
    }
    const check = checkSkillArray(pointsArray).individualResults

    function changeCreationPoints(
        skill: V5SkillsKey,
        creationPoints: number,
    ): void {

        const updatedAttributes = {
            ...kindred.skills,
            [skill]: {
                ...kindred.skills[skill],
                creationPoints
            }
        }

        const updatedCharacter = {
            ...kindred,
            skills: updatedAttributes
        }

        setKindred(updatedCharacter)
    }

    const categoryIcons = {
        mental: faBrain,
        physical: faHandFist,
        social: faComment,
    }

    const skillCategories = ['physical', 'social', 'mental'] as SkillCategory[]
    
    const skillInputs = skillCategories.map(category => {
        return (
            <Grid.Col
                span={globals.isPhoneScreen ? "content" : 4}
                key={`${category} Skills`}
            >
                <Text fw={500} fz="lg" color="dimmed" ta="center">
                    <FontAwesomeIcon icon={categoryIcons[category]} /> {' '}
                    {upcase(category)}
                </Text>
                <hr />
                {Object.entries(kindred.skills).map(([skill, skillInfo]) => {
                    const typedAttribute = skill as V5SkillsKey
                    if (skillInfo.category === category) {
                        return (
                            <div
                                key={`${skill} input`}
                            >
                                <Tooltip
                                    multiline
                                    width={220}
                                    withArrow
                                    offset={20}
                                    transitionProps={{ duration: 200 }}
                                    label={skillsDescriptions[typedAttribute]}
                                    position={globals.isPhoneScreen ? "bottom" : "top"}
                                    events={{ hover: true, focus: false, touch: false }}
                                >
                                    <NumberInput
                                        key={`${category}-${skill}`}
                                        label={`${upcase(skill)}`}
                                        min={
                                            0
                                        }
                                        max={!check[3] ? 3 : !check[2] ? 2 : 1}
                                        value={skillInfo.creationPoints}
                                        onChange={(val: number) =>
                                            changeCreationPoints(
                                                typedAttribute,
                                                val
                                            )
                                        }

                                    />
                                </Tooltip>
                            </div>
                        )
                    }
                    else {
                        return null
                    };
                })}
            </Grid.Col>
        )

    })


    const threeStyle = !check[3] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const twoStyle = !check[2] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const oneStyle = !check[1] ? { fontSize: globals.smallFontSize } : { color: "grey" }

    return (
        <Center style={{ paddingTop: isPhoneScreen ? '60px' : '60px', paddingBottom: isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={""} align="center" spacing="md">

                <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Attributes</Text>
                <Group ta={"center"}>
                    <Text style={threeStyle}>
                        Take three Skills at 3; 
                    </Text>
                    <Text style={twoStyle}>
                        five Skills at 2; 
                    </Text>
                    <Text style={oneStyle}>
                        and seven Skills at 1
                    </Text>
                </Group>

                <Grid gutter="lg" justify="center">
                    {skillInputs}
                </Grid>

                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
                    <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
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
                            disabled={!checkSkillArray(pointsArray).totalResult}
                            onClick={nextStep}
                        >
                            Next
                        </Button>
                    </Alert>
                </Button.Group>
            </Stack>
        </Center>

    )
}

export default SkillsPicker