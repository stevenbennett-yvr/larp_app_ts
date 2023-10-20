import { Divider, Modal, Stack, Text } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import SpecialtyGrid from "../Inputs/SpecialityGrid"

type SpecialtyModalProps = {
    modalOpened: boolean
    closeModal: () => void
    character: Kindred,
    setCharacter: (character: Kindred) => void
}


export const V5SpecialtyModal = ({ modalOpened, closeModal, setCharacter, character }: SpecialtyModalProps) => {
    const smallScreen = globals.isSmallScreen;

    return (
        <Modal withCloseButton={false} size="lg" opened={modalOpened} onClose={closeModal} title={
            <div>
                <Text w={smallScreen ? "300px" : "600px"} fw={700} fz={"30px"} ta="center">Specialties</Text>
                <Text fw={400} fz={"md"} ta="center" mt={"md"} color="grey">Use of a speciality gains you a +1 to your pool</Text>
            </div>}
            centered>

            <Stack style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
                <Divider my="sm" />

                <SpecialtyGrid kindred={character} setKindred={setCharacter} />

            </Stack>
        </Modal>
    )
}