import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred"
import { useLocalStorage } from "@mantine/hooks"

import SectPicker from "./Generator/SectPicker"
import ClanPicker from "./Generator/ClanPicker"
import AttributePicker from "./Generator/AttributePicker"
import SkillsPicker from './Generator/SkillsPicker'
import GenerationPicker from "./Generator/GenerationPicker"
import PredatorTypePicker from "./Generator/PredatorPicker"
import DisciplinesPicker from "./Generator/DisciplinePicker"
import MeritPicker from "./Generator/MeritPicker"
import V5ExperienceAssigner from './Generator/ExperienceAssigner'
import CoreConcept from "./Generator/Basics"
import V5PrintSheet from './Generator/PrintSheet'
import BackgroundLoreTabs from './Generator/BackgroundLoreTabs'
import SideSheet from "./Generator/sidebars/SideSheet"
import AsideBar from "./Generator/sidebars/GeneratorAside"

import { Center } from "@mantine/core"


const GenerateKindred = () => {
    const [kindred, setKindred] = useLocalStorage<Kindred>({ key: "kindred", defaultValue: getEmptyKindred()})
    const [selectedStep, setSelectedStep] = useLocalStorage({ key: "goodIntentionsSelectedStep", defaultValue: 0 })
//    const [showInstructions, setShowInstructions] = useLocalStorage({ key: "goodIntentionsShowInstructions", defaultValue: false });

    const getStepComponent = () => {
        switch (selectedStep) {
            case 0:
                return (
                    <SectPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} />
                );
            case 1:
                return (
                    <ClanPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                );
            case 2:
                return (
                    <AttributePicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 3:
                return (
                    <SkillsPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + (kindred.clan==="Ghoul"? 3:1)); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 4:
                return (
                    <GenerationPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 5: 
                return (
                    <PredatorTypePicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 6:
                // Backgrounds and Loresheets
                return (
                    <BackgroundLoreTabs kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - (kindred.clan==="Ghoul"? 3:1)); }} />
                )
            case 7: 
                // Merits and Flaws
                return (
                    <MeritPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + (kindred.clan==="Thin-Blood"||kindred.clan==="Ghoul"? 2:1)); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 8:
                return (
                    <DisciplinesPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 9:
                // Spending Init XP
                return (
                    <V5ExperienceAssigner kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - (kindred.clan==="Thin-Blood"||kindred.clan==="Ghoul"? 2:1)); }} />
                )
            case 10:
                // Backstory shit
                return (
                    <CoreConcept kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 11:
                return (
                    <V5PrintSheet kindred={kindred} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            default:
                return null;
        }
    }


    return (
        <Center h={"100%"}>
            <SideSheet kindred={kindred}/>
            <AsideBar selectedStep={selectedStep} kindred={kindred} />
            {getStepComponent()}
        </Center>
    )
};

export default GenerateKindred