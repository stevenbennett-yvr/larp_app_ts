import { Modal, TextInput, Button } from "@mantine/core"
import { useState } from "react"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"

type confirmModalProps = {
    kindred: Kindred,
    showRetire: boolean,
    setShowRetire: (showRetire: boolean) => void
    handleSubmit: () => void,

}

const ConfirmModal = ({kindred, showRetire, setShowRetire, handleSubmit}:confirmModalProps) => {
    const [characterName, setCharacterName] = useState("")

    return(
        <Modal opened={showRetire} onClose={() => setShowRetire(false)}>
            <Modal.Header>
                <Modal.Title>
                    WARNING
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please enter your character name before submitting the sheet. Note after submission you will not be able to change or reallocate your creation points. Ensure you character is set how you want before submission.</p>
                <TextInput
                    placeholder="Enter character name"
                    value={characterName}
                    onChange={(event) => setCharacterName(event.target.value)}
                />
                <Button disabled={!(characterName.toLowerCase()===kindred.name.toLocaleLowerCase())} onClick={handleSubmit}>
                    Submit Character
                </Button>
            </Modal.Body>

        </Modal>
    )

}

export default ConfirmModal