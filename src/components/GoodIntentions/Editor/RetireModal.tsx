import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Modal, TextInput, Button } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCharacterDb } from "../../../contexts/CharacterContext"

type retireModalProps = {
    kindred: Kindred,
    showRetire: boolean,
    setShowRetire: (showRetire: boolean) => void
}

const RetireModal = ({kindred, showRetire, setShowRetire}:retireModalProps) => {
    const [characterName, setCharacterName] = useState("")
    const navigate = useNavigate()
    const { updateKindred } = useCharacterDb()

    // TODO: Archive function does not appear to be working properly, bugtest and fix

    const hanldeArchiveSheet = () => {
        if (characterName.trim() === "") {
            setShowRetire(true);
        } else {
            if (kindred.id) {
                const updatedAwakened = { 
                    ...kindred, 
                    uid:`${kindred.uid}-retired`
                }
                updateKindred(kindred.id, updatedAwakened)
                navigate("/")
                setShowRetire(false);
            }
        }
    }

    return(
        <Modal opened={showRetire} onClose={() => setShowRetire(false)}>
            <Modal.Header>
                <Modal.Title>
                    WARNING
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please enter your character name before archiving the sheet.</p>
                <TextInput
                    placeholder="Enter character name"
                    value={characterName}
                    onChange={(event) => setCharacterName(event.target.value)}
                />
                <Button disabled={!(characterName===kindred.name)} onClick={hanldeArchiveSheet}>
                    Retire Character
                </Button>
            </Modal.Body>

        </Modal>
    )

}

export default RetireModal