import { useEffect, useState } from "react";
import { Center } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { useParams, useNavigate } from "react-router-dom";

//Contexts
import { useAuth } from "../../contexts/AuthContext";
import { useCharacterDb } from "../../contexts/CharacterContext";

// Data
import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred"
import { Chronciles } from "../../data/CaM/types/Chronicles";

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
import { useGiVssDb } from "../../contexts/GiVssContext";

import changeLog from "../../utils/GoodIntentions/LoggingTool";
import { getEmptyUser } from "../../data/CaM/types/User";
import { useUser } from "../../contexts/UserContext";

const GenerateKindred = () => {
    const { onSubmitCharacter, userLocalKindred, getCharacterByUIDAndVSS } = useCharacterDb()
    const { getVssById } = useGiVssDb();

    const { venueId } = useParams();

    const [venueData, setVenueData] = useState<any>(null)

    useEffect(() => {
        // Fetch venue data only when venueId changes
        if (venueId) {
            getVssById(venueId, setVenueData);
        }
    }, [venueId, getVssById]);


    const navigate = useNavigate();

    const { currentUser } = useAuth()

    const [kindred, setKindred] = useLocalStorage<Kindred>({ key: `kindred:${venueId}`, defaultValue: getEmptyKindred() });
    const [selectedStep, setSelectedStep] = useLocalStorage({ key: `goodIntentionsSelectedStep:${venueId}`, defaultValue: 0 });

    // Get UserData

    const { fetchUserData } = useUser();
    const [userData, setUserData] = useLocalStorage({ key: 'userData', defaultValue: getEmptyUser() });

    useEffect(() => {
        if (userData.uid === "") {
            fetchUserData(setUserData);
        }
    }, [fetchUserData, userData, setUserData])

    useEffect(() => {
        getCharacterByUIDAndVSS(currentUser?.uid ?? '', venueData?.venueStyleSheet.id ?? '');
    }, [])

    const chronicleData = Chronciles["Good Intentions"]


    if (!venueData) {
        return <Center h={"100%"}><div>Checking Venue ID</div></Center>;
    }

    if (!currentUser) {
        console.log("Invalid User")
    }

    const isSt = userData.roles && (userData.roles.includes(venueData.venueStyleSheet.storyteller) || userData.roles.includes(chronicleData.leadStoryteller));

    if (userLocalKindred.length > 0 && (venueId !== "GI-000" || !isSt) ) {
        return <Center h={"100%"}><div>Character exists for this user in this VSS</div></Center>;
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