import { ScrollArea, Button, Text, Alert, Center, Stack, Group } from "@mantine/core"
import { getV5AttributeCPArray } from "../../../data/GoodIntentions/types/V5Attributes"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import AttributeGrid from "../../../components/GoodIntentions/Generator/AttributeGrid"

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

    const check = checkAttributeArray(pointsArray).individualResults

    const fourStyle = !check[4] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const threeStyle = !check[3] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const twoStyle = !check[2] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const oneStyle = !check[1] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const height = globals.viewportHeightPx

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
                <ScrollArea h={height - 315} w={"100%"} p={20}>
                    <AttributeGrid kindred={kindred} setKindred={setKindred} check={check} />
                </ScrollArea>
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