import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { ActionIcon, Checkbox, CheckboxProps, Modal, NumberInput, Accordion, Text, Button, Group, Table, Center, Stack, TextInput } from "@mantine/core"
import Tally from "../../../utils/talley"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { emptyAdvantage, handleAdvantageChange, handleBackgroundRemove, V5BackgroundRef, v5BackgroundLevel, handleBackgroundChange, backgroundData, v5HandleXpBackgroundChange, v5HandleXpAdvantageChange, v5AdvantageLevel } from "../../../data/GoodIntentions/types/V5Backgrounds"
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

        const resourcesRef = kindred.backgrounds.find((entry) => entry.name === "Resources");
        const resourceLevel = resourcesRef ? v5BackgroundLevel(resourcesRef).level : 0;
        const havenMax = resourceLevel === 3 ? 3 : resourceLevel === 1 ? 2 : 1;
        const backgroundMax = backgroundRef.name==="Haven"?havenMax:3
        const starPowerAdvantage = bRef.advantages.find(advantage => advantage.name === "Star Power") || emptyAdvantage;
        const fameBool = (bRef.name === "Fame" && v5AdvantageLevel(starPowerAdvantage).level > 0); 

        return (
            <Center>
                <Stack>
                    <Center>
                        <ActionIcon variant="filled" radius="xl" color="dark" disabled={fameBool||(backgroundRef.freebiePoints === 0 && backgroundRef.creationPoints === 0 && backgroundRef.experiencePoints === 3)} onClick={() => v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, backgroundRef.experiencePoints - 1)}>
                            <CircleMinus strokeWidth={1.5} color="gray" />
                        </ActionIcon>
                        <NumberInput
                            disabled={fameBool}
                            value={backgroundRef.experiencePoints}
                            min={backgroundRef.freebiePoints === 0 && backgroundRef.creationPoints === 0 ? 3 : 0}
                            max={v5BackgroundLevel(backgroundRef).level === backgroundMax? backgroundRef.experiencePoints: undefined}
                            onChange={(val: number) => {
                                v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, val)
                            }}
                            style={{ width: "100px" }}
                        />
                        <ActionIcon variant="filled" radius="xl" color="dark" disabled={v5BackgroundLevel(backgroundRef).level === backgroundMax} onClick={() => v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, backgroundRef.experiencePoints + 1)}>
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
                {(bRef.advantages.length > 0 && backgroundInfo.advantages) ?
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
                                            const havenFreebies = bRef.name === "Haven" ? bRef.advantages.filter(advantage => advantage.havenBool).length : 0;
                                            const freebieBool = havenFreebies >= v5BackgroundLevel(bRef).level - 1;
                                            const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                                            const advantageRef = bRef.advantages.find((a) => a.name === advantage.name) || { ...emptyAdvantage, name: advantage.name }
                                            const havenBoolean = bRef.name === "Haven" && v5BackgroundLevel(bRef).level <= v5AdvantageLevel(advantageRef).level
                                            const pointBool = advantageRef.freebiePoints > 0 || advantageRef.creationPoints > 0 || advantageRef.experiencePoints > 0
                                            const starPowerBool = bRef.name === "Fame" && advantage.name === "Star Power" && v5BackgroundLevel(bRef).level < 3
                                            const isCatenating = kindred.meritsFlaws.some((mf) => mf.name === "Catenating blood")
                                            const canGhoul = !isCatenating && advantage.name==="Retainer" && (kindred.clan==="Thin-Blood")
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
                                                                        disabled={starPowerBool||canGhoul}
                                                                        value={advantageRef.experiencePoints}
                                                                        style={{ width: "100px" }}
                                                                        min={0}
                                                                        max={(advantage.cost[advantage.cost.length - 1] === v5AdvantageLevel(advantageRef).level) || havenBoolean ? advantageRef.experiencePoints : undefined}
                                                                        onChange={(val: number) => {
                                                                            v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, val)
                                                                        }}
                                                                    />
                                                                    <ActionIcon variant="filled" radius="xl" color="dark" disabled={havenBoolean || starPowerBool || (advantage.cost[advantage.cost.length - 1] === v5AdvantageLevel(advantageRef).level)} onClick={() => v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, advantageRef.experiencePoints + 1)}>
                                                                        <CirclePlus strokeWidth={1.5} color="gray" />
                                                                    </ActionIcon>
                                                                    {bRef.name === "Haven" && advantage.type === "advantage" ?
                                                                        <Checkbox
                                                                            disabled={(pointBool||freebieBool)&&(!advantageRef.havenBool)}
                                                                            color="red"
                                                                            icon={CheckboxIcon}
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

export default V5AdvantageXpInputs