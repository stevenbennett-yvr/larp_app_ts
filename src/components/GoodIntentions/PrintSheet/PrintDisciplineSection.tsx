import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { v5DisciplineLevel, DisciplineKey, allDisciplines } from "../../../data/GoodIntentions/types/V5Disciplines"
import { v5AttributeLevel } from "../../../data/GoodIntentions/types/V5Attributes"
import { v5HumanityLevel } from "../../../data/GoodIntentions/types/V5Humanity"
import { v5BloodPotencyLevel, bloodPotencies } from "../../../data/GoodIntentions/types/V5BloodPotency"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { Card, Table, Group, Grid, Stack, Title, Center, Divider, Checkbox, Text } from "@mantine/core"
import Dots from "../../../utils/dots"
import { upcase } from "../../../utils/case"
import { allPowers } from "../../../data/GoodIntentions/types/V5Powers"
import { Ceremonies } from "../../../data/GoodIntentions/types/V5Ceremonies"
import { Rituals } from "../../../data/GoodIntentions/types/V5Rituals"
import { Formulae } from "../../../data/GoodIntentions/types/V5Formulae"
import { globals } from "../../../assets/globals"
import { useState } from "react"
import { v5MeritLevel } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws"

type PrintSheetProps = {
    kindred: Kindred,
}

function renderCheckboxes(number: number, defaultChecked: boolean, set: React.Dispatch<React.SetStateAction<number>>) {
    const groups = [];

    const handleCheckboxChange = (isChecked: boolean) => {
        // You can update the state here
        set((prevNumber) => isChecked ? prevNumber + 1 : prevNumber - 1);
    };

    for (let i = 0; i < number; i += 5) {
        const groupCheckboxes = [];
        for (let j = 0; j < 5 && i + j < number; j++) {
            groupCheckboxes.push(
                <Checkbox
                    key={i + j}
                    color="red"
                    indeterminate
                    defaultChecked={defaultChecked}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
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


function renderHumanityCheckboxes(humanity: number, set: React.Dispatch<React.SetStateAction<number>>) {
    const groups = [];

    const handleCheckboxChange = (isChecked: boolean) => {
        // You can update the state here
        set((prevNumber) => isChecked ? prevNumber + 1 : prevNumber - 1);
    };

    for (let i = 0; i < 10; i += 5) {
        const groupCheckboxes = [];
        for (let j = 0; j < 5 && i + j < 10; j++) {
            groupCheckboxes.push(
                <Checkbox
                    key={i + j}
                    color="violet"
                    indeterminate
                    disabled={i + j < humanity}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
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

const DisciplineSection = ({ kindred }: PrintSheetProps) => {

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


    const [wounds, setWounds] = useState<number>(0)
    const lowPain = kindred.meritsFlaws.find((mf) => mf?.name === "Low Pain Threshold");
    const lowPainLevel = lowPain ? v5MeritLevel(lowPain).level | 0 : 0;
    const toughness = kindred.powers.some((p) => p.name === "Toughness")


    const [wp, setWp] = useState<number>(0)
    const [stains, setStains] = useState<number>(0)
    const [hunger, setHunger] = useState<number>(0)

    const hungerEffect = () => {
        switch (hunger) {
            case 0:
                return <Text align="center" size="sm">Immune to all types of Frenzy unless triggered by a supernatural power</Text>;
            case 1:
                return <Text align="center" size="sm">Can only Slake to zero (o) by draining a mortal completely of all blood</Text>;
            case 2:
                return <Text align="center" size="sm"></Text>;
            case 3:
                return <Text align="center" size="sm">Bestial Failures</Text>;
            case 4:
                return <Text align="center" size="sm">Messy criticals</Text>;
            case 5:
                return <Text align="center" size="sm"><p>Can no longer voluntarily Rouse the Blood</p><p>Effects that cause an involuntary Rouse check instead force you to immediately test for Hunger Frenzy</p><p>Effects that cause your Hunger to increase automatically force you into a Hunger Frenzy</p></Text>;


            default:
                return null; // or some other default component
        }
    };

    const health = v5AttributeLevel(kindred, "stamina").level + 3 + (toughness ? 1 : 0);



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
                        <Stack>
                            <Center>
                                {renderCheckboxes(health, false, setWounds)}
                            </Center>
                            {(health) - wounds <= (3 + lowPainLevel) && !toughness ?
                                <Text align="center">Wound Penalties- Lose your simple action every round</Text>
                                : <></>}
                        </Stack>
                    </Center>
                    <Title order={5} align="center">Willpower</Title>
                    <Center>
                        {renderCheckboxes(willpower, true, setWp)}
                    </Center>
                    {Math.abs(wp) === willpower ? <Text align="center">Impaired: All of your test pools are reduced by 2</Text> : <></>}
                    <Title order={5} align="center">Humanity/Stains</Title>
                    <Center>
                        {renderHumanityCheckboxes(humanity, setStains)}
                    </Center>
                    {humanity + stains === 10 ? <Text align="center">Impaired: All of your test pools are reduced by 2</Text> : <></>}
                    <Title order={5} align="center">Hunger</Title>
                    <Center>
                        {renderCheckboxes(5, false, setHunger)}
                    </Center>
                    {hungerEffect()}
                    <Title order={5} align="center">Blood Potency</Title>
                    <Center>
                        <Dots n={bloodPotency} />
                    </Center>
                    <Center>
                        <Stack>
                            <Group position="apart">
                                <Text align="center" size="xs"><b>Blood Surge</b>: <p>{bloodPotencies[bloodPotency].surgeBonus}</p></Text>
                                <Text align="center" size="xs"><b>Mend Amount</b>: <p>{bloodPotencies[bloodPotency].mend}</p></Text>
                            </Group>
                            <Group position="apart">
                                <Text align="center" size="xs"><b>Rousing Bonus</b>: <p>{bloodPotencies[bloodPotency].rouseBonus}</p></Text>
                                <Text align="center" size="xs"><b>Defense Bonus</b>: <p>{bloodPotencies[bloodPotency].defnese}</p></Text>
                            </Group>
                            <Text align="center" size="xs"><b>Feeding Penalty</b>: <p>{bloodPotencies[bloodPotency].feedingPenalty}</p></Text>
                        </Stack>
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