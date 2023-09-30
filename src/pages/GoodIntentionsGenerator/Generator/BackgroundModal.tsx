import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Modal, NumberInput, Accordion, Text, Button, Group, Table, Center, Stack, TextInput } from "@mantine/core"
import Tally from "../../../utils/talley"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { handleAdvantageChange, emptyAdvantage, handleBackgroundRemove, V5AdvantageRef, V5BackgroundRef, v5BackgroundLevel, handleBackgroundChange, backgroundData } from "../../../data/GoodIntentions/types/V5Backgrounds"

type BackgroundModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    bId: string,
    modalOpened: boolean,
    closeModal: () => void
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

const BackgroundModal = ({ kindred, setKindred, bId, modalOpened, closeModal }: BackgroundModalProps) => {

    const bRef = kindred.backgrounds.find((entry) => entry.id === bId)
    if (!bRef) { return null }
    const backgroundInfo = backgroundData.find((entry) => entry.name === bRef.name)
    if (!backgroundInfo) { return null }

    const BackgroundInput = (backgroundRef: V5BackgroundRef) => {
        if (!backgroundRef) { return }

        return (
            <Center>
                <Stack>
                    <Center>
                        <NumberInput
                            value={backgroundRef.creationPoints}
                            min={backgroundRef.freebiePoints > 0 ? 0 : 1}
                            max={v5BackgroundLevel(backgroundRef).level === 3 ? backgroundRef.creationPoints : 3}
                            onChange={(val: number) => {
                                handleBackgroundChange(kindred, setKindred, backgroundRef, "creationPoints", val)
                            }}
                            style={{ width: "100px" }}
                        />
                    </Center>
                    <TextInput
                        radius="xs"
                        label="Notes"
                        value={backgroundRef.note}
                        description="Provide additional details you think necessary"
                        onChange={(event) => {
                            handleBackgroundChange(kindred, setKindred, backgroundRef, "note", event.target.value)
                        }}
                    />
                </Stack>
            </Center>
        )
    }

    const getAdvantagePoints = (advantage: V5AdvantageRef) => {
        const advantageInfo = bRef.advantages.find((a) => a.name === advantage.name)
        const creation = advantageInfo ? advantageInfo.creationPoints : 0
        const freebie = advantageInfo ? advantageInfo.freebiePoints : 0
        return creation + freebie
    }

    return (
        <Modal
            opened={modalOpened}
            onClose={closeModal}
            size={600}
        >
            <Stack>
                <Text fz={"30px"} ta={"center"}>{backgroundInfo.name}: {v5BackgroundLevel(bRef).level} {bRef.sphere}</Text>

                {BackgroundInput(bRef)}
                {bRef.freebiePoints === 0 ?
                    <Button
                        color="gray"
                        onClick={() => {
                            handleBackgroundRemove(kindred, setKindred, bRef)
                        }}
                    >Remove Background</Button>
                    :
                    <></>
                }
                <Text size="sm" color="dimmed" dangerouslySetInnerHTML={{ __html: `${backgroundInfo.description}` }}></Text>
                {backgroundInfo.advantages && backgroundInfo.advantages.length > 0 ?
                    <Accordion variant="contained">
                        <Accordion.Item value={bRef.name}>
                            <Accordion.Control>Advantages</Accordion.Control>
                            <Accordion.Panel>
                                <Table>
                                    <tbody>
                                        {backgroundInfo.advantages.map((advantage) => {
                                            const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                                            const advantageRef = bRef.advantages.find((a) => a.name === advantage.name) || { ...emptyAdvantage, name: advantage.name }
                                            return (
                                                <>
                                                    <tr>
                                                        <td>
                                                            <Text align="center">{icon} &nbsp;{advantage.name} {getAdvantagePoints(advantageRef)}</Text>
                                                            <Center>
                                                                {getRating(advantage.cost)}
                                                            </Center>
                                                            <Center>
                                                                <NumberInput
                                                                    value={advantageRef.creationPoints}
                                                                    style={{ width: "100px" }}
                                                                    min={0}
                                                                    max={getAdvantagePoints(advantageRef) === advantage.cost[advantage.cost.length - 1] ? advantageRef.creationPoints : advantage.cost[advantage.cost.length - 1]}
                                                                    onChange={(val) => {
                                                                        handleAdvantageChange(kindred, setKindred, bRef, advantageRef, "creationPoints", val)
                                                                    }}
                                                                />
                                                            </Center>
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
            </Stack>

        </Modal>
    )

}

export default BackgroundModal