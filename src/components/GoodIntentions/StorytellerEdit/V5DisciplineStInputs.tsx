import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Center, Stack, Text, Table, Input } from "@mantine/core";
import { DisciplineKey, allDisciplines, disciplineKeySchema, v5DisciplineLevel, v5FindMaxDiscipline, v5HandleXpDisciplineChange } from "../../../data/GoodIntentions/types/V5Disciplines";
import { Clans } from "../../../data/GoodIntentions/types/V5Clans";
import { upcase } from "../../../utils/case";

type V5SkillStInputsProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
}

const V5DisciplineStInputs = ({ kindred, setKindred }: V5SkillStInputsProps) => {

    let mostDisciplines: any = allDisciplines.filter((disciplineName) => {
        if (kindred.clan === "Thin-Blood") { return disciplineName !== "thin-blood alchemy" && kindred.disciplines[disciplineName].creationPoints !== 0 }
        return disciplineName !== "thin-blood alchemy";
    })
    const thinBloodAlchemy = kindred.meritsFlaws.some((mf) => mf.name === "Thin-Blood Alchemist")
    const disciplinesForClan = kindred.clan === "Thin-Blood" && thinBloodAlchemy ? ["thin-blood alchemy"] : kindred.clan === "Caitiff" ? mostDisciplines : Clans[kindred.clan].disciplines;
    const otherDisciplines = mostDisciplines.filter((disciplineName: any) => {
        return !disciplinesForClan.includes(disciplineName);
    });

    function changeCreationPoints(
        discipline: DisciplineKey,
        creationPoints: number,
    ): void {

        const updatedAttributes = {
            ...kindred.disciplines,
            [discipline]: {
                ...kindred.disciplines[discipline],
                creationPoints
            }
        }

        const updatedCharacter = {
            ...kindred,
            disciplines: updatedAttributes
        }

        setKindred(updatedCharacter)
    }

    const generateTable = (disciplines: any) => {
        return (
            <Table
                verticalSpacing={0}
                horizontalSpacing={0}
                highlightOnHover withColumnBorders
            >
                <thead>
                    <tr>
                        <td></td>
                        <td>Lvl</td>
                        <td>CP</td>
                        <td>XP</td>
                    </tr>
                </thead>
                <tbody>
                    {disciplines
                        .map((discipline: any) => disciplineKeySchema.parse(discipline)).map((discipline: DisciplineKey) => {
                            return (

                                <tr key={`row-${discipline}`}>
                                    <td>{upcase(discipline)}</td>
                                    <td>{v5DisciplineLevel(kindred, discipline).level}</td>
                                    <td>
                                        <Input
                                            style={{
                                                width: '50px',
                                                margin: '0 8px',
                                            }}
                                            key={`st-${discipline}-creationPoints`}
                                            min={1}
                                            max={4}
                                            type="number"
                                            value={kindred.disciplines[discipline].creationPoints}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const val = Number(e.target.value);
                                                changeCreationPoints(discipline, val)
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            style={{
                                                width: '50px',
                                                margin: '0 8px',
                                            }}
                                            type="number"
                                            key={`st-${discipline}-ExperiencePoints`}
                                            min={0}
                                            max={v5FindMaxDiscipline(kindred, discipline)}
                                            value={kindred.disciplines[discipline].experiencePoints}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const val = Number(e.target.value);
                                                v5HandleXpDisciplineChange(kindred, setKindred, discipline, val)
                                            }}
                                        />
                                    </td>

                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        )

    }

    return (
        <Center>
            <Stack>
                <Text>
                    Disciplines
                </Text>
                {generateTable(disciplinesForClan)}
                {generateTable(otherDisciplines)}
            </Stack>
        </Center>
    );

}

export default V5DisciplineStInputs

