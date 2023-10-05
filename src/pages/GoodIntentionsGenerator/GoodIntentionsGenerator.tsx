import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred"
import { useLocalStorage } from "@mantine/hooks"

import ClanPicker from "./Generator/ClanPicker"
import AttributePicker from "./Generator/AttributePicker"
import SkillsPicker from './Generator/SkillsPicker'
import GenerationPicker from "./Generator/GenerationPicker"
import PredatorTypePicker from "./Generator/PredatorPicker"
import DisciplinesPicker from "./Generator/DisciplinePicker"
import BackgroundPicker from "./Generator/BackgroundPicker"
import MeritPicker from "./Generator/MeritPicker"
import V5ExperienceAssigner from './Generator/ExperienceAssigner'
import CoreConcept from "./Generator/CoreConcept"
import V5PrintSheet from './Generator/PrintSheet'

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
            case 2:
                return (
                    <SkillsPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 3:
                return (
                    <GenerationPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 4: 
                return (
                    <PredatorTypePicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 5:
                // Backgrounds and Loresheets
                return (
                    <BackgroundPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 6: 
                // Merits and Flaws
                return (
                    <MeritPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 7:
                return (
                    <DisciplinesPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 8:
                // Spending Init XP
                return (
                    <V5ExperienceAssigner kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 9:
                // Backstory shit
                return (
                    <CoreConcept kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 10:
                return (
                    <V5PrintSheet kindred={kindred} backStep={() => { setSelectedStep(selectedStep - 1); }} />
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