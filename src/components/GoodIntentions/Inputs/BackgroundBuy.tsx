import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
//import { useState } from "react"
import { backgroundData, filterSelectData, handleBackgroundChange, v5BackgroundRefs } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { Stack, Text, Center, Button, Group, Table, Select } from "@mantine/core"
import { useState, forwardRef } from 'react'
import { v5xp } from "../../../data/GoodIntentions/V5Experience"
import { V5SphereKey, SphereSelectData } from "../../../data/GoodIntentions/types/V5Spheres"

export type TypeCategory = 'creationPoints' | 'experiencePoints' ;


type BackgroundBuyProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    type: TypeCategory
}

const BackgroundBuy = ({ kindred, setKindred, type }: BackgroundBuyProps) => {
    const [selectedBackground, setSelectedBackground] = useState<string | null>("");
    const [selectedSphere, setSelectedSphere] = useState<V5SphereKey | null>("");

    const getFlawPoints = (kindred: Kindred): number => {
        let totalFlawPoints = 0;

        Object.values(kindred.backgrounds).forEach((background) => {
            let backgroundInfo = backgroundData.find(entry => entry.name === background.name)

            Object.values(background.advantages).forEach((advantage) => {
                let advantageInfo = backgroundInfo?.advantages?.find(entry => entry.name === advantage.name)

                if (advantageInfo?.type === "disadvantage") {
                    totalFlawPoints += advantage.creationPoints
                }
            })

        });

        return Math.min(totalFlawPoints, 5);

    }

    const getRemainingPoints = (kindred: Kindred): number => {
        let totalBackgroundPoints = 0;

        Object.values(kindred.backgrounds).forEach((background) => {
            let backgroundInfo = backgroundData.find(entry => entry.name === background.name)

            totalBackgroundPoints += background.creationPoints;
            Object.values(background.advantages).forEach((advantage) => {
                let advantageInfo = backgroundInfo?.advantages?.find(entry => entry.name === advantage.name)

                if (advantageInfo?.type === "advantage") {
                    totalBackgroundPoints += advantage.creationPoints
                }
            })

        });

        return 7 + getFlawPoints(kindred) - totalBackgroundPoints
    }

    const filteredData = filterSelectData(kindred, backgroundData)

    const filteredSelectData = filteredData.map((b) => ({
        value: `${b.name}`,
        label: `${b.name}`,
    }))

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

    const handleBackgroundBuy = (selectedBackground: string, pointsType: TypeCategory) => {
        let newBackgroundRef = v5BackgroundRefs.find((b) => b.name === selectedBackground);
        if (!newBackgroundRef) { return; }
    
        let newBackground = { ...newBackgroundRef, id: `${newBackgroundRef.id}-${Date.now()}}`, advantages: [] };
        
        if ((selectedBackground === 'Allies' || selectedBackground === 'Contacts') && selectedSphere) {
            newBackground = { ...newBackground, sphere: [selectedSphere] };
        }
        
        handleBackgroundChange(kindred, setKindred, newBackground, pointsType, pointsType === "experiencePoints" ? v5xp.background : 1);
    }
    

    const getSelectedBackgroundData = () => {
        if (selectedBackground) {
            const selectedBackgroundData = backgroundData.find((b) => b.name === selectedBackground)
            if (selectedBackgroundData) {
                return (
                    <Table>
                        <thead>
                            <tr>
                                <th>Background</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ minWidth: "150px" }}>
                                    <Text color="white">{selectedBackgroundData.name}</Text>
                                    {selectedBackground === "Allies" || selectedBackground === "Contacts" ?
                                        <Select
                                            data={SphereSelectData}
                                            value={selectedSphere} // Make sure selectedSphere contains the correct value
                                            onChange={(val) => {
                                                let sphere = val as V5SphereKey
                                                setSelectedSphere(sphere);
                                            }}
                                            placeholder={`${selectedSphere}`}
                                        />
                                        : <></>}
                                    <Button
                                        color="gray"
                                        disabled={(selectedBackground === "Allies" || selectedBackground === "Contacts") && selectedSphere === ""}
                                        onClick={() => {
                                            handleBackgroundBuy(selectedBackground, type)
                                            setSelectedBackground("")
                                            setSelectedSphere("")
                                        }}>Buy</Button>
                                </td>
                                <td dangerouslySetInnerHTML={{ __html: `${selectedBackgroundData.description}` }} />
                            </tr>
                        </tbody>
                    </Table>
                )
            }
        }
    }


    return (
        <Stack mt={"xl"} align="center" spacing="xl">
            <Text fz={"30px"} ta={"center"}>Select <b>Backgrounds</b></Text>
            <Center>
                <Select
                    data={filteredSelectData}
                    value={selectedBackground}
                    onChange={(val) => setSelectedBackground(val)}
                    itemComponent={SelectItem}
                    searchable
                    allowDeselect
                    placeholder="Select Background to Buy"
                    style={{ width: '70%' }}
                    disabled={type==="creationPoints"?getRemainingPoints(kindred) <= 0:undefined}
                />
            </Center>
            {getSelectedBackgroundData()}
        </Stack>
    )
}

export default BackgroundBuy