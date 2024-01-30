import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Button, ActionIcon, Stack, Accordion, NumberInput, useMantineTheme, Table, Text, Group, TextInput } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import React from "react";

import { globals } from "../../../assets/globals";
import { MeritFlawCategory, v5HandleMeritRemove, meritFlawData, V5MeritFlawRef, V5MeritFlaw, v5MeritFlawRefs, v5MeritLevel, v5MeritFlawFilter, v5HandleXpMeritChange, handleMeritFlawChange, getMeritIcon } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import Tally from "../../../utils/talley";
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";

type TypeCategory = 'creationPoints' | 'experiencePoints' | 'freebiePoints';
type MerfitFlawBool = 'merit' | 'flaw'

type MeritsGridProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    type: TypeCategory
    venueData: GoodIntentionsVenueStyleSheet
    selectCategory?: MeritFlawCategory
    pointMax?: number
    meritFlawBool?: MerfitFlawBool
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

const MeritsGrid = ({ kindred, setKindred, type, venueData, selectCategory, pointMax, meritFlawBool }: MeritsGridProps) => {
    const theme = useMantineTheme()

    const meritFlawData = v5MeritFlawFilter(kindred)

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

    const getThinBloodPoints = (kindred: Kindred) => {
        let totalFlawPoints = 0;
        let totalMeritPoints = 0;
        Object.values(kindred.meritsFlaws).forEach((mf) => {
            let meritFlawInfo = meritFlawData.find(entry => entry.name === mf.name)
            if (meritFlawInfo?.type === "flaw" && meritFlawInfo.category === "thin-blood") {
                totalFlawPoints += mf.creationPoints
            }
            if (meritFlawInfo?.type === "merit" && meritFlawInfo.category === "thin-blood") {
                totalMeritPoints += mf.creationPoints
            }
        })
        return { totalFlawPoints, totalMeritPoints }
    }

    const MeritXpInput = (merit: V5MeritFlawRef) => {

        const meritInfo = meritFlawData.find(entry => entry.name === merit.name)
        const meritRef = kindred.meritsFlaws.find((mf) => mf.name === merit.name) || v5MeritFlawRefs.find((mf) => mf.name === merit.name)
        if (!meritRef || !meritInfo) { return }
        const isFlaw: boolean = meritInfo.type === "flaw"
        const disabled = (isFlaw ?
            false
            : (v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo.cost.length - 1] && meritRef.experiencePoints === 0))
        const min = (isFlaw ?
            0
            : meritRef.freebiePoints === 0 && meritRef.creationPoints === 0 ? meritInfo.cost[0] * 3 : 0)
        const max = (isFlaw ?
            0 === v5MeritLevel(meritRef).level ? meritRef.experiencePoints : undefined
            : meritInfo.cost[meritInfo.cost.length - 1] === v5MeritLevel(meritRef).level ? meritRef.experiencePoints : 0)
        const disablePlus = (isFlaw ?
            0 === v5MeritLevel(meritRef).level
            : (v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo.cost.length - 1]))
        const disableMinus = (isFlaw ?
            meritRef.experiencePoints === 0
            : (meritInfo.cost.length === 1) || (meritRef.freebiePoints === 0 && meritRef.creationPoints === 0 && meritRef.experiencePoints === 3) || (v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo.cost.length - 1] && meritRef.experiencePoints === 0))

        if (meritInfo.category === "thin-blood") {
            return null
        }
        return (
            <div key={merit.name}>
                <Group spacing="xs">
                    <ActionIcon
                        variant="filled"
                        radius="xl"
                        color="dark"
                        disabled={disableMinus}
                        onClick={() => v5HandleXpMeritChange(kindred, setKindred, meritRef, meritRef.experiencePoints - 1)}
                    >
                        <CircleMinus strokeWidth={1.5} color="gray" />
                    </ActionIcon>
                    <NumberInput
                        style={{ width: "60px" }}
                        value={meritRef.experiencePoints}
                        min={min}
                        max={max}
                        step={getStep(meritRef)}
                        disabled={disabled}
                        onChange={(val: number) => {
                            v5HandleXpMeritChange(kindred, setKindred, meritRef, val)
                        }}
                    />
                    <ActionIcon
                        variant="filled"
                        radius="xl"
                        color="dark"
                        disabled={disablePlus}
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
            </div>
        )
    }


    const MeritCreatoinPointInput = (merit: V5MeritFlaw) => {

        const meritInfo = meritFlawData.find(entry => entry.name === merit.name)
        const meritRef = kindred.meritsFlaws.find((mf) => mf.name === merit.name) || v5MeritFlawRefs.find((mf) => mf.name === merit.name)
        if (!meritRef || !meritInfo) { return }
        const getMeritPoints = (meritRef: V5MeritFlawRef) => {
            const meritInfo = kindred.meritsFlaws.find((mf) => mf.name === meritRef.name)
            const creation = meritInfo ? meritInfo.creationPoints : 0
            const freebie = meritInfo ? meritInfo.freebiePoints : 0
            return creation + freebie
        }
        return (
            <NumberInput
                key={merit.name}
                disabled={getMeritPoints(meritRef) === 0 && meritInfo.category === "thin-blood" && ((meritInfo.type === "flaw" && getThinBloodPoints(kindred).totalFlawPoints >= 3) || (meritInfo.type === "merit" && getThinBloodPoints(kindred).totalMeritPoints >= 3))}
                value={getMeritPoints(meritRef)}
                min={meritRef.freebiePoints}
                max={meritInfo.cost.length === 1 && meritInfo.cost[0] === 1 ? 1 : v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo?.cost.length - 1] ? meritRef.creationPoints : meritInfo.cost[meritInfo.cost.length - 1]}
                step={getStep(meritRef)}
                onChange={(val) => {
                    handleMeritFlawChange(kindred, setKindred, meritRef, "creationPoints", val)
                }}
            />
        )
    }

    const MeritFreebiePointInput = (merit: V5MeritFlaw) => {

        const meritInfo = meritFlawData.find(entry => entry.name === merit.name)
        const meritRef = kindred.meritsFlaws.find((mf) => mf.name === merit.name) || v5MeritFlawRefs.find((mf) => mf.name === merit.name)
        if (!meritRef || !meritInfo) { return }
        const getMeritPoints = (meritRef: V5MeritFlawRef) => {
            const meritInfo = kindred.meritsFlaws.find((mf) => mf.name === meritRef.name)
            const creation = meritInfo ? meritInfo.creationPoints : 0
            const freebie = meritInfo ? meritInfo.freebiePoints : 0
            return creation + freebie
        }
        return (
            <NumberInput
                key={merit.name}
                disabled={getMeritPoints(meritRef) === 0 && meritInfo.category === "thin-blood" && ((meritInfo.type === "flaw" && getThinBloodPoints(kindred).totalFlawPoints >= 3) || (meritInfo.type === "merit" && getThinBloodPoints(kindred).totalMeritPoints >= 3))}
                value={getMeritPoints(meritRef)}
                min={meritRef.creationPoints}
                max={meritInfo.cost.length === 1 && meritInfo.cost[0] === 1 ? 1 : v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo?.cost.length - 1] ? meritRef.creationPoints : meritInfo.cost[meritInfo.cost.length - 1]}
                step={getStep(meritRef)}
                onChange={(val) => {
                    handleMeritFlawChange(kindred, setKindred, meritRef, "freebiePoints", val)
                }}
            />
        )
    }

    const createMeritAccordian = (category: string) => {
        if (
            (kindred.clan !== "Thin-Blood" && category === "thin-Blood") ||
            (kindred.clan !== "Ghoul" && category === "ghoul")
        ) {
            return null;
        }

        const { bannedMerits } = venueData.goodIntentionsVariables
        const sortedMerits = kindred.meritsFlaws
            .filter((merit) => (v5GetMeritByName(merit.name)?.category.toLowerCase() === category.toLowerCase()))
            .sort((a, b) => a.id.localeCompare(b.id));

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
            case "mythical":
                bgc = theme.fn.rgba(theme.colors.red[6], 0.90); // Green color
                break;
            case "physical":
                bgc = theme.fn.rgba(theme.colors.red[5], 0.90); // Yellow color
                break;
            case "psychological":
                bgc = theme.fn.rgba(theme.colors.red[4], 0.90); // Orange color
                break;
            case "thin-Blood":
                bgc = theme.fn.rgba(theme.colors.red[3], 0.90); // Gray color
                break;
            case "ghoul":
                bgc = theme.fn.rgba(theme.colors.red[3], 0.90); // Gray color
                break;
        }

        return (
            <Accordion.Item value={`${category} accordion`} key={category}>
                <Accordion.Control style={{ color: "white", backgroundColor: bgc }}>
                <FontAwesomeIcon icon={getMeritIcon(category as MeritFlawCategory)} /> {category.toUpperCase()}
                </Accordion.Control>
                <Accordion.Panel>
                    <Table>
                        <thead>
                            <tr>
                                <th>Merit</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {type === "experiencePoints" ? (
                                sortedMerits.map((meritFlaw: V5MeritFlawRef) => {
                                    const meritInfo = v5GetMeritByName(meritFlaw.name);
                                    if (!meritInfo) {
                                        return null;
                                    }
                                    const icon = meritInfo.type === "flaw" ? flawIcon() : meritIcon();
                                    return (
                                        <React.Fragment key={meritFlaw.name}>
                                            <tr>
                                                <td style={{ minWidth: "220px" }}>
                                                    <Stack>
                                                        <Text>
                                                            {icon} &nbsp; {meritInfo.name} <b>Level: {v5MeritLevel(meritFlaw).level}</b>
                                                        </Text>
                                                        <Group>Rating: {getRating(meritInfo.cost)}</Group>
                                                        {MeritXpInput(meritFlaw)}
                                                    </Stack>
                                                </td>
                                                <td dangerouslySetInnerHTML={{ __html: `${meritInfo.description}` }} />
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <TextInput
                                                        label="Merit Notes"
                                                        value={meritFlaw.userNote}
                                                        onChange={(event) => {
                                                            handleMeritFlawChange(kindred, setKindred, meritFlaw, "userNote", event.target.value);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })
                            ) : 
                            type === "creationPoints" ? (
                                meritFlawData
                                    .filter(((mf) => mf.category.toLocaleLowerCase() === category.toLowerCase() && !bannedMerits.includes(mf.name) && (!pointMax || (mf && mf.cost.every(cost => cost <= pointMax)))))
                                    .map((meritFlaw) => (
                                        <tr key={`${meritFlaw.name} ${meritFlaw.type}`}>
                                            <td style={{ minWidth: "150px" }}>
                                                <Text key={`${meritFlaw.name}-${meritFlaw.type}`}>
                                                    {meritFlaw.type === "flaw" ? flawIcon() : meritIcon()} &nbsp; {meritFlaw.name}
                                                </Text>
                                                {getRating(meritFlaw.cost)}
                                                {MeritCreatoinPointInput(meritFlaw)}
                                            </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${meritFlaw.description}` }} />
                                        </tr>
                                    ))
                            ) : 
                            type === "freebiePoints" ? (
                                meritFlawData
                                .filter(((mf) => mf.category.toLocaleLowerCase() === category.toLowerCase() && !bannedMerits.includes(mf.name) && (!pointMax || (mf && mf.cost.every(cost => cost <= pointMax))) && (!meritFlawBool || (mf && mf.type === meritFlawBool))))
                                .map((meritFlaw) => (
                                        <tr key={`${meritFlaw.name} ${meritFlaw.type}`}>
                                            <td style={{ minWidth: "150px" }}>
                                                <Text key={`${meritFlaw.name}-${meritFlaw.type}`}>
                                                    {meritFlaw.type === "flaw" ? flawIcon() : meritIcon()} &nbsp; {meritFlaw.name}
                                                </Text>
                                                {getRating(meritFlaw.cost)}
                                                {MeritFreebiePointInput(meritFlaw)}
                                            </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${meritFlaw.description}` }} />
                                        </tr>
                                    ))
                            ) : null}
                        </tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        );
    };


    const meritTypesSet = new Set(Object.values(kindred.meritsFlaws).map((merit) => v5GetMeritByName(merit.name).category))
    const meritTypes = Array.from(meritTypesSet)
    meritTypes.sort((a, b) => a.localeCompare(b));

    let categoryArray = ["thin-Blood", "ghoul", "bonding", "connection", "feeding", "mythical", "physical", "psychological"]


    return (
        <Accordion w={globals.isSmallScreen ? "100%" : "600px"}>
            {
            selectCategory? 
            (
                createMeritAccordian(selectCategory)
            )
            :
            type === "experiencePoints" ? (
                meritTypes.map((c) => createMeritAccordian(c))
            ) : (
                categoryArray.map((c) => createMeritAccordian(c))
            )}
        </Accordion>
    );

}

export default MeritsGrid