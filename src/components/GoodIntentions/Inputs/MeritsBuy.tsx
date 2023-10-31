import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Button, Stack, Select, Center, Table, Text, Group } from "@mantine/core";
import React, { forwardRef, useState } from "react";

import { meritFlawData, v5MeritFlawRefs, v5MeritFlawFilter, V5MeritFlaw, handleMeritFlawChange } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import Tally from "../../../utils/talley";
import { v5xp } from "../../../data/GoodIntentions/V5Experience";
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";

type MeritBuyProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    venueData: GoodIntentionsVenueStyleSheet
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

const MeritBuy = ({ kindred, setKindred, venueData }: MeritBuyProps) => {

    const [selectedMerit, setSelectedMerit] = useState<string | null>("");
    const { bannedMerits } = venueData.goodIntentionsVariables

    const meritFlawData = v5MeritFlawFilter(kindred)
    const filteredData = meritFlawData.filter((merit) => {
        return (
            !bannedMerits.includes(merit.name) &&
            merit.name !== "Unbondable" &&
            merit.type !== "flaw" &&
            (merit.category !== "thin-blood" && merit.category !== "ghoul") &&
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
            <div key={label} id={`${label}`} ref={ref} {...others} style={{ backgroundColor: bgc, border: '1px solid white' }}>
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
                    <Table key={selectedMerit}>
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
                )
            }
        }
    }

    const meritTypesSet = new Set(Object.values(kindred.meritsFlaws).map((merit) => v5GetMeritByName(merit.name).category))
    const meritTypes = Array.from(meritTypesSet)
    meritTypes.sort((a, b) => a.localeCompare(b));

    return (
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
        </Stack>
    )

}

export default MeritBuy