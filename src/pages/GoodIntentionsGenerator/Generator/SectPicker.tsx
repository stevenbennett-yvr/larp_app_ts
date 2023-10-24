import { Center, Grid, Stack, ScrollArea, Text } from "@mantine/core";
import { useState } from "react";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { globals } from "../../../assets/globals";
import { SectName } from "../../../data/GoodIntentions/types/V5Sect";
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";
import SectGrid from "../../../components/GoodIntentions/Generator/SectGrid";
import SectModal from "../../../components/GoodIntentions/Generator/SectModal";

type SectPickerProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
    nextStep: () => void;
    venueData: GoodIntentionsVenueStyleSheet;
}

const SectPicker = ({ kindred, setKindred, nextStep, venueData }: SectPickerProps) => {

    const [sect, setSect] = useState<SectName>(kindred.sect)

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setSect('');
        setModalOpen(false);
    };


    const height = globals.viewportHeightPx
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">
                <Text fz={"30px"} ta={"center"}>Pick your <b>Sect</b></Text>

                <ScrollArea h={height - 215} w={"100%"} p={20}>

                    <Grid grow m={0}>
                        <SectGrid setSect={setSect} setModalOpen={setModalOpen} venueData={venueData} />
                    </Grid>

                </ScrollArea>

                {sect && (
                    <SectModal kindred={kindred} setKindred={setKindred} nextStep={nextStep} modalOpen={modalOpen} handleCloseModal={handleCloseModal} sect={sect} />
                )}

            </Stack>
        </Center >
    )
}

export default SectPicker