import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { v5BackgroundLevel, V5BackgroundRef, SphereSelectData, V5Background, V5SphereKey, backgroundData, filterSelectData, v5BackgroundRefs, handleBackgroundChange } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { globals } from "../../../assets/globals";
import { useState, forwardRef } from "react";
import { Space, Group, Text, Table, Select, Button, Grid, Card, Center, Stack } from "@mantine/core";
import V5AdvantageXpInputs from "./V5AdvantageXpInputs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup, faCat, faAddressBook, faFaceGrinStars, faHouseChimney, faCow, faMasksTheater, faCoins } from "@fortawesome/free-solid-svg-icons"
import { v5xp } from "../../../data/GoodIntentions/V5Experience";

type v5BackgroundXpInputProps = {
    kindred: Kindred,
    setKindred: (kindred:Kindred) => void
}

const V5BackgroundXpInput = ({ kindred, setKindred }:v5BackgroundXpInputProps) => {

    const [selectedBackground, setSelectedBackground] = useState<string | null>("");
    const [selectedSphere, setSelectedSphere] = useState<V5SphereKey | null>("");

    const [modalBackground, setModalBackground] = useState<string>("")
    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setModalBackground("");
        setModalOpen(false);
    };
    
    const getIcon = (name:string) => {
        if (name === "Allies") {
            return faUserGroup
        }
        if (name === "Familiar") {
            return faCat
        }
        if (name === "Contacts") {
            return faAddressBook
        }
        if (name === "Fame") {
            return faFaceGrinStars
        }
        if (name === "Haven") {
            return faHouseChimney
        }
        if (name === "Herd") {
            return faCow
        }
        if (name === "Mask") {
            return faMasksTheater
        }
        if (name === "Resources") {
            return faCoins
        }
    }

    const filterData = filterSelectData(kindred, backgroundData)

    const selectData = filterData.map((b:V5Background) => ({
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

    const handleBackgroundBuy = (selectedBackground: string) => {
        let newBackgroundRef = v5BackgroundRefs.find((b) => b.name === selectedBackground)
        if (!newBackgroundRef) { return }

        let newBackground = { ...newBackgroundRef, id: `${newBackgroundRef.id}-${Date.now()}}`, advantages: [] }
        if ((selectedBackground === 'Allies' || selectedBackground === 'Contacts') && selectedSphere) {
            console.log(selectedSphere)
            newBackground = { ...newBackground, sphere: [selectedSphere] }
        }
        handleBackgroundChange(kindred, setKindred, newBackground, "experiencePoints", v5xp.background)
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
                                            handleBackgroundBuy(selectedBackground)
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

    const createBackgroundPick = (bRef: V5BackgroundRef) => {
        const backgroundInfo = backgroundData.find((entry) => entry.name === bRef.name)
        const icon = getIcon(bRef.name)
        if (!backgroundInfo || !icon) {return null}
        return (
            <Grid.Col key={bRef.name} span={4}>
                <Card className="hoverCard" shadow="sm" padding="lg" radius="md" h={200} style={{ cursor: "pointer" }}
                    onClick={() => {
                        setModalBackground(bRef.id);
                        setModalOpen(true);
                    }}
                >
                    <Center pt={10}>
                        <FontAwesomeIcon size="4x"  icon={icon} style={{ color: "#e03131" }} />
                    </Center>

                    <Center>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>{bRef.name} Level {v5BackgroundLevel(bRef).level} {bRef.sphere}</Text>

                    </Center>

                    <Text h={55} size="sm" color="dimmed" ta="center">
                        {backgroundInfo?.summary}
                    </Text>
                </Card>
            </Grid.Col>
        )
    }

    const sortedBackgrounds = kindred.backgrounds.sort((a, b) => a.id.localeCompare(b.id))

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">
                <Text fz={"30px"} ta={"center"}>Select <b>Backgrounds</b></Text>

                <V5AdvantageXpInputs kindred={kindred} setKindred={setKindred} bId={modalBackground} modalOpened={modalOpen} closeModal={handleCloseModal} />

                    <Center>
                    <Select
                        data={selectData}
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


                    <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Owned Backgrounds</Text>

                    <Space h={"sm"} />
                    <Grid grow m={0}>
                        {
                            sortedBackgrounds.map((bRef) => createBackgroundPick(bRef))
                        }
                    </Grid>
            </Stack>
        </Center>
    )

}

export default V5BackgroundXpInput