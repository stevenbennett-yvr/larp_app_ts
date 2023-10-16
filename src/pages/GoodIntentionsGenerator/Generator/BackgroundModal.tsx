import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Checkbox, CheckboxProps, Modal, NumberInput, Accordion, Text, Button, Group, Table, Center, Stack, TextInput } from "@mantine/core"
import Tally from "../../../utils/talley"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { v5AdvantageLevel, handleAdvantageChange, emptyAdvantage, handleBackgroundRemove, V5AdvantageRef, V5BackgroundRef, v5BackgroundLevel, handleBackgroundChange, backgroundData, V5Background } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { Droplet } from 'tabler-icons-react';

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

const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, ...others }) =>
    indeterminate ? <Droplet {...others} /> : <Droplet {...others} />;


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

    const resourcesRef = kindred.backgrounds.find((entry => entry.name === "Resources"))
    const resourceLevel = resourcesRef ? v5BackgroundLevel(resourcesRef).level : 0;
    const havenMax = bRef.id==="farmer-haven" ? Math.max(resourceLevel, 2): resourceLevel === 3 ? 3 : resourceLevel === 1 ? 2 : 1
    const starPowerAdvantage = bRef.advantages.find(advantage => advantage.name === "Star Power") || emptyAdvantage;
    const fameMin = (bRef.name === "Fame" && v5AdvantageLevel(starPowerAdvantage).level > 0) ? 3 : 1;
        const BackgroundInput = (backgroundRef: V5BackgroundRef) => {
        if (!backgroundRef) { return }
        return (
            <Center>
                <Stack>
                    <Center>
                        <NumberInput
                            value={v5BackgroundLevel(backgroundRef).level}
                            min={Math.max(backgroundRef.freebiePoints, fameMin)}
                            max={backgroundRef.name === "Haven" ? havenMax : v5BackgroundLevel(backgroundRef).level === 3 ? backgroundRef.creationPoints : 3}
                            onChange={(val: number) => {
                                let creationPoints = val - backgroundRef.freebiePoints
                                handleBackgroundChange(kindred, setKindred, backgroundRef, "creationPoints", creationPoints)
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

    const havenSizeMax = bRef.name === "Haven" ? v5BackgroundLevel(bRef).level : 0;

    const advantageStep = (advantage: V5AdvantageRef, background: V5Background): number => {
        if (!background.advantages) { return 1 }
        const advantageInfo = background.advantages.find(entry => entry.name === advantage.name)
        let minCost = advantageInfo?.cost[0];
        let maxCost = advantageInfo?.cost[advantageInfo?.cost.length - 1]
        if (!minCost || !maxCost) { return 0 }
        if (minCost === maxCost) {
            return minCost;
        } else {
            return 1;
        }
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
                {bRef.advantages.length > 0 ?
                    <Table>
                        <thead>
                            <tr>
                                Owned Advantages
                            </tr>
                        </thead>
                        {bRef.advantages.map((aRef) => {
                            const advantage = backgroundInfo.advantages?.find((a) => a.name === aRef.name)
                            if (!advantage || v5AdvantageLevel(aRef).level === 0) { return null }
                            const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                            return (
                                <tr>
                                    <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(aRef).level}</Text>
                                </tr>
                            )
                        })}
                    </Table>
                    : <></>}
                {backgroundInfo.advantages && backgroundInfo.advantages.length > 0 ?
                    <Accordion variant="contained">
                        <Accordion.Item value={bRef.name}>
                            <Accordion.Control>Advantages</Accordion.Control>
                            <Accordion.Panel>
                                <Table>
                                    <tbody>
                                        {backgroundInfo.advantages.map((advantage) => {
                                            const havenFreebies = bRef.name === "Haven" ? bRef.advantages.filter(advantage => advantage.havenBool).length : 0;
                                            const freebieBool = havenFreebies >= v5BackgroundLevel(bRef).level - 1;
                                            const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                                            const advantageRef = bRef.advantages.find((a) => a.name === advantage.name) || { ...emptyAdvantage, name: advantage.name }
                                            const starPowerBool = bRef.name === "Fame" && advantage.name === "Star Power" && v5BackgroundLevel(bRef).level < 3
                                            return (
                                                <>
                                                    <tr>
                                                        <td>
                                                            <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(advantageRef).level}</Text>
                                                            <Center>
                                                                {getRating(advantage.cost)}
                                                            </Center>
                                                            <Center>
                                                                <Group>
                                                                    <NumberInput
                                                                        disabled={starPowerBool}
                                                                        value={v5AdvantageLevel(advantageRef).level}
                                                                        style={{ width: "100px" }}
                                                                        min={advantageRef.havenBool?1:advantageRef.freebiePoints}
                                                                        step={advantageStep(advantageRef, backgroundInfo)}
                                                                        max={bRef.name === "Haven" && advantage.type === "advantage" ?
                                                                            havenSizeMax : v5AdvantageLevel(advantageRef).level === advantage.cost[advantage.cost.length - 1] ?
                                                                                advantageRef.creationPoints : advantage.cost[advantage.cost.length - 1]}
                                                                        onChange={(val:number) => {
                                                                            let trueVal = val - advantageRef.freebiePoints - (advantageRef.havenBool?1:0)
                                                                            handleAdvantageChange(kindred, setKindred, bRef, advantageRef, "creationPoints", trueVal)
                                                                        }}
                                                                    />
                                                                    {bRef.name === "Haven" && advantage.type === "advantage" ?
                                                                        <Checkbox
                                                                            disabled={((getAdvantagePoints(advantageRef) > 0) || freebieBool) && (!advantageRef.havenBool)}
                                                                            color="red"
                                                                            icon={CheckboxIcon}
                                                                            checked={advantageRef.havenBool}
                                                                            onClick={() => {
                                                                                if (advantageRef.havenBool) {
                                                                                    handleAdvantageChange(kindred, setKindred, bRef, advantageRef, "havenBool", false)
                                                                                }
                                                                                else {
                                                                                    handleAdvantageChange(kindred, setKindred, bRef, advantageRef, "havenBool", true)
                                                                                }
                                                                            }}
                                                                        />
                                                                        :
                                                                        <></>}
                                                                </Group>
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