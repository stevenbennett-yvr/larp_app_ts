import { Button, ScrollArea, Text, Alert } from "@mantine/core"
import { useState } from "react"
import { PredatorTypeName, PredatorType } from "../../../data/GoodIntentions/types/V5PredatorType"
import { globals } from "../../../assets/globals"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import PredatorModal from "./PredatorModal"
import PredatorGrid from "../../../components/GoodIntentions/Generator/PredatorGrid"

type PredatorTypePickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const PredatorTypePicker = ({ kindred, setKindred, nextStep, backStep }: PredatorTypePickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const [pickedPredatorType, setPickedPredatorType] = useState<PredatorTypeName>("")
    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setPickedPredatorType('');
        setModalOpen(false);
    };
    const [predatorData, setPredatorData] = useState<PredatorType>();

    const height = globals.viewportHeightPx
    const heightBreakPoint = 1250
    return (
        <div style={{ width: "100%", marginTop: height < heightBreakPoint ? "50px" : "55px" }}>
            <Text fz={globals.largeFontSize} ta={"center"}>How do you <b>obtain blood?</b></Text>

            {height < heightBreakPoint
                ? <ScrollArea h={height - 230}>
                    <PredatorGrid kindred={kindred} setPickedPredatorType={setPickedPredatorType} setModalOpen={setModalOpen} setPredatorData={setPredatorData} />
                </ScrollArea>
                :<PredatorGrid kindred={kindred} setPickedPredatorType={setPickedPredatorType} setModalOpen={setModalOpen} setPredatorData={setPredatorData} />
            }

            {!predatorData ? null :
                <PredatorModal modalOpened={modalOpen} closeModal={handleCloseModal} kindred={kindred} setKindred={setKindred} nextStep={nextStep} pickedPredatorType={pickedPredatorType} predatorData={predatorData} setPredatorData={setPredatorData} />
            }
            <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
                <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
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
                                disabled={kindred.predatorType===""}
                            >
                                Next
                            </Button>
                        </Button.Group>

                </Alert>
            </Button.Group>

        </div>
    )
}


export default PredatorTypePicker