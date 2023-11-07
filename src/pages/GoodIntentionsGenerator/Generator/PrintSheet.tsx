import { useState } from "react";

// Mantine components
import {
    Center,
    Group,
    Alert,
    Button,
    ScrollArea,
} from "@mantine/core";

// Data and types
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import PrintSheetCore from "../../../components/GoodIntentions/PrintSheet/PrintSheet";

// Utility functions and components
import ConfirmModal from './ConfirmModal';
import { globals } from "../../../assets/globals";

type PrintSheetProps = {
    kindred: Kindred,
    backStep: () => void,
    handleSubmit: () => void,
    vssId: string | undefined,
}

const V5PrintSheet = ({ kindred, backStep, handleSubmit, vssId }: PrintSheetProps) => {

    const [showRetire, setShowRetire] = useState<boolean>(false);
    const height = globals.viewportHeightPx
    const width = globals.viewportWidthPx
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: "20px" }}>
            <ScrollArea h={height - 140} w={width} pb={20}>
                <PrintSheetCore kindred={kindred} vssId={vssId} />
            </ScrollArea>

            <ConfirmModal kindred={kindred} showRetire={showRetire} setShowRetire={setShowRetire} handleSubmit={handleSubmit} />

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
                        <Button
                            style={{ margin: "5px" }}
                            color="gray"
                            onClick={() =>
                                setShowRetire(true)
                            }>
                            Submit
                        </Button>
                    </Button.Group>
                </Group>
            </Alert>

        </Center>
    )
}

export default V5PrintSheet