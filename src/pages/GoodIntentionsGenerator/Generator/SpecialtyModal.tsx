import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Divider, Group, Modal, Stack, Text } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { V5SkillsKey, v5SkillLevel } from "../../../data/GoodIntentions/types/V5Skills"
import SpecialtyGrid from "../../../components/GoodIntentions/Generator/SpecialityGrid"
import { upcase } from "../../../utils/case"

type SpecialtyModalProps = {
    modalOpened: boolean
    closeModal: () => void
    character: Kindred,
    setCharacter: (character: Kindred) => void
    nextStep: () => void
}


export const SpecialtyModal = ({ modalOpened, closeModal, setCharacter, nextStep, character }: SpecialtyModalProps) => {
    const smallScreen = globals.isSmallScreen;
    const specialtySkills: V5SkillsKey[] = ["crafts", "performance", "academics", "science"];

    let totalSkillLevel = 0;

    for (const skill of specialtySkills) {
        const phenom = character.meritsFlaws.some(mf => mf.name === `Phenom (${upcase(skill)})`)
        const skillLevel = v5SkillLevel(character, skill).level * (phenom?2:1);
        totalSkillLevel += skillLevel;
    }

    const specialties = character.skillSpecialties;


    return (
        <Modal withCloseButton={false} size="lg" opened={modalOpened} onClose={closeModal} title={
            <div>
                <Text w={smallScreen ? "300px" : "600px"} fw={700} fz={"30px"} ta="center">Specialties</Text>
                <Text fw={400} fz={"md"} ta="center" mt={"md"} color="grey">Specialties are additional abilities aquired through some skills (Eg. Crafts, Performance, Etc.)</Text>
                <Text fw={400} fz={"md"} ta="center" mt={"md"} color="grey">A specialty should not be so broad that it applies to most uses of the skill (Eg. Crafts: Tailoring, Performance: Dance)</Text>
                <Text fw={400} fz={"md"} ta="center" mt={"md"} color="grey">Use of a speciality gains you a +1 to your pool</Text>
            </div>}
            centered>

            <Stack style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
                <Divider my="sm" />

                <SpecialtyGrid kindred={character} setKindred={setCharacter} />

                <Group position="apart" style={{ marginTop: "auto" }}>
                    <Button color="yellow" variant="subtle" leftIcon={<FontAwesomeIcon icon={faChevronLeft} />} onClick={closeModal}>Back</Button>

                    <Button color="grape" disabled={totalSkillLevel !== specialties.length} onClick={async () => {
                        closeModal()
                        nextStep()
                    }}>Confirm</Button>
                </Group>
            </Stack>
        </Modal>
    )
}