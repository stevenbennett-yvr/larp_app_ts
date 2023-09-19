import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred"
import { useLocalStorage } from "@mantine/hooks"


import ClanPicker from "./Generator/ClanPicker"
import AttributePicker from "./Generator/AttributePicker"

import { Center } from "@mantine/core"


const GenerateKindred = () => {
    const [kindred, setKindred] = useLocalStorage<Kindred>({ key: "kindred", defaultValue: getEmptyKindred()})
    const [selectedStep, setSelectedStep] = useLocalStorage({ key: "goodIntentionsSelectedStep", defaultValue: 0 })
//    const [showInstructions, setShowInstructions] = useLocalStorage({ key: "goodIntentionsShowInstructions", defaultValue: false });

    const getStepComponent = () => {
        switch (selectedStep) {
            case 0:
                return (
                    <ClanPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} />
                );
            case 1:
                return (
                    <AttributePicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            default:
                return null;
        }
    }


    return (
        <Center h={"100%"}>
            {getStepComponent()}
        </Center>
    )
};

export default GenerateKindred