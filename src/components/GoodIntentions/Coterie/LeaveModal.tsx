import { Modal, Button, Stack, Center } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { useCharacterDb } from "../../../contexts/CharacterContext"
import { useCoterieDb } from "../../../contexts/CoterieContext"
import { Coterie, getEmptyCoterie } from "../../../data/GoodIntentions/types/Coterie"

type leaveModalProps = {
    kindred: Kindred;
    setKindred: (kindred:Kindred) => void;
    initialKindred: Kindred;
    setInitialKindred: (initialKindred:Kindred) => void;
    showLeave: boolean;
    setShowLeave: (showRetire: boolean) => void;
    coterie: Coterie;
    setCoterie: (coterie: Coterie) => void;
}

const LeaveModal = ({kindred, setKindred, initialKindred, setInitialKindred, showLeave, setShowLeave, coterie, setCoterie }:leaveModalProps) => {
    const { updateKindred } = useCharacterDb()
    const { writeCoterieData } = useCoterieDb()

    async function handleLeaveCoterie(kindred: Kindred) {
        try {
            if (kindred.id) {
                const updatedCoterie = { ...coterie }
                writeCoterieData(coterie.id, updatedCoterie)
                const updatedKindred = { ...kindred, coterie: { ...kindred.coterie, id: '' } }
                const updatedInitialKindred = { ...initialKindred, coterie: { ...initialKindred.coterie, id: '' } }
                setKindred(updatedKindred)
                setInitialKindred(updatedInitialKindred)
                updateKindred(kindred.id, updatedInitialKindred)
                setCoterie(getEmptyCoterie())
            }
        } catch {
            console.log("Failed to leave coterie")
        }
    }

    return(
        <Modal opened={showLeave} onClose={() => {setShowLeave(false); }}>
            <Modal.Header>
                <Modal.Title>
                    WARNING
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack>
                <p>Are you sure you want to leave your coterie?</p>
                <Center>
                <Button onClick={() => {handleLeaveCoterie(kindred); setShowLeave(false);}}>
                    Leave Coterie
                </Button>
                </Center>
                </Stack>
            </Modal.Body>

        </Modal>
    )

}

export default LeaveModal