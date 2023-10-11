import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { globals } from "../../../assets/globals"
import { Text, Grid, Center, Group, Input, ActionIcon, Button, Stack } from "@mantine/core"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import { SkillCategory } from "../../../data/nWoD1e/nWoD1eSkills";
import { V5SkillsKey, v5FindMaxSkill, v5HandleXpSkillChange, v5SkillLevel } from "../../../data/GoodIntentions/types/V5Skills";
import { V5SpecialtyModal } from "./V5SpecialtyModal";
import { useState } from "react";

type V5SkillXpInputsProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}


const V5SkillXpInputs = ({ kindred, setKindred }: V5SkillXpInputsProps) => {

    const orderedCategories = ['physical', 'social', 'mental'];

    // Define state for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Center>
            <Stack>
            <V5SpecialtyModal character={kindred} setCharacter={setKindred} modalOpened={isModalOpen} closeModal={closeModal}></V5SpecialtyModal>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Skills</Text>
            <Center>
            <Button onClick={openModal} size="compact-xs" color="gray">Open Specialties</Button>
            </Center>
            <Grid>
                {orderedCategories.map((category) => {
                    let categoryKey = category as SkillCategory
                    return (
                        <Grid.Col
                            span={globals.isPhoneScreen ? 8 : 4}
                            key={`${category}-Skills`}
                        >
                            <Text fs="italic" fw={700} ta="center">
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Text>
                            <hr />
                            {Object.entries(kindred.skills)
                                .sort(([skillA], [skillB]) => skillA.localeCompare(skillB))
                                .map(([skill, skillInfo]) => {
                                    const skillName = skill as V5SkillsKey;
                                    const { level, totalXpNeeded } = v5SkillLevel(kindred, skillName);
                                    if (skillInfo.category === categoryKey) {
                                        return (
                                            <Center key={`${skill}-Input`}>
                                                <Group>
                                                    <Input.Wrapper
                                                        label={`${skill.charAt(0).toUpperCase() + skill.slice(1)} ${level}`}
                                                    >
                                                        <Text size="12px" color="gray.6">Xp for Next: {totalXpNeeded - skillInfo.experiencePoints}</Text>
                                                        <Text size="12px" color="gray.6">Total XP Needed {totalXpNeeded}</Text>

                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <ActionIcon variant="filled" radius="xl" color="dark" onClick={() => v5HandleXpSkillChange(kindred, setKindred, skillName, skillInfo.experiencePoints - 1)}>
                                                                <CircleMinus strokeWidth={1.5} color="gray" />
                                                            </ActionIcon>
                                                            <Input
                                                                style={{ width: '60px', margin: '0 8px' }}
                                                                type="number"
                                                                key={`${category}-${skill}`}
                                                                min={0}
                                                                max={v5FindMaxSkill(kindred, skillName)}
                                                                value={skillInfo.experiencePoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const value = Number(e.target.value);
                                                                    v5HandleXpSkillChange(kindred, setKindred, skillName, value);
                                                                }}
                                                            />

                                                            <ActionIcon variant="filled" radius="xl" color="dark" disabled={v5FindMaxSkill(kindred, skillName) === skillInfo.experiencePoints} onClick={() => v5HandleXpSkillChange(kindred, setKindred, skillName, skillInfo.experiencePoints + 1)}>
                                                                <CirclePlus strokeWidth={1.5} color="gray" />
                                                            </ActionIcon>
                                                        </div>
                                                    </Input.Wrapper>
                                                </Group>
                                            </Center>
                                        )
                                    }
                                    else {
                                        return null
                                    };
                                })}
                        </Grid.Col>
                    );
                })}
            </Grid>
            </Stack>
        </Center>
    )


}

export default V5SkillXpInputs