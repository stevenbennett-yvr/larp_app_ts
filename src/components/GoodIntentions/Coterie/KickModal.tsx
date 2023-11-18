import { Modal, TextInput, Button, Stack, Center } from "@mantine/core"
import { useState } from "react"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { useCharacterDb } from "../../../contexts/CharacterContext"

type kickModalProps = {
    kindred: Kindred;
    showKick: boolean;
    setShowKick: (showRetire: boolean) => void;
}

const KickModal = ({kindred, showKick, setShowKick }:kickModalProps) => {
    const [characterName, setCharacterName] = useState("")
    const { updateKindred, getCoterieMembers } = useCharacterDb()

    const kickKindred = (kindred: Kindred) => {
        if (kindred.id) { 
            const updatedKindred = { ...kindred, coterie: { id: "", territoryContributions: [] } }
            updateKindred(kindred.id, updatedKindred)
            getCoterieMembers(kindred.coterie.id)
        } else {
            console.log("Failed to remove kindred from Coterie")
        }
    }

    return(
        <Modal opened={showKick} onClose={() => {setShowKick(false); }}>
            <Modal.Header>
                <Modal.Title>
                    WARNING
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack>
                <p>Enter the name of the Kindred you wish to kick from your coterie.</p>
                <TextInput
                    placeholder="Enter character name"
                    value={characterName}
                    onChange={(event) => setCharacterName(event.target.value)}
                />
                <Center>
                <Button disabled={!(characterName===kindred.name)} onClick={() => {kickKindred(kindred); setShowKick(false);}}>
                    Kick Character
                </Button>
                </Center>
                </Stack>
            </Modal.Body>

        </Modal>
    )

}

export default KickModal