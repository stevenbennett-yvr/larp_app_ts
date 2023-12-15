import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Center, Stack, Text, Table, Input, SimpleGrid } from "@mantine/core";
import { V5SkillsKey, v5SkillLevel } from "../../../data/GoodIntentions/types/V5Skills";
import { v5FindMaxSkill, v5HandleXpSkillChange } from "../../../data/GoodIntentions/types/V5Skills";
import { SkillCategory } from "../../../data/nWoD1e/nWoD1eSkills";

type V5SkillStInputsProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
}

const V5SkillStInputs = ({ kindred, setKindred }: V5SkillStInputsProps) => {

    const orderedCategories = ['physical', 'social', 'mental'];

    function changeCreationPoints(
        Skill: V5SkillsKey,
        creationPoints: number,
    ): void {

        const updatedSkills = {
            ...kindred.skills,
            [Skill]: {
                ...kindred.skills[Skill],
                creationPoints
            }
        }

        const updatedCharacter = {
            ...kindred,
            Skills: updatedSkills
        }

        setKindred(updatedCharacter)
    }

    function changeFreebiePoints(
        Skill: V5SkillsKey,
        freebiePoints: number,
    ): void {

        const updatedSkills = {
            ...kindred.skills,
            [Skill]: {
                ...kindred.skills[Skill],
                freebiePoints
            }
        }

        const updatedCharacter = {
            ...kindred,
            Skills: updatedSkills
        }

        setKindred(updatedCharacter)
    }

    return (
        <Center>
            <Stack>
                <Text>
                    Skills
                </Text>
                <SimpleGrid cols={3} spacing="xl">
                    {orderedCategories.map((category) => {
                        let categoryKey = category as SkillCategory
                        return (
                            <Table
                                verticalSpacing={0}
                                horizontalSpacing={0}
                                highlightOnHover withColumnBorders
                            >
                                <thead>
                                    <tr>
                                        <td>{category}</td>
                                        <td>CP</td>
                                        <td>XP</td>
                                        <td>FP</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(kindred.skills)
                                        .sort(([skillA], [skillB]) => skillA.localeCompare(skillB))
                                        .map(([skill, skillInfo]) => {
                                            const SkillName = skill as V5SkillsKey;
                                            console.log(SkillName)
                                            const { level } = v5SkillLevel(kindred, SkillName);
                                            if (skillInfo.category === categoryKey) {
                                                return (

                                                    <tr key={`row-${SkillName}`}>
                                                        <td>{SkillName.slice(0, 4).toUpperCase()} {level}</td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                style={{
                                                                    width: '50px',
                                                                    margin: '0 8px',
                                                                }}
                                                                key={`st-${skill}-creationPoints`}
                                                                min={1}
                                                                max={4}
                                                                value={skillInfo.creationPoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const val = Number(e.target.value);
                                                                    changeCreationPoints(SkillName, val)
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                style={{
                                                                    width: '50px',
                                                                    margin: '0 8px',
                                                                }}
                                                                key={`st-${skill}-ExperiencePoints`}
                                                                min={0}
                                                                max={v5FindMaxSkill(kindred, SkillName)}
                                                                step={3}
                                                                value={skillInfo.experiencePoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const val = Number(e.target.value);
                                                                    v5HandleXpSkillChange(kindred, setKindred, SkillName, val)
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                style={{
                                                                    width: '50px',
                                                                    margin: '0 8px',
                                                                }}
                                                                key={`st-${skill}-FreebiePoints`}
                                                                min={0}
                                                                max={5}
                                                                step={1}
                                                                value={skillInfo.freebiePoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const val = Number(e.target.value);
                                                                    changeFreebiePoints(SkillName, val)
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                            else {
                                                return null
                                            }
                                        })}
                                </tbody>
                            </Table>
                        )
                    })}
                </SimpleGrid>
            </Stack>
        </Center>
    );

}

export default V5SkillStInputs