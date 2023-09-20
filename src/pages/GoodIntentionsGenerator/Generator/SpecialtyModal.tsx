import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Divider, Group, Modal, Select, Stack, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { upcase, lowcase } from "../../../utils/case"
import { globals } from "../../../assets/globals"
import { V5Specialty } from "../../../data/GoodIntentions/types/V5Specialties"
import { V5Skills, V5SkillsKey, v5skillsKeySchema } from "../../../data/GoodIntentions/types/V5Skills"

type SpecialtyModalProps = {
    modalOpened: boolean
    closeModal: () => void
    character: Kindred,
    pickedSkillNames: V5SkillsKey[],
    skills: V5Skills,
    setCharacter: (character: Kindred) => void
    nextStep: () => void
}

type SpecialtySkill = "academics" | "craft" | "performance" | "science"

export const SpecialtyModal = ({ modalOpened, closeModal, setCharacter, nextStep, character, pickedSkillNames, skills }: SpecialtyModalProps) => {
    const smallScreen = globals.isSmallScreen
    const phoneScreen = globals.isPhoneScreen

    const [pickedSkillDisplay, setPickedSkillDisplay] = useState<string>(/*pickedSkillNames[0]*/"")  // Need to define this and set it in parent-component to automatically select the first one (see PredatorTypePicker)
    const [pickedSkillSpecialty, setPickedSkillSpecialty] = useState("")

    const [academicsSpecialty, setAcademicsSpecialty] = useState("")
    const [craftSpecialty, setCraftSpecialty] = useState("")
    const [performanceSpecialty, setPerformanceSpecialty] = useState("")
    const [scienceSpecialty, setScienceSpecialty] = useState("")

    const specialtySkills = ["academics", "craft", "performance", "science"]

    const specialtyStates: Record<SpecialtySkill, { value: string, setValue: (s: string) => void }> = {
        academics: { value: academicsSpecialty, setValue: setAcademicsSpecialty },
        craft: { value: craftSpecialty, setValue: setCraftSpecialty },
        performance: { value: performanceSpecialty, setValue: setPerformanceSpecialty },
        science: { value: scienceSpecialty, setValue: setScienceSpecialty },
    }
    const intersection = (arr1: any[], arr2: any[]) => {
        const set1 = (arr1);
        const set2 = (arr2);
        return [...set1].filter(value => set2.includes(value));
    };

    const pickedSpecialtySkills = intersection(specialtySkills, pickedSkillNames) as SpecialtySkill[]
    const pickedSkill = lowcase(pickedSkillDisplay)

    const inputW = phoneScreen ? 140 : 200
    return (
        <Modal withCloseButton={false} size="lg" opened={modalOpened} onClose={closeModal} title={
            <div>
                <Text w={smallScreen ? "300px" : "600px"} fw={700} fz={"30px"} ta="center">Specialties</Text>
                <Text fw={400} fz={"md"} ta="center" mt={"md"} color="grey">Specialties are additional abilities that apply to some uses of a skill (Eg. Performance: Dancing)</Text>
                <Text fw={400} fz={"md"} ta="center" mt={"md"} color="grey">A specialty should not be so broad that it applies to most uses of the skill</Text>
            </div>}
            centered>

            <Stack style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
                <Divider my="sm" />
                <Text fw={700} fz={"xl"}>Select a Skill for a free Specialty</Text>

                <Group position="apart">
                    <Select
                        w={inputW}
                        // label="Pick a free specialty"
                        placeholder="Pick one"
                        searchable
                        onSearchChange={setPickedSkillDisplay}
                        searchValue={pickedSkillDisplay}
                        nothingFound="No options"
                        dropdownPosition="bottom"
                        data={pickedSkillNames.filter((s) => !specialtySkills.includes(s)).map(upcase)}
                    />

                    <TextInput w={inputW} value={pickedSkillSpecialty} onChange={(event) => setPickedSkillSpecialty(event.currentTarget.value)} />
                </Group>
                <Divider my="sm" variant="dotted" />

                {pickedSpecialtySkills.map((s) => (
                    <div key={s}>
                        <Group position="apart">
                            <Text fw={700} fz={phoneScreen ? "sm" : "xl"}>{upcase(s)}:</Text>
                            <TextInput w={inputW} value={specialtyStates[s].value} onChange={(event) => specialtyStates[s].setValue(event.currentTarget.value)} />
                        </Group>
                        <Divider my="sm" variant="dotted" />
                    </div>
                ))}

                <Group position="apart" style={{ marginTop: "auto" }}>
                    <Button color="yellow" variant="subtle" leftIcon={<FontAwesomeIcon icon={faChevronLeft} />} onClick={closeModal}>Back</Button>

                    <Button color="grape" onClick={async () => {
                        let pickedSpecialties = specialtySkills.reduce<V5Specialty[]>((acc, s) => {
                            return [...acc, { skill: v5skillsKeySchema.parse(s), name: specialtyStates[s as SpecialtySkill].value }]
                        }, [])
                        pickedSpecialties = [...pickedSpecialties, { skill: v5skillsKeySchema.parse(pickedSkill), name: lowcase(pickedSkillSpecialty) }]

                        closeModal()
                        setCharacter({ ...character, skills: skills, skillSpecialties: pickedSpecialties })
                        nextStep()
                    }}>Confirm</Button>
                </Group>
            </Stack>
        </Modal>
    )
}