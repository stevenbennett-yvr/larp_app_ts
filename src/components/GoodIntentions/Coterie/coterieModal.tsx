import { useState } from "react";
import { Modal, Stack, TextInput, Text, Alert, Button } from "@mantine/core"

//Data
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Coterie, getEmptyCoterie } from "../../../data/GoodIntentions/types/Coterie"
import { TipTapRTE } from "../../TipTapRTE"

type retireCoterieModal = {
    kindred: Kindred,
    handleCreateCoterie: (kindred: Kindred, coterie: Coterie) => void,
    showCreate: boolean,
    setShowCreate: (showCreate: boolean) => void
}

const CoterieModal = ({ kindred, showCreate, setShowCreate, handleCreateCoterie }: retireCoterieModal) => {
    const [coterie, setCoterie] = useState<Coterie>(getEmptyCoterie());

    return (
        <Modal opened={showCreate} onClose={() => setShowCreate(false)}>
            <Modal.Header>
                <Modal.Title>
                    Make your Coterie
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack>
                    <TextInput
                        withAsterisk
                        value={coterie.name}
                        label="Coterie Name"
                        onChange={(event) => setCoterie({ ...coterie, name: event.target.value, vssId: kindred.vssId })}
                    />
                    <TextInput
                        withAsterisk
                        value={coterie.concept}
                        label="Coterie Concept"
                        onChange={(event) => setCoterie({ ...coterie, concept: event.target.value, vssId: kindred.vssId })}
                    />
                    <Text fz="lg" color="dimmed">
                        Goals
                    </Text>
                    <TipTapRTE html={coterie.goals} setHTML={(val) => setCoterie({
                        ...coterie,
                        goals: val
                    })}
                    />
                    <Alert color="gray">
                    <TextInput
                        withAsterisk
                        value={coterie.domain.location}
                        label="Domain Location"
                        onChange={(event) => setCoterie({ ...coterie, domain: {...coterie.domain, location: event.target.value } })}
                    />
                    <Text fz="lg" color="dimmed">
                        Description
                    </Text>
                    <TipTapRTE html={coterie.domain.description} setHTML={(val) => setCoterie({
                        ...coterie,
                        domain: {...coterie.domain, description: val}
                    })}
                    />
                    </Alert>
                    <Button
                        onClick={() => {
                            handleCreateCoterie(kindred, coterie)
                        }}
                    >
                        Create Coterie
                    </Button>
                </Stack>
            </Modal.Body>
        </Modal>
    )

}

export default CoterieModal