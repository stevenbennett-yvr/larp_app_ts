//Technical Imports
import { useEffect, useState, forwardRef } from 'react'
import { useMantineTheme, Accordion, Text, Group, Select, Table, Button, Input, Stack, TextInput, NumberInput } from '@mantine/core'
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened"
import { getMeritByName, Merit, meritRefs, MeritRef, getFilteredMerits, meritData, defineMeritRating, handleMeritChange, currentMeritLevel, handleXpMeritChange, findMaxMerit, getAtheniumFreebies, handleAtheniumPointChange, handleMeritRemove } from '../../../data/TatteredVeil/types/Merits'
import { globals } from '../../../assets/globals'

type MageMeritXpInputsProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void,
}

const MageMeritXpInputs = ({ awakened, setAwakened }: MageMeritXpInputsProps) => {
    const theme = useMantineTheme()

    const [buyableMerits, setBuyableMerits] = useState<Merit[]>(getFilteredMerits(awakened));
    const [selectedMerit, setSelectedMerit] = useState<string | null>("");
    const [showAllMerits, setShowAllMerits] = useState(false)

    useEffect(() => {
        setBuyableMerits(getFilteredMerits(awakened))
    }, [awakened])

    const meritInput = (buyableMerits: Merit[]) => {
        const customMeritOrder = ["Mental merits", "Physical merits", "Social merits", "Mage merits", "Sanctum merits"];
        const sortedMerits = buyableMerits.sort((a, b) => {
            // Compare the order of types defined in customMeritOrder
            const typeOrderA = customMeritOrder.indexOf(a.type);
            const typeOrderB = customMeritOrder.indexOf(b.type);
            // Sort by type order first, and then by name if the types are the same
            if (typeOrderA !== typeOrderB) {
                return typeOrderA - typeOrderB;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        const filteredMerits = sortedMerits.filter((merit) => {
            return merit.rating.includes("mult") || (!merit.description.includes("Character Creation only") && !awakened.merits.some((existingMerit) => existingMerit.name === merit.name))
        });

        const selectData = filteredMerits.map((merit) => ({
            value: `${merit.name}`,
            label: `${merit.name} ${merit.rating}`,
            bgc: `${merit.type === "Mental merits" ? theme.fn.rgba(theme.colors.blue[8], 0.90) : merit.type === "Physical merits" ? theme.fn.rgba(theme.colors.red[8], 0.90) : merit.type === "Social merits" ? theme.fn.rgba(theme.colors.grape[8], 0.90) : merit.type === "Mage merits" ? theme.fn.rgba(theme.colors.green[9], 0.90) : merit.type === "Sanctum merits" ? theme.fn.rgba(theme.colors.gray[6], 0.90) : ""}`
        }))


        const allSortedMerits = meritData.sort((a, b) => {
            // Compare the order of types defined in customMeritOrder
            const typeOrderA = customMeritOrder.indexOf(a.type);
            const typeOrderB = customMeritOrder.indexOf(b.type);
            // Sort by type order first, and then by name if the types are the same
            if (typeOrderA !== typeOrderB) {
                return typeOrderA - typeOrderB;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        const allFilteredMerits = allSortedMerits.filter((merit) => {
            return merit.rating.includes("mult") || (!merit.description.includes("Character Creation only") && !awakened.merits.some((existingMerit) => existingMerit.name === merit.name))
        });

        const allSelectData = allFilteredMerits.map((merit) => ({
            value: `${merit.name}`,
            label: `${merit.name} ${merit.rating}`,
            bgc: `${merit.type === "Mental merits" ? theme.fn.rgba(theme.colors.blue[8], 0.90) : merit.type === "Physical merits" ? theme.fn.rgba(theme.colors.red[8], 0.90) : merit.type === "Social merits" ? theme.fn.rgba(theme.colors.grape[8], 0.90) : merit.type === "Mage merits" ? theme.fn.rgba(theme.colors.green[9], 0.90) : merit.type === "Sanctum merits" ? theme.fn.rgba(theme.colors.gray[6], 0.90) : ""}`
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

        const atheneumSection = (awakened: Awakened) => {
            const athenaeumMerit = awakened.merits.find((merit) => merit.name === 'Athenaeum');
            const scriptMerit = awakened.merits.find((merit) => merit.name === 'Scriptorium');
            const labMerit = awakened.merits.find((merit) => merit.name === 'Alchemical Lab');
            const libMerit = awakened.merits.find((merit) => merit.name === 'Library');

            if (!athenaeumMerit) { return null }
            else {
                const athenaeumLevel = currentMeritLevel(athenaeumMerit).level
                const athenaeumPoints = athenaeumLevel * 2;
                const disabledValue = (athenaeumLevel * 2) -
                    (scriptMerit ? scriptMerit.freebiePoints : 0) -
                    (labMerit ? labMerit.freebiePoints : 0) -
                    (libMerit ? libMerit.freebiePoints : 0);
                return (
                    <Accordion.Item value="Athenaeum" key="Athenaeum">
                        <Accordion.Control style={{ color: "white", backgroundColor: "#DAA520" }}>ATHENAEUM SELECT: POINTS {disabledValue}/{athenaeumPoints}</Accordion.Control>
                        <Accordion.Panel>
                            {allSortedMerits.map((merit) => {
                                if (
                                    merit.name === "Library" ||
                                    merit.name === "Alchemical Lab" ||
                                    merit.name === "Scriptorium"
                                ) {
                                    const modifiedMeritId = `${merit.id}-${awakened.merits.find((merit) => merit.name === 'Athenaeum')?.id}`;
                                    let meritRef = meritRefs.find((m) => m.name === merit.name) as MeritRef;

                                    if (!meritRef) {
                                        throw new Error(`MeritRef not found for ${merit.name}`);
                                    }

                                    return (
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: "150px" }}>
                                                        <Text align='center'>{merit.name} {merit.rating}</Text>
                                                        <Group grow spacing='xl'>
                                                            <Group key={`${merit.id} group`}>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <NumberInput
                                                                        style={{ width: '60px', margin: '0 8px' }}
                                                                        type="number"
                                                                        key={`${merit.id} input`}
                                                                        min={0}
                                                                        max={5}
                                                                        disabled={disabledValue === 0}
                                                                        value={getAtheniumFreebies(awakened, modifiedMeritId)}
                                                                        onChange={(event) => {
                                                                            let val = Number(event);
                                                                            handleAtheniumPointChange(val, meritRef, modifiedMeritId, awakened, setAwakened);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Group>
                                                        </Group>
                                                        <Text align='center'>{merit.prerequisites ? `PreReq: ${merit.prerequisites}` : ''}</Text>

                                                    </td>
                                                    <td>
                                                        <td dangerouslySetInnerHTML={{ __html: `${merit.description}` }} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    );
                                } else {
                                    return null; // Return null for merits you want to skip rendering
                                }
                            })}
                        </Accordion.Panel>
                    </Accordion.Item>)
            }
        }



        const handleMeritBuy = (meritData: Merit) => {
            let { minCost, orBool, orToBool } = defineMeritRating(meritData.rating)

            let cost = 0
            if (orBool || orToBool) {
                cost = minCost * 2
            }
            else {
                for (let i = 0; i < minCost + 1; i++) {
                    cost = cost + (i * 2)
                }
            }

            let newMeritRef = meritRefs.find((m) => m.name === meritData.name)
            if (!newMeritRef) { return }

            const newMerit = { ...newMeritRef, id: `${meritData.id}-${Date.now()}` };
            handleMeritChange(awakened, setAwakened, newMerit, "experiencePoints", cost)
            setSelectedMerit("");

        }

        const getSelectedMeritData = () => {
            if (selectedMerit) {
                const selectedMeritData = meritData.find((merit) => merit.name === selectedMerit);
                if (selectedMeritData) {
                    return (
                        <>
                            {globals.isPhoneScreen ?
                                <Table key={'selectedMerit phonescreen'}>
                                    <tbody>
                                        <tr>
                                            <td style={{ minWidth: "150px", backgroundColor: `${selectedMeritData.type === "Mental merits" ? theme.fn.rgba(theme.colors.blue[8], 0.90) : selectedMeritData.type === "Physical merits" ? theme.fn.rgba(theme.colors.red[8], 0.90) : selectedMeritData.type === "Social merits" ? theme.fn.rgba(theme.colors.grape[8], 0.90) : selectedMeritData.type === "Mage merits" ? theme.fn.rgba(theme.colors.green[9], 0.90) : selectedMeritData.type === "Sanctum merits" ? theme.fn.rgba(theme.colors.gray[6], 0.90) : ""}` }}>
                                                <Stack>
                                                    <Text align='center' style={{ color: "white" }}>{selectedMeritData.name} {selectedMeritData.rating}</Text>
                                                    <Text align='center' style={{ color: "white" }}>{selectedMeritData.prerequisites ? `PreReq: ${selectedMeritData.prerequisites}` : ''}</Text>
                                                    <Button
                                                        color="gray"
                                                        disabled={!selectedMerit || !buyableMerits.some(merit => merit.name === selectedMerit)}
                                                        onClick={() => {
                                                            handleMeritBuy(selectedMeritData)
                                                        }}>Buy</Button>
                                                </Stack>
                                            </td></tr>
                                        <tr>
                                            <td dangerouslySetInnerHTML={{ __html: `${selectedMeritData.description}` }} />
                                        </tr>

                                    </tbody>
                                </Table>
                                :
                                <Table key={'selectedMerit desktop'}>
                                    <thead>
                                        <tr>
                                            <th>Merit</th>
                                            <th>Description</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    minWidth: "150px",
                                                    backgroundColor: selectedMeritData.type === "Mental merits" ? theme.fn.rgba(theme.colors.blue[8], 0.90) :
                                                        selectedMeritData.type === "Physical merits" ? theme.fn.rgba(theme.colors.red[8], 0.90) :
                                                            selectedMeritData.type === "Social merits" ? theme.fn.rgba(theme.colors.grape[8], 0.90) :
                                                                selectedMeritData.type === "Mage merits" ? theme.fn.rgba(theme.colors.green[9], 0.90) :
                                                                    selectedMeritData.type === "Sanctum merits" ? theme.fn.rgba(theme.colors.gray[6], 0.90) :
                                                                        ""
                                                }}>
                                                <Text color="white">{selectedMeritData.name}</Text>
                                                <Text color="white">{selectedMeritData.rating}</Text>
                                                <Text color="white">{selectedMeritData.prerequisites ? `PreReq: ${selectedMeritData.prerequisites}` : ''}</Text>
                                                <Button
                                                    color="gray"
                                                    disabled={!selectedMerit || !buyableMerits.some(merit => merit.name === selectedMerit)}
                                                    onClick={() => {
                                                        handleMeritBuy(selectedMeritData)
                                                    }}>Buy</Button>                         </td>
                                            <td dangerouslySetInnerHTML={{ __html: `${selectedMeritData.description}` }} />
                                        </tr>
                                    </tbody>
                                </Table>
                            }


                        </>
                    )
                }
            }
            return null;
        }

        const meritTypesSet = new Set(Object.values(awakened.merits).map((merit) => getMeritByName(merit.name).type))
        const meritTypes = Array.from(meritTypesSet)
        meritTypes.sort((a, b) => {
            // Compare the order of types defined in customMeritOrder
            const typeOrderA = customMeritOrder.indexOf(a);
            const typeOrderB = customMeritOrder.indexOf(b);
            // Sort by type order first, and then by name if the types are the same
            if (typeOrderA !== typeOrderB) {
                return typeOrderA - typeOrderB;
            } else {
                return a.localeCompare(b);
            }
        });


        const createOwnedMeritAccordian = (type: string, key: string) => {
            let bgc = ""
            switch (type) {
                case "Mental merits":
                    bgc = theme.fn.rgba(theme.colors.blue[8], 0.90)
                    break;
                case "Physical merits":
                    bgc = theme.fn.rgba(theme.colors.red[8], 0.90)
                    break;
                case "Social merits":
                    bgc = theme.fn.rgba(theme.colors.grape[8], 0.90)
                    break;
                case "Mage merits":
                    bgc = theme.fn.rgba(theme.colors.green[9], 0.90)
                    break;
                case "Sanctum merits":
                    bgc = theme.fn.rgba(theme.colors.gray[6], 0.90)
                    break;
            }


            const sortedMerits = awakened.merits.filter((merit) => getMeritByName(merit.name).type.toLowerCase() === type.toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))

            return (
                <Accordion.Item value={type} key={key}>
                    <Accordion.Control style={{ color: "white", backgroundColor: bgc }}>{type.toUpperCase()}</Accordion.Control>
                    <Accordion.Panel>

                        {globals.isPhoneScreen ?
                            sortedMerits.map((meritRef) => {
                                const merit = getMeritByName(meritRef.name)
                                return (
                                    <Table key={`${meritRef.id} phoneScreen`}>
                                        <tbody>
                                            <tr>
                                                <td style={{ minWidth: "150px" }}>
                                                    <Text align='center'>{merit.name} {merit.rating}</Text>
                                                    <Text align='center'>{merit.prerequisites ? `PreReq: ${merit.prerequisites}` : ''}</Text>
                                                    {merit.name === "Status (Consilium)" || merit.name === "Status (Order)" ? <></> :
                                                        <Group grow spacing='xl'>
                                                            <Group key={`${merit.id} group`}>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Button
                                                                        size="xs"
                                                                        variant='outline'
                                                                        color='gray'
                                                                        onClick={() => handleXpMeritChange(awakened, setAwakened, meritRef, meritRef.experiencePoints - 1)}
                                                                    >
                                                                        -
                                                                    </Button>
                                                                    <Input
                                                                        style={{ width: '60px', margin: '0 8px' }}
                                                                        type="number"
                                                                        key={`${merit.id} input`}
                                                                        min={0}
                                                                        max={findMaxMerit(meritRef)}
                                                                        value={meritRef.experiencePoints}
                                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                            const value = Number(e.target.value);
                                                                            handleXpMeritChange(awakened, setAwakened, meritRef, value);
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        size="xs"
                                                                        variant='outline'
                                                                        color='gray'
                                                                        disabled={findMaxMerit(meritRef) === meritRef.experiencePoints}
                                                                        onClick={() => handleXpMeritChange(awakened, setAwakened, meritRef, meritRef.experiencePoints + 1)}
                                                                    >
                                                                        +
                                                                    </Button>
                                                                </div>
                                                            </Group>
                                                            {meritRef.creationPoints === 0 && meritRef.freebiePoints === 0 ?
                                                                <Button
                                                                    onClick={() => {
                                                                        handleMeritRemove(awakened, setAwakened, meritRef)
                                                                    }}
                                                                >Remove Merit</Button>
                                                                :
                                                                <></>
                                                            }
                                                        </Group>
                                                    }
                                                </td></tr>
                                            <tr key={`${merit.name} ${merit.type}`}>
                                                <td dangerouslySetInnerHTML={{ __html: `${merit.description}` }} />
                                            </tr>
                                        </tbody>
                                    </Table>
                                )
                            })
                            :
                            <Table key={`desktopDisplay`}>
                                <thead>
                                    <tr>
                                        <th>Merit</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedMerits.map((meritRef) => {
                                        const merit = getMeritByName(meritRef.name)
                                        return (
                                            <tr key={`${merit.name} ${merit.type}`} id={`${merit.name} ${merit.type}`}>
                                                <td style={{ minWidth: "150px" }}>
                                                    <Text>{merit.name} {currentMeritLevel(meritRef).level}</Text>
                                                    <Text>{merit.rating}</Text>
                                                    <Text>{merit.prerequisites ? `PreReq: ${merit.prerequisites}` : ''}</Text>
                                                    {merit.name === "Status (Consilium)" || merit.name === "Status (Order)" ? <></> :
                                                        <Group key={`${merit.name} input`}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Button
                                                                    size="xs"
                                                                    variant='outline'
                                                                    color='gray'
                                                                    onClick={() => handleXpMeritChange(awakened, setAwakened, meritRef, meritRef.experiencePoints - 1)}
                                                                >
                                                                    -
                                                                </Button>
                                                                <Input
                                                                    style={{ width: '60px', margin: '0 8px' }}
                                                                    type="number"
                                                                    key={`${merit.name}`}
                                                                    min={0}
                                                                    max={findMaxMerit(meritRef)}
                                                                    value={meritRef.experiencePoints}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                        const value = Number(e.target.value);
                                                                        handleXpMeritChange(awakened, setAwakened, meritRef, value);
                                                                    }}
                                                                />
                                                                <Button
                                                                    size="xs"
                                                                    variant='outline'
                                                                    color='gray'
                                                                    disabled={findMaxMerit(meritRef) === meritRef.experiencePoints}
                                                                    onClick={() => handleXpMeritChange(awakened, setAwakened, meritRef, meritRef.experiencePoints + 1)}
                                                                >
                                                                    +
                                                                </Button>
                                                            </div>
                                                        </Group>
                                                    }

                                                    {meritRef.creationPoints === 0 && meritRef.freebiePoints === 0 ?
                                                        <Button
                                                            onClick={() => {
                                                                handleMeritRemove(awakened, setAwakened, meritRef)
                                                            }}
                                                        >Remove Merit</Button>
                                                        :
                                                        <></>
                                                    }
                                                </td>
                                                <td dangerouslySetInnerHTML={{ __html: `${merit.description}` }} />
                                                <td>
                                                    <TextInput
                                                        value={meritRef.note ? meritRef.note : ""}
                                                        onChange={(event) =>
                                                            handleMeritChange(awakened, setAwakened, meritRef, "note", event.target.value)
                                                        }
                                                        label="Merit Notes"
                                                    />
                                                </td>
                                            </tr>
                                        )

                                    })}
                                </tbody>
                            </Table>
                        }
                    </Accordion.Panel>
                </Accordion.Item>
            )
        }

        return (
            <div>
                <Group>
                    <Button
                        color="gray"
                        style={{ margin: "5px" }}
                        onClick={() => setShowAllMerits((prevShowAllMerits) => !prevShowAllMerits)}
                    >
                        {showAllMerits ? "Hide All" : "Show All"}
                    </Button>
                    <Select
                        data={showAllMerits ? allSelectData : selectData}
                        value={selectedMerit}
                        onChange={(val) => setSelectedMerit(val)}
                        placeholder="Select Merit to Buy"
                        itemComponent={SelectItem}
                        searchable
                        allowDeselect
                        style={{ width: '70%' }}
                    />
                </Group>
                {getSelectedMeritData()}
                <Text>Owned Merits</Text>
                <Accordion>
                    {
                        (meritTypes).map((a) => createOwnedMeritAccordian(a, a))
                    }
                    {atheneumSection(awakened)}
                </Accordion>
            </div>
        )
    }

    return (
        <>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Merits</Text>
            <hr style={{ width: "50%" }} />
            {meritInput(buyableMerits)}
        </>
    )
}

export default MageMeritXpInputs