import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { v5DisciplineLevel, DisciplineKey, allDisciplines } from "../../../data/GoodIntentions/types/V5Disciplines"
import { v5AttributeLevel } from "../../../data/GoodIntentions/types/V5Attributes"
import { v5HumanityLevel } from "../../../data/GoodIntentions/types/V5Humanity"
import { v5BloodPotencyLevel } from "../../../data/GoodIntentions/types/V5BloodPotency"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { Card, Table, Group, Grid, Stack, Title, Center, Divider, Checkbox } from "@mantine/core"
import Dots from "../../../utils/dots"
import { upcase } from "../../../utils/case"
import { allPowers } from "../../../data/GoodIntentions/types/V5Powers"
import { Ceremonies } from "../../../data/GoodIntentions/types/V5Ceremonies"
import { Rituals } from "../../../data/GoodIntentions/types/V5Rituals"
import { Formulae } from "../../../data/GoodIntentions/types/V5Formulae"
import { globals } from "../../../assets/globals"

type PrintSheetProps = {
    kindred: Kindred,
}

function renderCheckboxes(number: number, set: boolean) {
    const groups = [];

    for (let i = 0; i < number; i += 5) {
        const groupCheckboxes = [];
        for (let j = 0; j < 5 && i + j < number; j++) {
            groupCheckboxes.push(
                <Checkbox defaultChecked={set} key={i + j} color="red" indeterminate />
            );
        }

        groups.push(
            <Group key={i} spacing={2}>
                {groupCheckboxes}
            </Group>
        );
    }

    return (
        <Stack spacing="xs">
            {groups}
        </Stack>
    );
}

function renderHumanityCheckboxes(humanity: number) {
    const groups = [];

    for (let i = 0; i < 10; i += 5) {
        const groupCheckboxes = [];
        for (let j = 0; j < 5 && i + j < 10; j++) {
            groupCheckboxes.push(
                <Checkbox
                    key={i + j}
                    color="violet"
                    indeterminate
                    disabled={i + j < humanity}
                />
            );
        }

        groups.push(
            <Group key={i} spacing={2}>
                {groupCheckboxes}
            </Group>
        );
    }

    return (
        <Stack spacing="xs">
            {groups}
        </Stack>
    );
}

const DisciplineSection = ({kindred}:PrintSheetProps) => {

    const knownDisciplines = Object.keys(kindred.disciplines).filter((disciplineKey) => {
        const discipline = disciplineKey as DisciplineKey
        return v5DisciplineLevel(kindred, discipline).level > 0;
    })
    let mostDisciplines = allDisciplines.filter((disciplineName) => {
        return disciplineName !== "thin-blood alchemy";
    })
    const disciplinesForClan = kindred.clan === "Caitiff" ? mostDisciplines : Clans[kindred.clan].disciplines;
    const knownInClan = knownDisciplines.filter((disciplineName) => {
        const discipline = disciplineName as DisciplineKey
        return disciplinesForClan.includes(discipline)
    })
    const knownOutClan = knownDisciplines.filter((disciplineName) => {
        const discipline = disciplineName as DisciplineKey
        return !disciplinesForClan.includes(discipline)
    })

    const health = v5AttributeLevel(kindred, "stamina").level + 3



    const willpower = v5AttributeLevel(kindred, "resolve").level + v5AttributeLevel(kindred, "composure").level
    const humanity = v5HumanityLevel(kindred).level
    const bloodPotency = v5BloodPotencyLevel(kindred).level

    const disciplineTable = (discipline: DisciplineKey) => {
        const disciplineLevel = v5DisciplineLevel(kindred, discipline).level

        return (
            <Center>
            <Card w={200}>
                <Table fz="sm">
                    <thead>
                        <tr>
                            <th>
                                <Group>
                                    {upcase(discipline)} <Dots n={disciplineLevel} />
                                </Group>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {kindred.powers.map((power, index) => {
                            let powerInfo = allPowers.find((p) => p.name === power.name);
                            if (powerInfo?.discipline === discipline) {
                                return (
                                    <tr key={index}>
                                        <td>{powerInfo.level} {powerInfo.name}</td>
                                    </tr>
                                );
                            } else {
                                return <></>;
                            }
                        })}
                    </tbody>
                </Table>
            </Card>
            </Center>
        )
    }

    const disciplineColumn = (disciplines: DisciplineKey[]) => {
        //const disciplineInfo = disciplines[discipline]

        return (
            <Grid.Col span={3} w={300}>
                <Stack>
                    {
                        (disciplines as DisciplineKey[]).map((d) => disciplineTable(d))
                    }
                </Stack>
            </Grid.Col>
        );
    }

    const coreVals = () => {

        return (
            <Grid.Col span={3}>
                <Stack>
                    <Title order={5} align="center">Health</Title>
                    <Center>
                        {renderCheckboxes(health, false)}
                    </Center>
                    <Title order={5} align="center">Willpower</Title>
                    <Center>
                        {renderCheckboxes(willpower, true)}
                    </Center>
                    <Title order={5} align="center">Humanity/Stains</Title>
                    <Center>
                        {renderHumanityCheckboxes(humanity)}
                    </Center>
                    <Title order={5} align="center">Blood Potency</Title>
                    <Center>
                        <Dots n={bloodPotency} />
                    </Center>
                </Stack>
            </Grid.Col>
        )

    }


    const rituals = kindred.rituals
    const ceremonies = kindred.ceremonies
    const formulae = kindred.formulae

    const ritualCard = () => {

        return (
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <td>
                                Rituals
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {rituals.map((ritual) => {
                            const ritualInfo = Rituals.find((r) => r.name === ritual.name)
                            if (!ritualInfo) { return null }
                            return (
                                <tr key={ritual.name}>
                                    <td>
                                        <Group>{ritualInfo.name} {ritualInfo.level}</Group>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }

    const ceremonyCard = () => {

        return (
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <td>
                                Ceremonies
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {ceremonies.map((ceremony) => {
                            const ritualInfo = Ceremonies.find((r) => r.name === ceremony.name)
                            if (!ritualInfo) { return null }
                            return (
                                <tr key={ceremony.name}>
                                    <Group>{ritualInfo.name} {ritualInfo.level}</Group>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }

    const formulaCard = () => {
        return (
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <td>
                                Formulae
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {formulae.map((formula) => {
                            const ritualInfo = Formulae.find((f) => f.name === formula.name)
                            if (!ritualInfo) { return null }
                            return (
                                <tr key={formula.name}>
                                    <Group>{ritualInfo.name} {ritualInfo.level}</Group>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }

    return (
        <Center>
            <Stack>
            <Divider my="sm" label="Disciplines" labelPosition="center" />

            <Grid columns={globals.isPhoneScreen ? 3 : 9}>
                {
                    disciplineColumn(knownInClan as DisciplineKey[])
                }
                {
                    disciplineColumn(knownOutClan as DisciplineKey[])
                }
                {
                    coreVals()
                }
            </Grid>


            {kindred.rituals.length === 0 && kindred.ceremonies.length === 0 && kindred.formulae.length === 0 ? <></>
                :
                <>
                    <Divider my="sm" label="Rituals/Ceremonies" labelPosition="center" />
                    <Group>
                        {kindred.rituals.length > 0 ?
                            <>{ritualCard()}</>
                            : <></>}
                        {kindred.ceremonies.length > 0 ?
                            <>{ceremonyCard()}</>
                            : <></>}
                        {kindred.formulae.length > 0 ?
                            <>{formulaCard()}</>
                            : <></>}
                    </Group>
                </>
            }
            </Stack>
        </Center>
    )

}

export default DisciplineSection