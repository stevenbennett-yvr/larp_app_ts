import { useEffect } from "react";
import { Center } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { useParams, useNavigate } from "react-router-dom";

//Contexts
import { useAuth } from "../../contexts/AuthContext";
import { useCharacterDb } from "../../contexts/CharacterContext";

// Data
import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred"
import { GoodIntentionsVSSs } from "../../data/CaM/types/VSS";

//Components
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

import changeLog from "../../utils/GoodIntentions/LoggingTool";

const GenerateKindred = () => {
    const { onSubmitCharacter, userLocalKindred, getCharacterByUIDAndVSS } = useCharacterDb()

    const { venueId } = useParams();
    const venueData = GoodIntentionsVSSs.find((venue) => venue.venueStyleSheet.id === venueId);
    const navigate = useNavigate();

    const { currentUser } = useAuth()

    const [kindred, setKindred] = useLocalStorage<Kindred>({ key: `kindred:${venueId}`, defaultValue: getEmptyKindred() });
    const [selectedStep, setSelectedStep] = useLocalStorage({ key: `goodIntentionsSelectedStep:${venueId}`, defaultValue: 0 });

    useEffect(() => {
        getCharacterByUIDAndVSS(currentUser?.uid ?? '', venueData?.venueStyleSheet.id ?? '');
    }, [])


    if (userLocalKindred.length > 0 && venueId !== "GI-000") {
        return <Center h={"100%"}><div>Character exists for this user in this VSS</div></Center>;
    }

    if (!venueData) {
        return <Center h={"100%"}><div>Invalid Venue ID</div></Center>;
    }

    if (!currentUser) {
        console.log("Invalid User")
    }

    async function handleSubmit() {
        try {
            if (!currentUser || !venueId) {
                console.error("User data or uid is not available.");
                return;
            };

            const updatedKindred = {
                ...kindred,
                uid: currentUser.uid,
                email: currentUser.email,
                vssId: venueId,
                changeLogs: {
                    ...kindred.changeLogs,
                    [new Date().toISOString()]: changeLog(getEmptyKindred(), kindred)
                }
            };
            await onSubmitCharacter(updatedKindred)

            localStorage.clear();
            navigate(`/good-intentions/${venueId}`)
        } catch {
            console.log("Failed to create character");
        }
    }

    const getStepComponent = () => {
        switch (selectedStep) {
            case 0:
                return (
                    <SectPicker kindred={kindred} setKindred={setKindred} venueData={venueData} nextStep={() => { setSelectedStep(selectedStep + 1); }} />
                );
            case 1:
                return (
                    <ClanPicker kindred={kindred} setKindred={setKindred} venueData={venueData} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                );
            case 2:
                return (
                    <AttributePicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 3:
                return (
                    <SkillsPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + (kindred.clan === "Ghoul" ? 3 : 1)); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 4:
                return (
                    <GenerationPicker kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 5:
                return (
                    <PredatorTypePicker kindred={kindred} setKindred={setKindred} venueData={venueData} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 6:
                // Backgrounds and Loresheets
                return (
                    <BackgroundLoreTabs kindred={kindred} setKindred={setKindred} venueData={venueData} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - (kindred.clan === "Ghoul" ? 3 : 1)); }} />
                )
            case 7:
                // Merits and Flaws
                return (
                    <MeritPicker kindred={kindred} setKindred={setKindred} venueData={venueData} nextStep={() => { setSelectedStep(selectedStep + (kindred.clan === "Thin-Blood" || kindred.clan === "Ghoul" ? 2 : 1)); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 8:
                return (
                    <DisciplinesPicker kindred={kindred} setKindred={setKindred} venueData={venueData} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 9:
                // Spending Init XP
                return (
                    <V5ExperienceAssigner kindred={kindred} setKindred={setKindred} venueData={venueData} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - (kindred.clan === "Thin-Blood" || kindred.clan === "Ghoul" ? 2 : 1)); }} />
                )
            case 10:
                // Backstory shit
                return (
                    <CoreConcept kindred={kindred} setKindred={setKindred} nextStep={() => { setSelectedStep(selectedStep + 1); }} backStep={() => { setSelectedStep(selectedStep - 1); }} />
                )
            case 11:
                return (
                    <V5PrintSheet kindred={kindred} backStep={() => { setSelectedStep(selectedStep - 1); }} handleSubmit={handleSubmit} vssId={venueId} />
                )
            default:
                return null;
        }
    }


    return (
        <Center h={"100%"}>
            <SideSheet kindred={kindred} />
            <AsideBar selectedStep={selectedStep} kindred={kindred} />
            {getStepComponent()}
        </Center>
    )
};

export default GenerateKindred