import { Alert, Button, Center, Group, Stack, ScrollArea, Text } from "@mantine/core";
import { useState } from "react";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { ClanName } from "../../../data/GoodIntentions/types/V5Clans";
import { globals } from "../../../assets/globals";
import ClanGrid from "../../../components/GoodIntentions/Generator/ClanGrid";
import ClanModal from "../../../components/GoodIntentions/Generator/ClanModal";
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";

type ClanPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
    venueData: GoodIntentionsVenueStyleSheet
}


const ClanPicker = ({ kindred, setKindred, nextStep, backStep, venueData }: ClanPickerProps) => {

    const [clan, setClan] = useState<ClanName>(kindred.clan)

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setClan('');
        setModalOpen(false);
    };

    const height = globals.viewportHeightPx
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">
                <Text fz={"30px"} ta={"center"}>Pick your <b>Clan</b></Text>

                <ScrollArea h={height - 215} w={"100%"} p={20}>

                    <ClanGrid setClan={setClan} setModalOpen={setModalOpen} venueData={venueData} />

                </ScrollArea>

                {clan && (
                    <ClanModal kindred={kindred} setKindred={setKindred} clan={clan} modalOpen={modalOpen} handleCloseModal={handleCloseModal} nextStep={nextStep} />
                )}
                <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
                    <Group>
                        <Button.Group>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={backStep}
                            >
                                Back
                            </Button>
                        </Button.Group>
                    </Group>
                </Alert>
            </Stack>
        </Center >
    )
}

export default ClanPicker