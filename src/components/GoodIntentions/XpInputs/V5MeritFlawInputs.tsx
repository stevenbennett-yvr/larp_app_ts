import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Button, ActionIcon, Stack, Select, Accordion, Center, NumberInput, useMantineTheme, Table, Text, Group } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import { forwardRef, useState } from "react";

import { globals } from "../../../assets/globals";
import { v5HandleMeritRemove, meritFlawData, V5MeritFlawRef, v5MeritFlawRefs, v5MeritLevel, v5MeritFlawFilter, v5HandleXpMeritChange, V5MeritFlaw, handleMeritFlawChange } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import Tally from "../../../utils/talley";
import { v5xp } from "../../../data/GoodIntentions/V5Experience";

type V5MeritFlawInputsProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

const getRating = (array: number[]) => {
    let first = array[0]
    let last = array[array.length - 1]

    if (first === last) {
        return <Tally n={last} />
    } else {
        return <Group><Tally n={first} /> to <Tally n={last} /></Group>
    }
}

const v5GetMeritByName = (name: string) => {
    let meritInfo = meritFlawData.find((merit) => {
        return merit.name.trim() === name.trim();
    });
    if (!meritInfo) {
        return {
            id: "",
            name: "",
            type: "flaw",
            category: "feeding",
            cost: [0],
            description: "",
            source: ""
        }
    } else {
        return meritInfo
    }
}

