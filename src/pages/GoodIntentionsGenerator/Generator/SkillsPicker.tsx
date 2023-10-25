import { Text, Center, Stack, Button, Group, Alert, ScrollArea } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { V5SkillsKey, getV5SkillCPArray, v5SkillLevel } from "../../../data/GoodIntentions/types/V5Skills"
import { globals } from "../../../assets/globals"
import { SpecialtyModal } from "./SpecialtyModal"
import { useState } from "react"
import SkillGrid from "../../../components/GoodIntentions/Generator/SkillGrid"

type SkillsPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void,
    backStep: () => void,
}

const SkillsPicker = ({ kindred, setKindred, nextStep, backStep }: SkillsPickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

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


    const specialtySkills: V5SkillsKey[] = ["crafts", "performance", "academics", "science"];

    let totalSpecialtySkillLevel = 0;

    for (const skill of specialtySkills) {
        const skillLevel = v5SkillLevel(kindred, skill).level;

        totalSpecialtySkillLevel += skillLevel;
    }

    const threeStyle = !check[3] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const twoStyle = !check[2] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const oneStyle = !check[1] ? { fontSize: globals.smallFontSize } : { color: "grey" }
    const height = globals.viewportHeightPx
    return (
        <Center style={{ paddingTop: isPhoneScreen ? '60px' : '60px', paddingBottom: isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={""} align="center" spacing="md">

                <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Skills</Text>
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

                <ScrollArea h={height - 315} w={"100%"} p={20}>
                    <SkillGrid kindred={kindred} setKindred={setKindred} check={check} />
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
                            disabled={!checkSkillArray(pointsArray).totalResult}
                            onClick={() => {
                                if (totalSpecialtySkillLevel === 0) { nextStep() }
                                else { handleOpenModal() }
                            }}
                        >
                            Next
                        </Button>
                    </Alert>
                </Button.Group>
            </Stack>
            <SpecialtyModal modalOpened={modalOpen} closeModal={handleCloseModal} setCharacter={setKindred} nextStep={nextStep} character={kindred} ></SpecialtyModal>
        </Center>

    )
}

export default SkillsPicker