//Technical Imports
import { Grid, Text, Center, Group, Input, Button, Alert, Stack, Select } from "@mantine/core";
import { useState } from "react";
//Assets Imports
import { globals } from "../../../assets/globals";
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { SkillCategory, SkillsKey, nWoD1eCurrentSkillLevel, nWoD1eHandleXpSkillChange, nWoD1eAddSpeciality, nWoD1eRemoveSpeciality, nWoD1eFindMaxSkill } from "../../../data/nWoD1e/nWoD1eSkills";

type MageSkillXpInputsProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void,
}

const MageSkillXpInputs = ({awakened, setAwakened}: MageSkillXpInputsProps) => {

    const orderedCategories = ['mental', 'physical', 'social'];
    const [specialitiesState, setSpecialitiesState] = useState<{ [key in SkillsKey]?: string }>({});

    return (
        <>
        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Skills</Text>
        <hr style={{width:"50%"}}/>
        <Grid gutter="lg" justify="center">
        {orderedCategories.map((category) => {
            let categoryKey = category as SkillCategory
            return (
            <Grid.Col 
                span={globals.isPhoneScreen ? 8 : 4} 
                key={`${category} Skills`}
            >
                <Text fs="italic" fw={700} ta="center">
                {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <hr />
                {Object.entries(awakened.skills)
                    .sort(([skillA], [skillB]) => skillA.localeCompare(skillB))
                    .map(([skill, skillInfo]) => {
                    const skillName = skill as SkillsKey;
                    const { level, totalXpNeeded } = nWoD1eCurrentSkillLevel(awakened, skillName);
                    const specialities = skillInfo.specialities.map((spec) => spec.name);
                    const selectedSpeciality = specialitiesState[skillName];
                    if ( skillInfo.category === categoryKey ) {
                    return (
                        <Center style={{ paddingBottom: '5px'}}>
                            <Alert color="gray">
                            <Stack>
                                <Group key={`${skill} input`}>
                                    <Input.Wrapper 
                                    label={`${skillInfo.roteSkill ? '🔷' : '☐'} ${skill.charAt(0).toUpperCase() + skill.slice(1)} ${level}`}
                                    description={`Total XP for Next: ${totalXpNeeded}`}
                                    >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button
                                        size="xs"
                                        variant="outline"
                                        color="gray"
                                        onClick={() => nWoD1eHandleXpSkillChange(awakened, setAwakened, skillName, skillInfo.experiencePoints - 1)}
                                        >
                                        -
                                        </Button>
                                        <Input
                                        style={{ width: '60px', margin: '0 8px' }}
                                        type="number"
                                        key={`${category}-${skill}`}
                                        min={0}
                                        max={nWoD1eFindMaxSkill(awakened, skillName)}
                                        value={skillInfo.experiencePoints}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = Number(e.target.value);
                                            nWoD1eHandleXpSkillChange(awakened, setAwakened, skillName, value);
                                        }}
                                        />
                                        <Button
                                        size="xs"
                                        variant="outline"
                                        color="gray"
                                        disabled={nWoD1eFindMaxSkill(awakened, skillName) === skillInfo.experiencePoints}
                                        onClick={() => nWoD1eHandleXpSkillChange(awakened, setAwakened, skillName, skillInfo.experiencePoints + 1)}
                                        >
                                        +
                                        </Button>
                                    </div>
                                    </Input.Wrapper>
                                </Group>
                                <Group>
                                <Select
                                        style={{ width: "70%", margin: '0 8px' }}
                                        data={specialities}
                                        placeholder={`${skill.charAt(0).toUpperCase() + skill.slice(1)} Specialities`}
                                        searchable
                                        creatable
                                        allowDeselect 
                                        getCreateLabel={(query) => `+ Create ${query}`}
                                        value={selectedSpeciality}
                                        onChange={(value) => {
                                            // Set the selected speciality for the corresponding skill
                                            setSpecialitiesState((prevSpecialitiesState) => ({
                                            ...prevSpecialitiesState,
                                            [skillName]: value as string,
                                            }));
                                        }}
                                        onCreate={(query) => {
                                            nWoD1eAddSpeciality(awakened, setAwakened, skillName, query, 'experiencePoints');
                                            return query;
                                        }}
                                        />
                                        {selectedSpeciality && !skillInfo.specialities.some((spec) => spec.name === selectedSpeciality && spec.creationPoints > 0) && (
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            color="blue"
                                            onClick={() => {
                                            // Remove the selected speciality
                                            nWoD1eRemoveSpeciality(awakened, setAwakened, skillName, selectedSpeciality)
                                            setSpecialitiesState((prevSpecialitiesState) => ({
                                                ...prevSpecialitiesState,
                                                [skillName]: '',
                                            }));
                                            }}
                                        >
                                            X
                                        </Button>
                                        )}
                                </Group>
                            </Stack>
                            </Alert>
                        </Center>
                    )}
                    else{
                        return null
                    };
                })}
            </Grid.Col>
            );
        })}
        </Grid>
        </>
    )
}

export default MageSkillXpInputs