const V5MeritFlawInputs = ({ kindred, setKindred }: V5MeritFlawInputsProps) => {
    const theme = useMantineTheme()

    const [selectedMerit, setSelectedMerit] = useState<string | null>("");

    const meritFlawData = v5MeritFlawFilter(kindred)
    const filteredData = meritFlawData.filter((merit) => {
        return (
            merit.type !== "flaw" &&
            merit.category !== "thin-blood" &&
            !kindred.meritsFlaws.some((existingMerit) => existingMerit.name === merit.name)
        );
    });

    const selectData = filteredData.map((merit) => ({
        value: `${merit.name}`,
        label: `${merit.name}`
    }));

    interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
        label: string;
        bgc: string;
    }
    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ label, bgc, ...others }: ItemProps, ref) => (
            <div id={`${label}`} ref={ref} {...others} style={{ backgroundColor: bgc, border: '1px solid white' }}>
                <Group noWrap>
                    <div>
                        <Text size="sm" color="white">{label}</Text>
                    </div>
                </Group>
            </div>
        )
    );

    const handleMeritBuy = (meritInfo: V5MeritFlaw) => {
        let meritRef = v5MeritFlawRefs.find((m) => m.name === meritInfo.name)
        if (!meritRef) { return }
        const newMerit = { ...meritRef, id: `${meritInfo.id}-${Date.now()}` };
        handleMeritFlawChange(kindred, setKindred, newMerit, "experiencePoints", meritInfo.cost[0] * v5xp.merit)
    }

    const getSelectedMeritData = () => {
        if (selectedMerit) {
            const selectedMeritInfo = meritFlawData.find((merit) => merit.name === selectedMerit);
            if (selectedMeritInfo) {
                return (
                    <>
                        <Table>
                            <thead>
                                <tr>
                                    <td>Merit</td>
                                    <td>Description</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Text>{selectedMeritInfo.name}</Text>
                                        <Text>{getRating(selectedMeritInfo.cost)}</Text>
                                        <Button
                                            color="gray"
                                            onClick={() => {
                                                handleMeritBuy(selectedMeritInfo)
                                                setSelectedMerit("")
                                            }}
                                        >
                                            Buy Merit
                                        </Button>
                                    </td>
                                    <td dangerouslySetInnerHTML={{ __html: `${selectedMeritInfo.description}` }} />
                                </tr>
                            </tbody>
                        </Table>
                    </>
                )
            }
        }
    }

    const getStep = (meritFlaw: V5MeritFlawRef): number => {
        const meritInfo = meritFlawData.find(entry => entry.name === meritFlaw.name)
        let minCost = meritInfo?.cost[0];
        let maxCost = meritInfo?.cost[meritInfo?.cost.length - 1]
        if (!minCost || !maxCost) { return 1 }
        if (minCost === maxCost) {
            return minCost;
        } else {
            return 1;
        }
    }

    const MeritInput = (merit: V5MeritFlawRef) => {

        const meritInfo = meritFlawData.find(entry => entry.name === merit.name)
        const meritRef = kindred.meritsFlaws.find((mf) => mf.name === merit.name) || v5MeritFlawRefs.find((mf) => mf.name === merit.name)
        if (!meritRef || !meritInfo) { return }

        return (
            <>
                <Group spacing="xs">
                    <ActionIcon
                        variant="filled"
                        radius="xl"
                        color="dark"
                        disabled={(meritInfo.cost.length === 1)||(meritRef.freebiePoints === 0 && meritRef.creationPoints === 0 && meritRef.experiencePoints === 3) || (v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo.cost.length - 1] && meritRef.experiencePoints === 0)}
                        onClick={() => v5HandleXpMeritChange(kindred, setKindred, meritRef, meritRef.experiencePoints - 1)}
                    >
                        <CircleMinus strokeWidth={1.5} color="gray" />
                    </ActionIcon>
                    <NumberInput
                        style={{ width: "60px" }}
                        value={meritRef.experiencePoints}
                        min={meritRef.freebiePoints === 0 && meritRef.creationPoints === 0 ? meritInfo.cost[0] * 3 : 0}
                        max={meritInfo.cost[meritInfo.cost.length - 1] === v5MeritLevel(meritRef).level ? meritRef.experiencePoints : 0}
                        step={getStep(meritRef)}
                        disabled={(v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo.cost.length - 1] && meritRef.experiencePoints === 0)}
                        onChange={(val: number) => {
                            v5HandleXpMeritChange(kindred, setKindred, meritRef, val)
                        }}
                    />
                    <ActionIcon
                        variant="filled"
                        radius="xl"
                        color="dark"
                        disabled={(v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo.cost.length - 1])}
                        onClick={() => {
                            v5HandleXpMeritChange(kindred, setKindred, meritRef, meritRef.experiencePoints + 1);
                        }}
                    >
                        <CirclePlus strokeWidth={1.5} color="gray" />
                    </ActionIcon>
                </Group>
                {meritRef.creationPoints === 0 && meritRef.freebiePoints === 0 ?
                    <Button
                        onClick={() => {
                            console.log("test")
                            v5HandleMeritRemove(kindred, setKindred, meritRef)
                        }}
                    >Remove Merit</Button>
                    :
                    <></>
                }
            </>
        )
    }

    const createMeritAccordian = (category: string) => {

        const sortedMerits = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.category.toLocaleLowerCase() === category.toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))
        let bgc = ""



        switch (category) {
            case "bonding":
                bgc = theme.fn.rgba(theme.colors.red[9], 0.90); // Blue color
                break;
            case "connection":
                bgc = theme.fn.rgba(theme.colors.red[8], 0.90); // Red color
                break;
            case "feeding":
                bgc = theme.fn.rgba(theme.colors.red[7], 0.90); // Purple color
                break;
            case "mystical":
                bgc = theme.fn.rgba(theme.colors.red[6], 0.90); // Green color
                break;
            case "physical":
                bgc = theme.fn.rgba(theme.colors.red[5], 0.90); // Yellow color
                break;
            case "psychological":
                bgc = theme.fn.rgba(theme.colors.red[4], 0.90); // Orange color
                break;
            case "thin-blood":
                bgc = theme.fn.rgba(theme.colors.red[3], 0.90); // Gray color
                break;
        }

        return (
            <div>
                <Accordion.Item value={category}>
                    <Accordion.Control style={{ color: "white", backgroundColor: bgc }}>{category.toUpperCase()}</Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        Merit
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMerits.map((meritFlaw: V5MeritFlawRef) => {
                                    const meritInfo = v5GetMeritByName(meritFlaw.name)
                                    if (!meritInfo) { return null }
                                    const icon = meritInfo.type === "flaw" ? flawIcon() : meritIcon()
                                    return (
                                        <tr key={`${meritFlaw.name} ${meritInfo.type}`}>
                                            <td style={{ minWidth: "220px" }}>
                                                <Stack>
                                                <Text>{icon} &nbsp; {meritInfo.name} <b>Level: {v5MeritLevel(meritFlaw).level}</b></Text>
                                                <Group>Rating: {getRating(meritInfo.cost)}</Group>
                                                {meritInfo.type === "merit"?
                                                <>{MeritInput(meritFlaw)}</>
                                                :<></>}
                                                </Stack>
                                            </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${meritInfo.description}` }} />
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
            </div>
        )

    }

    const meritTypesSet = new Set(Object.values(kindred.meritsFlaws).map((merit) => v5GetMeritByName(merit.name).category))
    const meritTypes = Array.from(meritTypesSet)
    meritTypes.sort((a, b) => a.localeCompare(b));

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px' }}>
            <Stack>
                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Merits & Flaws</Text>
                <Select
                    data={selectData}
                    value={selectedMerit}
                    onChange={(val) => setSelectedMerit(val)}
                    placeholder="Select Merit to buy"
                    itemComponent={SelectItem}
                    searchable
                    allowDeselect
                />
                <Center>
                    {getSelectedMeritData()}
                </Center>
                <Center>
                    <Accordion w={globals.isSmallScreen ? "100%" : "600px"}>
                        {
                            meritTypes.map((c) => createMeritAccordian(c))
                        }
                    </Accordion>
                </Center>
            </Stack>
        </Center>
    )

}

export default V5MeritFlawInputs