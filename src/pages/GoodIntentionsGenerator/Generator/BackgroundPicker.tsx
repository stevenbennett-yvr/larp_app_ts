import { faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
//import { useState } from "react"
import { handleBackgroundRemove, V5BackgroundRef, backgroundData, v5BackgroundLevel, handleBackgroundChange, v5BackgroundRefs, V5AdvantageRef, emptyAdvantage, v5AdvantageLevel } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { Text, Center, Stack, ScrollArea, Accordion, Button, Group, Alert, Table, NumberInput, Select } from "@mantine/core"
import { globals } from "../../../assets/globals"
import { useState, forwardRef } from 'react'

type BackgroundPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}


const BackgroundPicker = ({ kindred, setKindred, nextStep, backStep }: BackgroundPickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen
    const height = globals.viewportHeightPx
    const [selectedBackground, setSelectedBackground] = useState<string | null>("");

    /*     const getRemainingBackgroundPoints = (kindred: Kindred): number => {
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
    
            return 7 - totalBackgroundPoints
        } */

    const selectData = backgroundData.map((b) => ({
        value: `${b.name}`,
        label: `${b.name}`,
    }))

    const userBackgrounds = kindred.backgrounds; // Replace with the actual user's backgrounds
    const backgroundsToExclude = ["Contact", "Allies", "Haven", "Mask"];

    const filteredSelectData = selectData.filter((background) => {
        const backgroundName = background.value;

        // Check if there is no object in userBackgrounds with a matching name
        const isNotInUserBackgrounds = !userBackgrounds.some((bg) => bg.name === backgroundName);

        // Check if the backgroundName is in the exceptions list
        const isException = backgroundsToExclude.includes(backgroundName);

        // Keep the background if it's not in userBackgrounds or is an exception
        return isNotInUserBackgrounds || isException;
    });

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

    const handleBackgroundBuy = (selectedBackground: string) => {
        let newBackgroundRef = v5BackgroundRefs.find((b) => b.name === selectedBackground)
        if (!newBackgroundRef) { return }

        const newBackground = { ...newBackgroundRef, id: `${newBackgroundRef.id}-${Date.now()}}` }
        handleBackgroundChange(kindred, setKindred, newBackground, "creationPoints", 1)

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
                                    <Button
                                        color="gray"
                                        disabled={!selectedBackground}
                                        onClick={() => {
                                            handleBackgroundBuy(selectedBackground)
                                            setSelectedBackground("")
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

    const BackgroundInput = (backgroundRef: V5BackgroundRef) => {
        if (!backgroundRef) { return }

        return (
            <div>
                <NumberInput
                    value={backgroundRef.creationPoints}
                    min={backgroundRef.freebiePoints > 0 ? 0 : 1}
                    max={v5BackgroundLevel(backgroundRef).level === 3 ? backgroundRef.creationPoints : 3}
                    onChange={(val: number) => {
                        handleBackgroundChange(kindred, setKindred, backgroundRef, "creationPoints", val)
                    }}
                />
            </div>
        )
    }

    const sortedBackgrounds = kindred.backgrounds.sort((a, b) => a.id.localeCompare(b.id))

    const createdOwnedBackgroundAccordian = (bRef: V5BackgroundRef) => {
        const background = backgroundData.find((b) => b.name === bRef.name)
        if (!background) { return null }

        const getAdvantagePoints = (advantage: V5AdvantageRef) => {
            const advantageInfo = bRef.advantages.find((a) => a.name === advantage.name)
            const creation = advantageInfo ? advantageInfo.creationPoints : 0
            const freebie = advantageInfo ? advantageInfo.freebiePoints : 0
            return creation + freebie
        }

        return (
            <div>
                <Group>
                    <Table >
                        <thead>
                            <tr>
                                <th>{background.name}: {v5BackgroundLevel(bRef).level} {bRef.sphere}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>
                                    <Stack>
                                        <Text></Text>
                                        <Text>{bRef.sphere}</Text>
                                        {BackgroundInput(bRef)}
                                        {bRef.freebiePoints === 0 ?
                                            <Button
                                                color="gray"
                                                onClick={() => {
                                                    handleBackgroundRemove(kindred, setKindred, bRef)
                                                }}
                                            >Remove Merit</Button>
                                            :
                                            <></>
                                        }
                                    </Stack>
                                </td>
                                <td dangerouslySetInnerHTML={{ __html: `${background.description}` }}></td>
                                <td>
                                    {background.advantages && background.advantages.length > 0 ?
                                        <Accordion variant="contained">
                                            <Accordion.Item value={bRef.name}>
                                                <Accordion.Control>Advantages</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Table>
                                                        <tbody>
                                                            {background.advantages.map((advantage) => {
                                                                const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                                                                const advantageRef = bRef.advantages.find((a) => a.name === advantage.name) || { ...emptyAdvantage, name: advantage.name }
                                                                return (
                                                                    <>
                                                                        <tr>
                                                                            <td>
                                                                                <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(advantageRef).level}</Text>
                                                                                <NumberInput
                                                                                    value={getAdvantagePoints(advantageRef)}
                                                                                    min={advantageRef.freebiePoints}
                                                                                    max={advantage.cost[-1] - advantageRef.freebiePoints}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td dangerouslySetInnerHTML={{ __html: `${advantage.description}` }}></td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        </Accordion>
                                        :
                                        <></>}
                                </td>
                            </tr>

                        </tbody>
                    </Table>


                </Group>
            </div>
        )

    }

    /*     const getRemainingAdvantagePoints = (kindred: Kindred): number => {
            let totalFlawPoints = 0;
    
            Object.values(kindred.backgrounds).forEach((background) => {
                let backgroundInfo = backgroundData.find(entry => entry.name === background.name)
    
                Object.values(background.advantages).forEach((advantage) => {
                    let advantageInfo = backgroundInfo?.advantages?.find(entry => entry.name === advantage.name)
                    if (advantageInfo?.type === "advantage") {
                    } else {
                        totalFlawPoints += advantage.creationPoints
                    }
                })
            });
            return getRemainingBackgroundPoints(kindred) - totalFlawPoints 
        }*/


    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px' }}>
            <Stack>
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
                    />
                </Center>
                {getSelectedBackgroundData()}
                <Center>
                    <Stack>
                        {
                            sortedBackgrounds.map((bRef) => createdOwnedBackgroundAccordian(bRef))
                        }
                    </Stack>
                </Center>
                <ScrollArea h={height - 140} pb={20}>
                    <Center>

                    </Center>
                </ScrollArea>

                <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
                    <Group>
                        <Button.Group>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={backStep}
                            >
                                Back
                            </Button>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={nextStep}
                            >
                                Next
                            </Button>
                        </Button.Group>
                    </Group>
                </Alert>
            </Stack>
        </Center>
    )
}

export default BackgroundPicker