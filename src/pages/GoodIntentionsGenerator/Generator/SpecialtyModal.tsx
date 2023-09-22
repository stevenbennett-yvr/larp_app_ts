import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Divider, Group, Modal, Stack, Text, TextInput } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { V5SkillsKey, v5SkillLevel } from "../../../data/GoodIntentions/types/V5Skills"
//import { V5Specialty } from "../../../data/GoodIntentions/types/V5Specialties"
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
    const phoneScreen = globals.isPhoneScreen;
    const inputW = phoneScreen ? 140 : 200
    const specialtySkills: V5SkillsKey[] = ["craft", "performance", "academics", "science"];

    let totalSkillLevel = 0;

    for (const skill of specialtySkills) {
        const skillLevel = v5SkillLevel(character, skill).level;

        totalSkillLevel += skillLevel;
    }

    const specialties = character.skillSpecialties;

    const skillSpecialtyInputs = (skill: V5SkillsKey) => {

        const skillLevel = v5SkillLevel(character, skill).level;
        const skillSpecialties = specialties.filter(entry => entry.skill === skill);
        let specialVals = Array.from({ length: skillLevel }, (_, i) => ({ name: skillSpecialties[i]?.name || "", skill: skill }));

        if (skillSpecialties.length !== skillLevel) {
            specialVals = Array.from({ length: skillLevel }, (_, i) => ({ name: skillSpecialties[i]?.name || "", skill: skill }));
        }

        const updateSkillSpecialty = (index: number, value: string) => {
            const updatedCraftVals = [...specialVals];
            updatedCraftVals[index].name = value;
            const clearedSpecialities = character.skillSpecialties.filter(entry => entry.skill !== skill)
            const updatedSpecialities = clearedSpecialities.concat(updatedCraftVals)
            setCharacter({
                ...character,
                skillSpecialties: updatedSpecialities
            });

        };

        const craftInputs = [];
        for (let i = 0; i < skillLevel; i++) {
            craftInputs.push(
                <div key={`${skill}Specialty${i}`}>
                    <TextInput
                        w={inputW}
                        value={specialVals[i]?.name || ''}
                        onChange={(e) => updateSkillSpecialty(i, e.target.value)}
                    />
                </div>
            );
        }

        return (
            <div key={`${skill}Specialties`}>
                <Text>{upcase(skill)} Specialties</Text>
                {craftInputs}
            </div>
        )

    }

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

                {specialtySkills.map((skill) => {
                    const skillLevel = v5SkillLevel(character, skill).level;
                    if (skillLevel > 0) {
                        return (
                            skillSpecialtyInputs(skill)
                        )
                    } else {
                        return null
                    }
                })}

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