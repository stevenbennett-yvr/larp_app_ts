import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { powerRefs, Power, handlePowerChange, removePower, allPowers, getFilteredPower } from "../../../data/GoodIntentions/types/V5Powers"
import { DisciplineKey, v5DisciplineLevel, disciplines, allDisciplines } from "../../../data/GoodIntentions/types/V5Disciplines"
import { useState, useEffect } from "react"
import { Accordion, Text, Image, Button, Table, Center, Stack } from "@mantine/core"
import { globals } from "../../../assets/globals"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"

type V5PowersXpInputsProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}

const V5PowersInputs = ({ kindred, setKindred }: V5PowersXpInputsProps) => {

    const [learnablePowers, setLearnablePowers] = useState<Power[]>(getFilteredPower(kindred))
    useEffect(() => {
        setLearnablePowers(getFilteredPower(kindred))
    }, [kindred])

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


    const handleSelect = (power: Power) => {
        const powerRef = powerRefs.find((p) => p.name === power.name)
        if (powerRef && !kindred.powers.some(existingPower => existingPower.name === power.name)) {
            handlePowerChange(kindred, setKindred, powerRef, "freebiePoints", 1)
        }
    }

    const handleDeselect = (power: Power) => {
        const powerRef = powerRefs.find((p) => p.name === power.name)
        if (powerRef) {
            removePower(kindred, setKindred, powerRef)
        }
    }

    const getHighestSelectedLevelInDiscipline = (kindred: Kindred, disciplineCategory: DisciplineKey) => {
        let highestLevel = 0;

        kindred.powers.forEach((power) => {
            let powerData = allPowers.find((p) => power.name === p.name)
            if (!powerData) { return 0 }
            if (powerData.discipline === disciplineCategory && powerData.level > highestLevel) {
                highestLevel = powerData.level;
            }
        });

        return highestLevel;
    };

    const getSelectedPowers = (kindred: Kindred, discipline: DisciplineKey) => {
        return kindred.powers.filter((power) => {
            const matchingPower = allPowers.find((p) => power.name === p.name);
            return matchingPower?.discipline === discipline;
        });
    };

    const disciplinePowersSelected = (kindred: Kindred, discipline: DisciplineKey) => {
        const selectedPowers = getSelectedPowers(kindred, discipline);

        return selectedPowers.length < v5DisciplineLevel(kindred, discipline).level;
    };

    const createPowerAccordion = (discipline: DisciplineKey) => {
        const filteredPowers = learnablePowers.filter((power) => power.discipline.toLowerCase() === discipline.toLowerCase())

        filteredPowers.sort((a, b) => {
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        });

        // Count the number of selected powers in the current discipline
        const selectedPowersInDiscipline = kindred.powers.filter((power) => allPowers.find((p) => power.name === p.name)?.discipline === discipline);

        return (
            <div>
                <Accordion.Item value={discipline}>
                    <Accordion.Control icon={<Image height={20} width={20} src={disciplines[discipline].logo} />}>
                        {disciplinePowersSelected(kindred, discipline) ?
                            <Text>{discipline.toUpperCase()} <b style={{ color: "#880808" }}>{v5DisciplineLevel(kindred, discipline).level - getSelectedPowers(kindred, discipline).length} Remaining</b></Text> :
                            <Text>{discipline.toUpperCase()}</Text>
                        }


                    </Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Power</th>
                                    <th>Description</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPowers.map((power) => {
                                    const isPowerSelected = selectedPowersInDiscipline.some((p) => p.name === power.name);
                                    const powerRef = kindred.powers.find((p) => p.name === power.name)
                                    return (
                                        <tr key={`${power.name} desktop`}>
                                            <td>
                                                <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{power.name}</Text>
                                                <Image
                                                    fit="contain"
                                                    withPlaceholder
                                                    src={disciplines[discipline].logo}
                                                    height={30}
                                                    width={30}
                                                    alt="order"
                                                />
                                                <p style={{ color: "white" }}>{power.discipline} {power.level} {power.amalgamPrerequisites.length > 0 ? `+ ${power.amalgamPrerequisites[0].discipline} ${power.amalgamPrerequisites[0].level}` : ""}</p>
                                            </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${power.summary} <p>Rote Pool: ${power.dicePool}  ()</p>` }} />
                                            <td>
                                                {isPowerSelected ? (
                                                    <Button color="red" disabled={getHighestSelectedLevelInDiscipline(kindred, discipline) > power.level || (powerRef && powerRef?.creationPoints > 0)} onClick={() => { handleDeselect(power); }}>Deselect</Button>
                                                ) : (
                                                    disciplinePowersSelected(kindred, discipline) && (getHighestSelectedLevelInDiscipline(kindred, discipline) >= power.level - 1) ? (
                                                        <Button color="gray" onClick={() => { handleSelect(power); }}>Select</Button>
                                                    ) : (
                                                        <Button disabled>Select</Button>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
            </div>
        )
    }

    return (
        <Center>
            <Stack>
                <Text mt={"xl"} ta="center" fz="xl" fw={700}>In Clan Powers</Text>

                <Accordion>
                    {
                        (knownInClan as DisciplineKey[]).map((d) => createPowerAccordion(d))
                    }
                </Accordion>

                {knownOutClan.length > 0 ?
                    <>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Out Clan Powers</Text>
                        <Accordion>
                            {
                                (knownOutClan as DisciplineKey[]).map((d) => createPowerAccordion(d))
                            }
                        </Accordion>
                    </>
                    : <></>}
            </Stack>
        </Center>
    )

}

export default V5PowersInputs