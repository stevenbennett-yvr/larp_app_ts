import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { ActionIcon, NumberInput, Accordion, Text, Group, Table, Center, Input } from "@mantine/core"
import Tally from "../../../utils/talley"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"
import { V5BackgroundRef, v5AdvantageLevel, handleAdvantageChange, emptyAdvantage, V5AdvantageRef, v5HandleXpAdvantageChange, v5BackgroundLevel, backgroundData, V5Background, V5Advantage } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';
import { handleBenefitAdvantageChange, Benefit } from "../../../data/GoodIntentions/types/V5Loresheets"


export type TypeCategory = 'creationPoints' | 'experiencePoints' | 'freebiePoints' | 'loresheetFreebiePoints';

type AdvantageAccordionProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    bRef: V5BackgroundRef | null,
    type: TypeCategory
    benefitData?: Benefit
    setBenefitData?: (benefitData: Benefit) => void
    disabled?: boolean
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

const AdvantageAccordion = ({ kindred, setKindred, bRef, type, benefitData, setBenefitData, disabled }: AdvantageAccordionProps) => {
    if (!bRef) { return null }

    const backgroundInfo = backgroundData.find((entry) => entry.name === bRef.name)
    if (!backgroundInfo || backgroundInfo.advantages === undefined) { return null }

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

    const renderInput = (advantage: V5Advantage, advantageRef: V5AdvantageRef, type: TypeCategory) => {

        const isCatenating = kindred.meritsFlaws.some((mf) => mf.name === "Catenating blood")
        const canGhoul = !isCatenating && advantage.name === "Retainer" && (kindred.clan === "Thin-Blood")
        const starPowerBool = bRef.name === "Fame" && advantage.name === "Star Power" && v5BackgroundLevel(bRef).level < 3
        const havenBoolean = bRef.name === "Haven" && v5BackgroundLevel(bRef).level <= v5AdvantageLevel(advantageRef).level
        const {totalXpNeeded} = v5BackgroundLevel(bRef)

        switch (type) {
            case 'creationPoints':
                return (
                    <NumberInput
                        label="Creation Points"
                        disabled={starPowerBool || canGhoul || disabled}
                        value={v5AdvantageLevel(advantageRef).level}
                        style={{ width: "100px" }}
                        min={advantageRef.havenPoints ? advantageRef.havenPoints + advantageRef.freebiePoints : advantageRef.freebiePoints}
                        step={advantageStep(advantageRef, backgroundInfo)}
                        max={bRef.name === "Haven" && advantage.type === "advantage" ?
                            havenSizeMax : v5AdvantageLevel(advantageRef).level === advantage.cost[advantage.cost.length - 1] ?
                                advantageRef.creationPoints : advantage.cost[advantage.cost.length - 1]}
                        onChange={(val: number) => {
                            let trueVal = val - advantageRef.freebiePoints - (advantageRef.havenPoints ? advantageRef.havenPoints : 0)
                            handleAdvantageChange(kindred, setKindred, bRef, advantageRef, "creationPoints", trueVal)
                        }}
                    />
                );
            case 'loresheetFreebiePoints':
                return (
                    <NumberInput
                    label="Loresheet Freebie Points"
                    disabled={disabled}
                    value={advantageRef.loresheetFreebiePoints}
                    min={0}
                    step={advantageStep(advantageRef, backgroundInfo)}
                    max={
                        backgroundInfo.name === "Haven" && advantage.type === "advantage"
                            ? havenSizeMax
                            : getAdvantagePoints(advantageRef) === advantage.cost[advantage.cost.length - 1]
                                ? advantageRef.creationPoints
                                : advantage.cost[advantage.cost.length - 1]
                    }
                    onChange={(val: number) => {
                        if (!benefitData || !setBenefitData) { return null }
                        handleBenefitAdvantageChange(bRef, advantageRef, benefitData, setBenefitData, val, "loresheetFreebiePoints")
                    }
                    }
                />
                )
            case 'freebiePoints':
                return (
                    <NumberInput
                        label="Freebie Points"
                        disabled={disabled}
                        value={advantageRef.freebiePoints}
                        min={0}
                        step={advantageStep(advantageRef, backgroundInfo)}
                        max={
                            backgroundInfo.name === "Haven" && advantage.type === "advantage"
                                ? havenSizeMax
                                : getAdvantagePoints(advantageRef) === advantage.cost[advantage.cost.length - 1]
                                    ? advantageRef.creationPoints
                                    : advantage.cost[advantage.cost.length - 1]
                        }
                        onChange={(val: number) => {
                            if (!benefitData || !setBenefitData) { return null }
                            handleBenefitAdvantageChange(bRef, advantageRef, benefitData, setBenefitData, val, "freebiePoints")
                        }
                        }
                    />
                );
            case 'experiencePoints':
                return (
                    <Group>
                        <Input.Wrapper
                            label={``}
                        >
                            <Text size="12px" color="gray.6">Xp for Next: {totalXpNeeded - bRef.experiencePoints}</Text>
                            <Text size="12px" color="gray.6">Total XP Needed {totalXpNeeded}</Text>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ActionIcon variant="filled" radius="xl" color="dark" onClick={() => v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, advantageRef.experiencePoints - 1)}>
                                    <CircleMinus strokeWidth={1.5} color="gray" />
                                </ActionIcon>
                                <NumberInput
                                    disabled={starPowerBool || canGhoul || disabled}
                                    value={advantageRef.experiencePoints}
                                    style={{ width: "100px" }}
                                    min={0}
                                    max={(advantage.cost[advantage.cost.length - 1] === v5AdvantageLevel(advantageRef).level) || havenBoolean ? advantageRef.experiencePoints : undefined}
                                    onChange={(val: number) => {
                                        v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, val)
                                    }}
                                />
                                <ActionIcon variant="filled" radius="xl" color="dark" disabled={havenBoolean || starPowerBool || disabled || (advantage.cost[advantage.cost.length - 1] === v5AdvantageLevel(advantageRef).level)} onClick={() => v5HandleXpAdvantageChange(kindred, setKindred, bRef, advantageRef, advantageRef.experiencePoints + 1)}>
                                    <CirclePlus strokeWidth={1.5} color="gray" />
                                </ActionIcon>
                            </div>
                        </Input.Wrapper>
                    </Group>
                )
        }
    }

    const renderAdvantage = (advantage: V5Advantage) => {
        const advantageRef = bRef.advantages.find((a) => a.name === advantage.name) || { ...emptyAdvantage, name: advantage.name }
        let havenFreebies = bRef.name === "Haven" ? bRef.advantages.reduce((total, a) => total + (a?.havenPoints || 0), 0) : 0;
        const freebieBool = havenFreebies >= v5BackgroundLevel(bRef).level - 1;
        const icon = advantage?.type === "disadvantage" ? flawIcon() : meritIcon()
        const isDisadvantage = advantage.type === "disadvantage";
        if (isDisadvantage && (type === "freebiePoints" || "loresheetFreebiePoints")) {
            return null;
        }
        return (
            <>
                <tr key={`${advantage.name}`}>
                    <td>
                        <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(advantageRef).level}</Text>
                        <Center>
                            {getRating(advantage.cost)}
                        </Center>
                        <Center>
                            <Group>
                                {renderInput(advantage, advantageRef, type)}
                                {bRef.name === "Haven" && advantage.type === "advantage" && v5BackgroundLevel(bRef).level > 1 ?
                                    <NumberInput
                                        label="Haven Freebies"
                                        disabled={(freebieBool && advantageRef.havenPoints === 0)}
                                        value={advantageRef.havenPoints}
                                        style={{ width: "100px" }}
                                        min={0}
                                        max={(v5AdvantageLevel(advantageRef).level >= havenSizeMax || v5AdvantageLevel(advantageRef).level >= advantage.cost[advantage.cost.length - 1]) || freebieBool ?
                                            advantageRef.havenPoints : undefined}
                                        onChange={(val: number) => {
                                            handleAdvantageChange(kindred, setKindred, bRef, advantageRef, "havenPoints", val)
                                        }}
                                    />
                                    :
                                    <></>}
                            </Group>
                        </Center>
                    </td>
                </tr>
                <tr key={`${advantage.name}-description`}>
                    <td dangerouslySetInnerHTML={{ __html: `${advantage.description}` }}></td>
                </tr>
            </>
        )
    }

    return (
        <Accordion variant="contained">
            <Accordion.Item value={bRef.name}>
                <Accordion.Control>Advantages</Accordion.Control>
                <Accordion.Panel>
                    <Table>
                        <tbody>
                            {backgroundInfo.advantages.map((advantage) =>
                                renderAdvantage(advantage)
                            )}
                        </tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )

}

export default AdvantageAccordion