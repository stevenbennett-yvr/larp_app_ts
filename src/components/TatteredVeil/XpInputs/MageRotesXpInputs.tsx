import { useState, useEffect } from 'react'
import { Text, Group, Avatar, Table, Image, Button, Accordion, Select, Stack } from '@mantine/core'
import { forwardRef } from 'react'
//Asset Imports
import { globals } from '../../../assets/globals'
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened"
import { removeRote, roteData, getFilteredRotes, Rote, getRoteByName, RoteRef, roteRefs } from '../../../data/TatteredVeil/types/Rotes'
import { arcanaDescriptions, ArcanaKey, currentArcanumLevel } from '../../../data/TatteredVeil/types/Arcanum'
import { handleRoteChange, calculatePool } from '../../../data/TatteredVeil/types/Rotes'

type MageRotesXpInputsProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void,
}

const MageRotesXpInputs = ({ awakened, setAwakened }: MageRotesXpInputsProps) => {

    const [learnableRotes, setLearnableRotes] = useState<Rote[]>(getFilteredRotes(awakened));
    const [selectedRote, setSelectedRote] = useState<string | null>("");
    const [showAllRotes, setShowAllRotes] = useState(false)

    useEffect(() => {
        setLearnableRotes(getFilteredRotes(awakened))
    }, [awakened])

    const roteInputs = (learnableRotes: Rote[]) => {
        const sortedRotes = learnableRotes.sort((a, b) => {
            const arcanumComparison = a.arcanum.localeCompare(b.arcanum);
            if (arcanumComparison !== 0) {
                return arcanumComparison;
            }
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        });

        // Filter out the rotes that also appear in awakened.rotes
        const filteredRotes = sortedRotes.filter((rote) => {
            return !awakened.rotes.some((existingRote) => existingRote.name === rote.name);
        });

        const allRotes = roteData.sort((a, b) => {
            const arcanumComparison = a.arcanum.localeCompare(b.arcanum);
            if (arcanumComparison !== 0) {
                return arcanumComparison;
            }
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        })

        const allFilteredRotes = allRotes.filter((rote) => {
            return !awakened.rotes.some((existingRote) => existingRote.name === rote.name);
        });

        const selectData = filteredRotes.map((rote) => ({
            value: `${rote.name}`,
            label: `${rote.arcanum} ${rote.level} - ${rote.name}`,
            image: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}`,
            bgc: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey]?.color}`
        }));

        const allData = allFilteredRotes.map((rote) => ({
            value: `${rote.name}`,
            label: `${rote.arcanum} ${rote.level} - ${rote.name}`,
            image: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}`,
            bgc: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey]?.color}`
        }));

        interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
            image: string;
            label: string;
            bgc: string;
        }


        const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
            ({ image, label, bgc, ...others }: ItemProps, ref) => (
                <div ref={ref} {...others} style={{ backgroundColor: bgc, border: '1px solid white' }}>
                    <Group noWrap>
                        <Avatar size={'sm'} src={image} />
                        <div>
                            <Text size="sm" color="white">{label}</Text>
                        </div>
                    </Group>
                </div>
            )
        );

        const getSelectedRoteData = () => {
            if (selectedRote) {
                // Find the rote in the sortedRotes array that matches the selectedRote
                const selectedRoteData = roteData.find((rote) => rote.name === selectedRote);
                if (selectedRoteData) {
                    const selectedRoteRef = roteRefs.find((r) => r.name === selectedRoteData.name)
                    if (!selectedRoteRef) { return }
                    return (
                        <>
                            {globals.isPhoneScreen ? (
                                <Table>
                                    <tbody>

                                        <tr>
                                            <td style={{ backgroundColor: arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>
                                                <Group grow>
                                                    <Stack spacing="xs" align="flex-start">
                                                        <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{selectedRoteData.name}</Text>
                                                        <Image
                                                            fit="contain"
                                                            withPlaceholder
                                                            src={arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey].logo}
                                                            height={30}
                                                            width={30}
                                                            alt="order"
                                                            style={{ filter: "brightness(0)" }}
                                                        />
                                                        <p style={{ color: "white" }}>{selectedRoteData.arcanum} {selectedRoteData.level} {selectedRoteData.otherArcana ? `+ ${selectedRoteData.otherArcana}` : ""}</p>
                                                        <i style={{ color: "white" }}>{selectedRoteData.source}</i>
                                                    </Stack>

                                                    <Button
                                                        color="gray"
                                                        disabled={!selectedRote || !learnableRotes.some(rote => rote.name === selectedRote)}
                                                        onClick={() => {
                                                            let xpCost = selectedRoteData.level * 2;
                                                            handleRoteChange(awakened, setAwakened, selectedRoteRef, "experiencePoints", xpCost)
                                                            setSelectedRote("")
                                                        }}>Buy</Button>
                                                </Group>
                                            </td>
                                        </tr>
                                        <tr key={`${selectedRoteData.name} ${selectedRoteData.arcanum} phone`}>

                                            <td dangerouslySetInnerHTML={{ __html: `${selectedRoteData.description} <p>Rote Pool: ${selectedRoteData.rotePool}  (${calculatePool(selectedRoteData.rotePool, awakened)})</p>` }} />
                                        </tr>
                                    </tbody>
                                </Table>
                            ) : (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Rote</th>
                                            <th>Description</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={`${selectedRoteData.name} ${selectedRoteData.arcanum} desktop`}>
                                            <td style={{ backgroundColor: arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey]?.color ?? "white", minWidth: "150px" }}>
                                                <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{selectedRoteData.name}</Text>
                                                <Image
                                                    fit="contain"
                                                    withPlaceholder
                                                    src={arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey].logo}
                                                    height={30}
                                                    width={30}
                                                    alt="order"
                                                    style={{ filter: "brightness(0)" }}
                                                />
                                                <p style={{ color: "white" }}>{selectedRoteData.arcanum} {selectedRoteData.level} {selectedRoteData.otherArcana ? `+ ${selectedRoteData.otherArcana}` : ""}</p>
                                                <i style={{ color: "white" }}>{selectedRoteData.source}</i>
                                            </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${selectedRoteData.description} <p>Rote Pool: ${selectedRoteData.rotePool}  (${calculatePool(selectedRoteData.rotePool, awakened)})</p>` }} />
                                            <td>
                                                <Button
                                                    color="gray"
                                                    disabled={!selectedRote || !learnableRotes.some(rote => rote.name === selectedRote)}
                                                    onClick={() => {
                                                        let xpCost = selectedRoteData.level * 2;
                                                        handleRoteChange(awakened, setAwakened, selectedRoteRef, "experiencePoints", xpCost)
                                                        setSelectedRote("")
                                                    }}>Buy</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                            )}
                        </>
                    );
                }
            }
            return null;
        };

        const roteArcanaSet = new Set(Object.values(awakened.rotes).map((rote) => getRoteByName(rote.name).arcanum));
        const roteArcana = Array.from(roteArcanaSet);
        roteArcana.sort()
        let isRoteOutOfOrder = (roteRef: RoteRef) => {
            let rote = getRoteByName(roteRef.name)
            return rote.level > currentArcanumLevel(awakened, rote.arcanum.toLowerCase() as ArcanaKey).level
        }
        const knownCreateRoteAccordian = (arcanum: ArcanaKey) => {
            const knownRotes = awakened.rotes.filter((rote) => getRoteByName(rote.name).arcanum.toLowerCase() === arcanum.toLowerCase())

            knownRotes.sort((a, b) => {
                if (getRoteByName(a.name).level !== getRoteByName(b.name).level) {
                    return getRoteByName(a.name).level - getRoteByName(b.name).level;
                }
                return a.name.localeCompare(b.name);
            });

            let anyRoteOutOfOrder = knownRotes.some(
                (rote) => isRoteOutOfOrder(rote)
            );

            return (
                <div key={arcanum}>
                    <Accordion.Item value={arcanum}>
                        <Accordion.Control icon={<Image height={20} width={20} src={arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey].logo} />} style={{ color: "white", border: anyRoteOutOfOrder ? '2px solid red' : 'none', backgroundColor: arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>{arcanum.toUpperCase()} {anyRoteOutOfOrder ? "⚠️" : ""}</Accordion.Control>
                        <Accordion.Panel>
                            {globals.isPhoneScreen ?
                                <Table>
                                    <tbody>
                                        {knownRotes.map((roteRef) => {
                                            const rote = getRoteByName(roteRef.name)

                                            return (
                                                <>
                                                    <tr>
                                                        <td style={{ backgroundColor: arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>
                                                            <Group grow>
                                                                <Stack spacing="xs" align="flex-start">
                                                                    <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{rote.name}</Text>
                                                                    <Image
                                                                        fit="contain"
                                                                        withPlaceholder
                                                                        src={arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}
                                                                        height={30}
                                                                        width={30}
                                                                        alt="order"
                                                                        style={{ filter: "brightness(0)" }}
                                                                    />
                                                                    <p style={{ color: "white" }}>{rote.arcanum} {rote.level} {rote.otherArcana ? `+ ${rote.otherArcana}` : ""}</p>
                                                                    <i style={{ color: "white" }}>{rote.source}</i>
                                                                </Stack>
                                                                {roteRef.experiencePoints > 0 ?
                                                                    <Button color="gray" onClick={() => {
                                                                        removeRote(awakened, setAwakened, roteRef)
                                                                    }}>Remove</Button>
                                                                    :
                                                                    <></>
                                                                }
                                                            </Group>
                                                        </td>
                                                    </tr>
                                                    <tr key={`${rote.name} ${rote.arcanum} phone`}>
                                                        <td dangerouslySetInnerHTML={{ __html: `${rote.description} <p>Rote Pool: ${rote.rotePool}  (${calculatePool(rote.rotePool, awakened)})</p>` }} />
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                :
                                <Table>
                                    <thead>
                                        <tr>
                                            <td>Rote</td>
                                            <td>Description</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {knownRotes.map((roteRef) => {
                                            const rote = getRoteByName(roteRef.name)
                                            return (
                                                <tr key={`${rote.name} ${rote.arcanum}`} style={{ border: isRoteOutOfOrder(roteRef) ? '2px solid red' : 'none' }}>
                                                    <td style={{ backgroundColor: arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>
                                                        <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{rote.name} {isRoteOutOfOrder(roteRef) ? "⚠️" : ""}</Text>
                                                        <Image
                                                            fit="contain"
                                                            withPlaceholder
                                                            src={arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}
                                                            height={30}
                                                            width={30}
                                                            alt="order"
                                                            style={{ filter: "brightness(0)" }}
                                                        />
                                                        <p style={{ color: "white" }}>{rote.arcanum} {rote.level} {rote.otherArcana ? `+ ${rote.otherArcana}` : ""}</p>
                                                        <i style={{ color: "white" }}>{rote.source}</i>
                                                        {roteRef.experiencePoints > 0 ?
                                                            <Button color="gray" onClick={() => {
                                                                handleRoteChange(awakened, setAwakened, roteRef, "experiencePoints", 0)
                                                            }}>Remove</Button>
                                                            :
                                                            <></>
                                                        }
                                                    </td>
                                                    <td dangerouslySetInnerHTML={{ __html: `${rote.description} <p>Rote Pool: ${rote.rotePool} ${calculatePool(rote.rotePool, awakened)}</p>` }} />
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            }
                        </Accordion.Panel>
                    </Accordion.Item>
                </div>
            )
        }
        return (
            <div>
                <Group>
                    <Button
                        color="gray"
                        style={{ margin: "5px" }}
                        onClick={() => setShowAllRotes((prevShowAllRotes) => !prevShowAllRotes)}
                    >
                        {showAllRotes ? "Hide All" : "Show All"}
                    </Button>

                    <Select
                        data={showAllRotes ? allData : selectData}
                        value={selectedRote}
                        onChange={(val) => setSelectedRote(val)}
                        placeholder="Select Rote to Buy"
                        itemComponent={SelectItem}
                        searchable
                        allowDeselect
                        style={{ width: '70%' }}
                    />
                </Group>
                {getSelectedRoteData()}

                <Text>Known Rotes</Text>
                <Accordion>
                    {
                        (roteArcana as ArcanaKey[]).map((a) => knownCreateRoteAccordian(a))
                    }
                </Accordion>
            </div>
        );
    };

    return (
        <>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Rotes</Text>
            <hr style={{ width: "50%" }} />
            {roteInputs(learnableRotes)}
        </>
    )
}

export default MageRotesXpInputs