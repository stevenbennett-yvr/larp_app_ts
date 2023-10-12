import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Image, Group, ActionIcon, Input, Table, Text, Accordion } from "@mantine/core"
import { DisciplineKey, allDisciplines, disciplines, v5HandleXpDisciplineChange, v5FindMaxDiscipline, disciplineKeySchema, v5DisciplineLevel } from "../../../data/GoodIntentions/types/V5Disciplines"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import { upcase } from "../../../utils/case";
import { allPowers } from "../../../data/GoodIntentions/types/V5Powers";

type V5DisciplineXpInputsProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}

const V5DisciplineXpInputs = ({ kindred, setKindred }: V5DisciplineXpInputsProps) => {

    let mostDisciplines = allDisciplines.filter((disciplineName) => {
        if (kindred.clan==="Thin-Blood")
        { return disciplineName !== "thin-blood alchemy" && kindred.disciplines[disciplineName].creationPoints !== 0 }
        return disciplineName !== "thin-blood alchemy";
    })
    const disciplinesForClan = kindred.clan==="Thin-Blood"? ["thin-blood alchemy"]: kindred.clan === "Caitiff" ? mostDisciplines : Clans[kindred.clan].disciplines;
    const otherDisciplines = mostDisciplines.filter((disciplineName) => {
        return !disciplinesForClan.includes(disciplineName);
    });

    const getSelectedPowers = (kindred: Kindred, discipline: DisciplineKey) => {
        return kindred.powers.filter((power) => {
            const matchingPower = allPowers.find((p) => power.name === p.name);
            return matchingPower?.discipline === discipline;
        });
    };

    const disciplineXpInputs = (discipline: DisciplineKey) => {

        return (
            <tr key={discipline}>
                <td>
                    <Group position="apart">
                        <Image
                            fit="contain"
                            withPlaceholder
                            src={disciplines[discipline].logo}
                            height={30}
                            width={30}
                            alt="order"
                        />
                        <Text>
                            {upcase(discipline)}
                        </Text>
                        <Text>
                            Level: {v5DisciplineLevel(kindred, discipline).level}
                        </Text>
                    </Group>
                </td>
                <td>
                    <Group>
                        <ActionIcon
                            variant="filled"
                            radius="xl"
                            color="dark"
                            onClick={() => v5HandleXpDisciplineChange(kindred, setKindred, discipline, kindred.disciplines[discipline].experiencePoints - 1)}
                            disabled={(getSelectedPowers(kindred, discipline).length >= v5DisciplineLevel(kindred, discipline).level)}
                        >
                            <CircleMinus strokeWidth={1.5} color="gray" />
                        </ActionIcon>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`${discipline}-input`}
                            min={(getSelectedPowers(kindred, discipline).length >= v5DisciplineLevel(kindred, discipline).level) ? kindred.disciplines[discipline].experiencePoints : 0}
                            max={v5FindMaxDiscipline(kindred, discipline)}
                            value={kindred.disciplines[discipline].experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = Number(e.target.value);
                                v5HandleXpDisciplineChange(kindred, setKindred, discipline, value);
                            }}
                        />
                        <ActionIcon variant="filled" radius="xl" color="dark" disabled={v5FindMaxDiscipline(kindred, discipline) === kindred.disciplines[discipline].experiencePoints} onClick={() => v5HandleXpDisciplineChange(kindred, setKindred, discipline, kindred.disciplines[discipline].experiencePoints + 1)}>
                            <CirclePlus strokeWidth={1.5} color="gray" />
                        </ActionIcon>
                    </Group>
                </td>
                <td>
                    <Group position="apart">
                        <Text>
                            {v5DisciplineLevel(kindred, discipline).totalXpNeeded - kindred.disciplines[discipline].experiencePoints}
                        </Text>
                        <Text>
                            {v5DisciplineLevel(kindred, discipline).totalXpNeeded}
                        </Text>
                    </Group>
                </td>
            </tr>
        )
    }

    return (
        <>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Disciplines</Text>
            <Accordion>
                <Accordion.Item value={"In-Clan Disciplines"}>
                    <Accordion.Control
                        style={{ backgroundColor: "#25262B" }}
                    >{kindred.clan === "Caitiff"? 'Caitiff Disciplines':'In-Clan Disciplines'}</Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <td>Discipline</td>
                                    <td></td>
                                    <td>
                                        <Group position="apart">
                                            <Text underline>Xp For Next</Text>
                                            <Text underline>Total XP Needed</Text>
                                        </Group>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    disciplinesForClan.map((d) => disciplineKeySchema.parse(d)).map((discipline) => disciplineXpInputs(discipline))
                                }
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
                {kindred.clan==="Caitiff"?<></>:
                <Accordion.Item value={"Out-of-Clan Disciplines"}>
                    <Accordion.Control
                        style={{ backgroundColor: "#25262B" }}
                    >Out-of-Clan Disciplines</Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <td>Discipline</td>
                                    <td></td>
                                    <td>
                                        <Group position="apart">
                                            <Text underline>Xp For Next</Text>
                                            <Text underline>Total XP Needed</Text>
                                        </Group>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    otherDisciplines.map((d) => disciplineKeySchema.parse(d)).map((discipline) => disciplineXpInputs(discipline))
                                }
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
                }
            </Accordion>
        </>
    )
}

export default V5DisciplineXpInputs