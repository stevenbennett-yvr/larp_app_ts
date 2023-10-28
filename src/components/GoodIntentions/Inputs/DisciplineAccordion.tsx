import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Center, Image, Group, ActionIcon, Input, Table, Text, Accordion } from "@mantine/core"
import { DisciplineKey, allDisciplines, disciplines, v5HandleXpDisciplineChange, v5FindMaxDiscipline, disciplineKeySchema, v5DisciplineLevel } from "../../../data/GoodIntentions/types/V5Disciplines"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import { upcase } from "../../../utils/case";
import { allPowers } from "../../../data/GoodIntentions/types/V5Powers";
import { Formulae } from "../../../data/GoodIntentions/types/V5Formulae";

type DisciplineAccordionProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}

const DisciplineAccordion = ({ kindred, setKindred }: DisciplineAccordionProps) => {

    let mostDisciplines = allDisciplines.filter((disciplineName) => {
        if (kindred.clan==="Thin-Blood")
        { return disciplineName !== "thin-blood alchemy" && kindred.disciplines[disciplineName].creationPoints !== 0 }
        return disciplineName !== "thin-blood alchemy";
    })
    const thinBloodAlchemy = kindred.meritsFlaws.some((mf) => mf.name === "Thin-Blood Alchemist")
    const disciplinesForClan = kindred.clan==="Thin-Blood" && thinBloodAlchemy ? ["thin-blood alchemy"]: kindred.clan === "Caitiff" ? mostDisciplines : Clans[kindred.clan].disciplines;
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

        let highestFormulaLevel = 0;  // Initialize the highest level to 0

        kindred.formulae.forEach((formula) => {
          const formulaRecord = Formulae.find((record) => record.name === formula.name);
          if (formulaRecord && formulaRecord.level > highestFormulaLevel) {
            highestFormulaLevel = formulaRecord.level;
          }
        });

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
                            disabled={(getSelectedPowers(kindred, discipline).length >= v5DisciplineLevel(kindred, discipline).level) || (discipline === "thin-blood alchemy" && highestFormulaLevel >= v5DisciplineLevel(kindred, discipline).level)}
                        >
                            <CircleMinus strokeWidth={1.5} color="gray" />
                        </ActionIcon>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`${discipline}-input`}
                            min={(getSelectedPowers(kindred, discipline).length >= v5DisciplineLevel(kindred, discipline).level) || (discipline === "thin-blood alchemy" && highestFormulaLevel >= v5DisciplineLevel(kindred, discipline).level) ? kindred.disciplines[discipline].experiencePoints : 0}
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
            <Center>
            <Accordion>
                {disciplinesForClan.length>0?
                <Accordion.Item value={"In-Clan Disciplines"}>
                    <Accordion.Control
                        style={{ backgroundColor: "#25262B" }}
                    ><Text>{kindred.clan === "Caitiff"? 'Caitiff Disciplines':'In-Clan Disciplines'}</Text></Accordion.Control>
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
                :<></>}
                {kindred.clan==="Caitiff"||otherDisciplines.length<=0?<></>:
                <Accordion.Item value={"Out-of-Clan Disciplines"}>
                    <Accordion.Control
                        style={{ backgroundColor: "#25262B" }}
                    ><Text>Out-of-Clan Disciplines</Text></Accordion.Control>
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
            </Center>
        </>
    )
}

export default DisciplineAccordion