import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Tooltip, Textarea, ActionIcon, Modal, NumberInput, Text, Button, Table, Center, Stack, TextInput, Group, Checkbox } from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { v5AdvantageLevel, emptyAdvantage, handleBackgroundRemove, V5BackgroundRef, v5BackgroundLevel, handleBackgroundChange, backgroundData, v5HandleXpBackgroundChange, V5AdvantageRef } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import AdvantageAccordion from "./AdvantageAccordion"
import { Spheres } from "../../../data/GoodIntentions/types/V5Spheres"
import { upcase } from "../../../utils/case"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type BackgroundModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    bRef: V5BackgroundRef | null,
    modalOpened: boolean,
    closeModal: () => void
    type: TypeCategory
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

const BackgroundModal = ({ kindred, setKindred, bRef, modalOpened, closeModal, type }: BackgroundModalProps) => {
    if (!bRef) { return null }
    let BackgroundRef = kindred.backgrounds.find((entry) => entry.id === bRef.id)
    if (!BackgroundRef) { return null }

    const backgroundInfo = backgroundData.find((entry) => entry.name === bRef.name)
    if (!backgroundInfo) { return null }

    const resourceBackgrounds = kindred.backgrounds.filter(entry => entry.name === "Resources");

    const highestResourceLevel = resourceBackgrounds.reduce((highestLevel, background) => {
        const level = v5BackgroundLevel(background).level;
        return level > highestLevel ? level : highestLevel;
    }, 0);
    const havenMax = bRef.id === "farmer-haven" ? Math.max(highestResourceLevel, 2) : highestResourceLevel === 3 ? 3 : highestResourceLevel >= 1 ? 2 : 1
    const starPowerAdvantage = bRef.advantages.find(advantage => advantage.name === "Star Power") || emptyAdvantage;
    const fameMin = (bRef.name === "Fame" && v5AdvantageLevel(starPowerAdvantage).level > 0) ? 3 : 1;
    const fameBool = (bRef.name === "Fame" && v5AdvantageLevel(starPowerAdvantage).level > 0);
    const totalFreebies = bRef.freebiePoints + bRef.predatorTypeFreebiePoints + bRef.loresheetFreebiePoints

    const BackgroundInput = (backgroundRef: V5BackgroundRef) => {
        if (!backgroundRef) { return }
        const backgroundMax = backgroundRef.name === "Haven" ? havenMax : 3
        return (
            <Center key={backgroundRef.id}>
                <Stack>
                    <Center>
                        {kindred.coterie.id !== "" ?
                            <Checkbox
                                label="Share background with Coterie"
                                checked={backgroundRef.share}
                                onChange={(event) => 
                                    handleBackgroundChange(kindred, setKindred, backgroundRef, "share", event.currentTarget.checked)
                                }
                            />
                            : <></>}
                    </Center>
                    <TextInput
                        style={{ width: "300px" }}
                        value={backgroundRef.backgroundName}
                        label={`${backgroundRef.name} Name`}
                        onChange={(event) =>
                            handleBackgroundChange(kindred, setKindred, backgroundRef, "backgroundName", event.target.value)
                        }
                    />
                    <Center>
                        <Textarea
                            style={{ width: "300px" }}
                            value={backgroundRef.backgroundDescription}
                            onChange={(event) =>
                                handleBackgroundChange(kindred, setKindred, backgroundRef, "backgroundDescription", event.target.value)
                            }
                            label={`${backgroundRef.name} Description`}
                            minRows={3}
                        />
                    </Center>
                    <Center>
                        {type === "creationPoints" ?
                            <NumberInput
                                label={`${backgroundRef.name} Level`}
                                value={Math.max(totalFreebies, v5BackgroundLevel(backgroundRef).level)}
                                min={Math.max(totalFreebies, fameMin)}
                                max={backgroundRef.name === "Haven" ? havenMax : v5BackgroundLevel(backgroundRef).level === 3 ? backgroundRef.creationPoints : 3}
                                onChange={(val: number) => {
                                    let creationPoints = val - (totalFreebies)
                                    if (creationPoints < 0) { creationPoints = 0 }
                                    handleBackgroundChange(kindred, setKindred, backgroundRef, "creationPoints", creationPoints)
                                }}
                                style={{ width: "100px" }}
                            />
                            :
                            <>
                                <ActionIcon variant="filled" radius="xl" color="dark" disabled={fameBool || (v5BackgroundLevel(backgroundRef).level === 1 && backgroundRef.experiencePoints === 3)} onClick={() => v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, backgroundRef.experiencePoints - 1)}>
                                    <CircleMinus strokeWidth={1.5} color="gray" />
                                </ActionIcon>
                                <NumberInput
                                    disabled={fameBool}
                                    value={backgroundRef.experiencePoints}
                                    min={backgroundRef.freebiePoints === 0 && backgroundRef.creationPoints === 0 ? 3 : 0}
                                    max={v5BackgroundLevel(backgroundRef).level === backgroundMax ? backgroundRef.experiencePoints : undefined}
                                    onChange={(val: number) => {
                                        v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, val)
                                    }}
                                    style={{ width: "100px" }}
                                />
                                <ActionIcon variant="filled" radius="xl" color="dark" disabled={v5BackgroundLevel(backgroundRef).level === backgroundMax} onClick={() => v5HandleXpBackgroundChange(kindred, setKindred, backgroundRef, backgroundRef.experiencePoints + 1)}>
                                    <CirclePlus strokeWidth={1.5} color="gray" />
                                </ActionIcon>
                            </>
                        }
                    </Center>

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
                <Text fz={"30px"} ta={"center"}>{backgroundInfo.name}: {v5BackgroundLevel(BackgroundRef).level}</Text>
                {
                    BackgroundRef.sphere && BackgroundRef.sphere.length > 0 ?
                        <Center>
                            <Group>
                                {BackgroundRef.sphere.map((s) => (

                                    <Tooltip label={Spheres[s].summary} color="gray" withArrow>
                                        <Group><Text>{upcase(s)} </Text><FontAwesomeIcon icon={Spheres[s].symbol} style={{ color: "#e03131" }} /></Group>
                                    </Tooltip>
                                ))}
                            </Group>
                        </Center>
                        : <></>
                }
                {BackgroundInput(BackgroundRef)}
                {totalFreebies === 0 ?
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
                {BackgroundRef.advantages.length > 0 ?
                    <Table>
                        <thead>
                            <tr>
                                <td>
                                    Owned Advantages
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {BackgroundRef.advantages.map((aRef: V5AdvantageRef) => {
                                const advantage = backgroundInfo.advantages?.find((a) => a.name === aRef.name)
                                if (!advantage || v5AdvantageLevel(aRef).level === 0) { return null }
                                const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
                                return (
                                    <tr key={aRef.name}>
                                        <td>
                                            <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(aRef).level}</Text>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    : <></>}
                <AdvantageAccordion kindred={kindred} setKindred={setKindred} bRef={BackgroundRef} oRef={null} type={type} />
            </Stack>
        </Modal>
    )
}

export default BackgroundModal