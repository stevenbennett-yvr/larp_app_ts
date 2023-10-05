import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { ActionIcon, Checkbox, CheckboxProps, Modal, NumberInput, Accordion, Text, Button, Group, Table, Center, Stack, TextInput } from "@mantine/core"
import Tally from "../../../utils/talley"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { handleAdvantageChange, emptyAdvantage, handleBackgroundRemove, V5AdvantageRef, V5BackgroundRef, v5BackgroundLevel, handleBackgroundChange, backgroundData, v5HandleXpBackgroundChange, v5FindMaxBackground, v5HandleXpAdvantageChange, v5AdvantageLevel } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { Droplet, CirclePlus, CircleMinus } from 'tabler-icons-react';

type V5AdvantageXpInputsProps = {
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

const V5AdvantageXpInputs = ({ kindred, setKindred, bId, modalOpened, closeModal }: V5AdvantageXpInputsProps) => {

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
                        <ActionIcon variant="filled" radius="xl" color="dark" disabled={ backgroundRef.freebiePoints === 0 && backgroundRef.creationPoints=== 0 && backgroundRef.experiencePoints === 3} onClick={() => v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, backgroundRef.experiencePoints - 1)}>
                            <CircleMinus strokeWidth={1.5} color="gray" />
                        </ActionIcon>
                        <NumberInput
                            value={backgroundRef.experiencePoints}
                            min={backgroundRef.freebiePoints === 0 && backgroundRef.creationPoints=== 0? 3:0}
                            max={v5FindMaxBackground(kindred, backgroundRef)}
                            onChange={(val: number) => {
                                v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, val)
                            }}
                            style={{ width: "100px" }}
                        />
                        <ActionIcon variant="filled" radius="xl" color="dark" disabled={v5FindMaxBackground(kindred, backgroundRef) === backgroundRef.experiencePoints} onClick={() => v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, backgroundRef.experiencePoints + 1)}>
                            <CirclePlus strokeWidth={1.5} color="gray" />
                        </ActionIcon>
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

    const havenSizeMax = bRef.name === "Haven" ? v5BackgroundLevel(bRef).level : 0;
    let freeAdvantagePoints = Math.max(0, havenSizeMax - 1)
    const advantagesWithFreebiePoints = bRef.advantages.filter((advantage) => {
        return advantage.freebiePoints > 0;
    });
    let freeAdvantage = bRef.freeAdvantage ?? [];

    console.log()

    let predatorType = kindred.predatorType
    const numberOfAdvantagesWithFreebiePoints =
        advantagesWithFreebiePoints.length + (predatorType === "Farmer" || predatorType === "Hitcher" || predatorType === "Graverobber" ? 1 : 0);

    return (
        <Modal
            opened={modalOpened}
            onClose={closeModal}
            size={600}
        >
            <Stack>
                <Text fz={"30px"} ta={"center"}>{backgroundInfo.name}: {v5BackgroundLevel(bRef).level} {bRef.sphere}</Text>

                {BackgroundInput(bRef)}
                {(bRef.freebiePoints === 0 && bRef.creationPoints === 0) ?
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
                {(bRef.advantages.length > 0 && backgroundInfo.advantages )?
                <Table>
                    <thead>
                        <tr>
                            Owned Advantages
                        </tr>
                    </thead>
                    {bRef.advantages.map((aRef) => {
                        const advantage = backgroundInfo.advantages?.find((a) => a.name === aRef.name)
                        if (!advantage || v5AdvantageLevel(aRef).level === 0) {return null}
                        const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                        return (
                            <tr>
                            <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(aRef).level}</Text>
                            </tr>
                        )
                    })}
                </Table>
                :
                <></>
                }

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
                                            const havenBoolean = bRef.name === "Haven" && v5BackgroundLevel(bRef).level <= v5AdvantageLevel(advantageRef).level 
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
                                                                    <ActionIcon variant="filled" radius="xl" color="dark" onClick={() => v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, advantageRef.experiencePoints - 1)}>
                                                                        <CircleMinus strokeWidth={1.5} color="gray" />
                                                                    </ActionIcon>
                                                                    <NumberInput
                                                                        value={advantageRef.experiencePoints}
                                                                        style={{ width: "100px" }}
                                                                        min={0}
                                                                        max={(advantage.cost[advantage.cost.length-1] === v5AdvantageLevel(advantageRef).level)||havenBoolean?advantageRef.experiencePoints: undefined}
                                                                        onChange={(val: number) => {
                                                                            v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, val)                                                                        }}
                                                                    />
                                                                    <ActionIcon variant="filled" radius="xl" color="dark" disabled={havenBoolean || (advantage.cost[advantage.cost.length-1] === v5AdvantageLevel(advantageRef).level)} onClick={() => v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, advantageRef.experiencePoints + 1)}>
                                                                        <CirclePlus strokeWidth={1.5} color="gray" />
                                                                    </ActionIcon>
                                                                    {bRef.name === "Haven" && advantage.type === "advantage" ?
                                                                        <Checkbox
                                                                            color="red"
                                                                            icon={CheckboxIcon}
                                                                            disabled={
                                                                                advantageRef.creationPoints > 0 ||
                                                                                (advantageRef.freebiePoints > 0 && !(freeAdvantage.includes(advantage.name))) ||
                                                                                (freeAdvantagePoints - numberOfAdvantagesWithFreebiePoints === 0 && !(freeAdvantage.includes(advantage.name)))
                                                                            }
                                                                            checked={freeAdvantage.includes(advantage.name)}
                                                                            onClick={() => {
                                                                                if (advantageRef.freebiePoints === 0) {
                                                                                    handleAdvantageChange(kindred, setKindred, bRef, advantageRef, "freebiePoints", 1)
                                                                                    freeAdvantage.push(advantageRef.name)
                                                                                    handleBackgroundChange(kindred, setKindred, bRef, "freeAdvantage", freeAdvantage)
                                                                                }
                                                                                else {
                                                                                    bRef.advantages = bRef.advantages.filter((entry: V5AdvantageRef) => entry.name !== advantageRef.name);
                                                                                    freeAdvantage = freeAdvantage.filter((name: string) => name !== advantageRef.name);
                                                                                    console.log(bRef); // This should show the updated bRef
                                                                                    handleBackgroundChange(kindred, setKindred, bRef, "freeAdvantage", freeAdvantage);
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

export default V5AdvantageXpInputs