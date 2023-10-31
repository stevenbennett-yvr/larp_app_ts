
// Mantine components
import {
    Center, Stack, Divider
} from "@mantine/core";

// Data and types
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { GoodIntentionsVSSs } from "../../../data/CaM/types/VSS";

// Utility functions and components
import AttributeSection from "./PrintAttributeSection";
import TopSection from "./PrintTopSection";
import SkillSection from "./PrintSkillSection";
import MiddleSection from "./PrintMiddleSection";
import DisciplineSection from "./PrintDisciplineSection";
import BackgroundSection from "./PrintBackgroundSection";
import MeritFlawSection from "./PrintMeritFlawSection";

type PrintSheetProps = {
    kindred: Kindred,
    vssId: string | undefined,
}

const PrintSheetCore = ({ kindred, vssId }: PrintSheetProps) => {
    const venueData = GoodIntentionsVSSs.find((venue) => venue.venueStyleSheet.id === vssId);
    if (!venueData) { return null }



    return (
        <Center>
            <Stack>

                <TopSection kindred={kindred} venueData={venueData} />

                <Divider my="sm" label="Attributes" labelPosition="center" />

                <AttributeSection kindred={kindred} />
                <Divider my="sm" label="Skills" labelPosition="center" />

                <SkillSection kindred={kindred} />

                <MiddleSection kindred={kindred} venueData={venueData} />

                <DisciplineSection kindred={kindred} />

                <BackgroundSection kindred={kindred} />

                {kindred.meritsFlaws.length > 0 ?
                    <MeritFlawSection kindred={kindred} />
                    : <></>}
            </Stack>
        </Center>
    )


}

export default PrintSheetCore