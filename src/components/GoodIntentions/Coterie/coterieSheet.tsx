import { useState } from "react";
import { Center, Stack, Button } from "@mantine/core";
//Data
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
//Components
import CoterieModal from "./coterieModal";
import { Coterie } from "../../../data/GoodIntentions/types/Coterie";

type CoterieSheetProps = {
    kindred: Kindred,
    coterie: Coterie,
    handleCreateCoterie: (kindred: Kindred, coterie: Coterie) => void,
}


const CoterieSheet = ({ kindred, handleCreateCoterie }: CoterieSheetProps) => {

    const [showCreate, setShowCreate] = useState<boolean>(false);

    return (
        <Center>
                {kindred.coterie.id === "" ? 
                <Button
                    onClick={() => {
                        setShowCreate(true)
                    }}
                >
                    Create Coterie
                </Button>
                :
                <Stack>
                    
                </Stack>}
            <CoterieModal kindred={kindred} handleCreateCoterie={handleCreateCoterie} showCreate={showCreate} setShowCreate={setShowCreate} />
        </Center>
    )
}

export default CoterieSheet