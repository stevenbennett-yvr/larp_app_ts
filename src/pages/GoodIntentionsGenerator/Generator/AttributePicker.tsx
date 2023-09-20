import { Button, Text, Alert, Center, Grid, Tooltip, NumberInput, Stack, Group } from "@mantine/core"
import { V5AttributesKey, attributeDescriptions, getV5AttributeCPArray, AttributeCategory } from "../../../data/GoodIntentions/types/V5Attributes"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { upcase } from "../../../utils/case"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faComment, faHandFist } from "@fortawesome/free-solid-svg-icons"

type AttributePickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void,
    backStep: () => void,
}

const AttributePicker = ({ kindred, setKindred, nextStep, backStep }: AttributePickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const pointsArray = getV5AttributeCPArray(kindred)
    const checkAttributeArray = (pointsArray: number[]) => {
        // Count the occurrences of each value
        const counts: any = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
        };

        pointsArray.forEach((value) => {
            if (value in counts) {
                counts[value]++;
            }
        });

        // Check if the counts match the expected values
        const totalResult =
            counts[1] === 1 && counts[2] === 4 && counts[3] === 3 && counts[4] === 1;

        // Individual results
        const individualResults = {
            1: counts[1] === 1,
            2: counts[2] === 4,
            3: counts[3] === 3,
            4: counts[4] === 1,
        };

        return { totalResult, individualResults };
    };

    function changeCreationPoints(
        attribute: V5AttributesKey,
        creationPoints: number,
    ): void {

        const updatedAttributes = {
            ...kindred.attributes,
            [attribute]: {
                ...kindred.attributes[attribute],
                creationPoints
            }
        }

        const updatedCharacter = {
            ...kindred,
            attributes: updatedAttributes
        }

        setKindred(updatedCharacter)
    }
    const check = checkAttributeArray(pointsArray).individualResults

    const categoryIcons = {
        mental: faBrain,
        physical: faHandFist,
        social: faComment,
    }

    const attributeCategories = ['physical', 'social', 'mental'] as AttributeCategory[]
    const attributeInputs = attributeCategories.map(category => {
        return (
            <Grid.Col
                span={globals.isPhoneScreen ? "content" : 4}
                key={`${category} Attributes`}
            >
                <Text fw={500} fz="lg" color="dimmed" ta="center">
                    <FontAwesomeIcon icon={categoryIcons[category]} /> {' '}
                    {upcase(category)}
                </Text>
                <hr />
                {Object.entries(kindred.attributes).map(([attribute, attributeInfo]) => {
                    const typedAttribute = attribute as V5AttributesKey
                    if (attributeInfo.category === category) {
                        return (
                            <div
                                key={`${attribute} input`}
                            >
                                <Tooltip
                                    multiline
                                    width={220}
                                    withArrow
                                    offset={20}
                                    transitionProps={{ duration: 200 }}
                                    label={attributeDescriptions[typedAttribute]}
                                    position={globals.isPhoneScreen ? "bottom" : "top"}
                                    events={{ hover: true, focus: false, touch: false }}
                                >
                                    <NumberInput
                                        key={`${category}-${attribute}`}
                                        label={`${upcase(attribute)}`}
                                        min={
                                            1
                                        }
                                        max={!check[4] ? 4 : !check[3] ? 3 : !check[2] ? 2 : 1}
                                        value={attributeInfo.creationPoints}
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

    const fourStyle = !check[4] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const threeStyle = !check[3] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const twoStyle = !check[2] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const oneStyle = !check[1] ? { fontSize: globals.smallFontSize } : { color: "grey" }

    return (
        <Center style={{ paddingTop: isPhoneScreen ? '60px' : '60px', paddingBottom: isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={""} align="center" spacing="md">

                <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Attributes</Text>
                <Group ta={"center"}>
                    <Text style={fourStyle}>
                        Take one Attribute at 4;
                    </Text>
                    <Text style={threeStyle}>
                        three Attributes at 3;
                    </Text>
                    <Text style={twoStyle}>
                        four Attributes at 2;
                    </Text>
                    <Text style={oneStyle}>
                        one Attribute at 1
                    </Text>
                </Group>

                <Grid gutter="lg" justify="center">
                    {attributeInputs}
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
                            disabled={!checkAttributeArray(pointsArray).totalResult}
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

export default AttributePicker