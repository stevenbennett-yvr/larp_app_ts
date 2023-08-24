import { Awakened } from "../../data/Awakened"
import { Cabal } from "../../data/Cabals"
import { Modal, TextInput, Button } from "@mantine/core"
import { useState } from "react"
import { useMageDb } from "../../../../contexts/MageContext"
import { useNavigate } from "react-router-dom"
import { handleLeaveCabal } from "../../data/Cabals"

type retireModalProps = {
    awakened: Awakened,
    showRetire: boolean,
    setShowRetire: (showRetire: boolean) => void
    cabalData: Cabal,
    setCabalData: (cabalData: Cabal) => void
    updateCabal: Function
}

const RetireModal = ({awakened, showRetire, setShowRetire, cabalData, setCabalData, updateCabal}:retireModalProps) => {
    const [characterName, setCharacterName] = useState("")
    const { updateAwakened } = useMageDb();
    const navigate = useNavigate()

    const hanldeArchiveSheet = () => {
        if (characterName.trim() === "") {
            setShowRetire(true);
        } else {
            if (awakened.id) {
                handleLeaveCabal(awakened.id, cabalData, updateCabal, setCabalData)
                const updatedAwakened = { 
                    ...awakened, 
                    uid:"0", 
                    background: {
                        ...awakened.background,
                        showPublic: false,
                },
                }
                updateAwakened(awakened.id, updatedAwakened)
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
                <Button disabled={!(characterName===awakened.name)} onClick={hanldeArchiveSheet}>
                    Retire Character
                </Button>
            </Modal.Body>

        </Modal>
    )

}

export default RetireModal