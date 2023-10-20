import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { ActionIcon, Modal, NumberInput, Text, Button, Table, Center, Stack, TextInput } from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { v5AdvantageLevel, emptyAdvantage, handleBackgroundRemove, V5BackgroundRef, v5BackgroundLevel, handleBackgroundChange, backgroundData, v5HandleXpBackgroundChange } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import AdvantageAccordion from "./AdvantageAccordion"

export type TypeCategory = 'creationPoints' | 'experiencePoints' ;

type BackgroundModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    bId: string,
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

const BackgroundModal = ({ kindred, setKindred, bId, modalOpened, closeModal, type }: BackgroundModalProps) => {

    const bRef = kindred.backgrounds.find((entry) => entry.id === bId)
    if (!bRef) { return null }

    const backgroundInfo = backgroundData.find((entry) => entry.name === bRef.name)
    if (!backgroundInfo) { return null }

    const resourcesRef = kindred.backgrounds.find((entry => entry.name === "Resources"))
    const resourceLevel = resourcesRef ? v5BackgroundLevel(resourcesRef).level : 0;
    const havenMax = bRef.id==="farmer-haven" ? Math.max(resourceLevel, 2): resourceLevel === 3 ? 3 : resourceLevel === 1 ? 2 : 1
    const starPowerAdvantage = bRef.advantages.find(advantage => advantage.name === "Star Power") || emptyAdvantage;
    const fameMin = (bRef.name === "Fame" && v5AdvantageLevel(starPowerAdvantage).level > 0) ? 3 : 1;
    const fameBool = (bRef.name === "Fame" && v5AdvantageLevel(starPowerAdvantage).level > 0); 
    
    const BackgroundInput = (backgroundRef: V5BackgroundRef) => {
        if (!backgroundRef) { return }
        const backgroundMax = backgroundRef.name==="Haven"?havenMax:3
        return (
            <Center>
                <Stack>
                    <Center>
                        {type==="creationPoints"?
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
                        :
                        <>
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
                        </>
                        }
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
                        <tbody>
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
                        </tbody>
                    </Table>
                    : <></>}
                <AdvantageAccordion kindred={kindred} setKindred={setKindred} bId={bId} type={type} />
            </Stack>
        </Modal>

    )

}

export default BackgroundModal