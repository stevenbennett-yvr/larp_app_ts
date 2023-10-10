// External Libraries
import { faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Group,
    Modal,
    Stack,
    Text,
    Button,
    Title,
    Select,
    Divider,
    NumberInput,
    Tooltip
  } from "@mantine/core";


// Data Types
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import {
  PredatorType,
  PredatorTypeName,
  PredatorTypes,
} from "../../../data/GoodIntentions/types/V5PredatorType";
import {
  v5BackgroundLevel,
  v5AdvantageLevel,
  V5SphereKey,
  V5BackgroundRef,
} from "../../../data/GoodIntentions/types/V5Backgrounds";
import { V5MeritFlawRef, v5MeritLevel } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import { SphereSelectData } from "../../../data/GoodIntentions/types/V5Backgrounds";

// Data and Globals
import { backgroundData } from "../../../data/GoodIntentions/types/V5Backgrounds";
import { globals } from "../../../assets/globals";
import { meritFlawData } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";

// Utilities
import { upcase } from "../../../utils/case";
import Tally from "../../../utils/talley";


type PredatorModalProps = {
    modalOpened: boolean
    closeModal: () => void
    kindred: Kindred,
    pickedPredatorType: PredatorTypeName,
    setKindred: (character: Kindred) => void
    nextStep: () => void
    predatorData: any,
    setPredatorData: (predatorData: PredatorType) => void
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

const PredatorModal = ({ modalOpened, closeModal, kindred, setKindred, nextStep, pickedPredatorType, predatorData, setPredatorData }: PredatorModalProps) => {

    let pass = true

    const getRating = (array: number[]) => {
        let first = array[0]
        let last = array[array.length - 1]

        if (first === last) {
            return <Tally n={last} />
        } else {
            return <Group><Tally n={first} /> to <Tally n={last} /></Group>
        }

    }

    const getStep = (meritFlaw: V5MeritFlawRef): number => {
        const meritInfo = meritFlawData.find(entry => entry.name === meritFlaw.name)
        let minCost = meritInfo?.cost[0];
        let maxCost = meritInfo?.cost[meritInfo?.cost.length - 1]
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
                <Title style={{ fontFamily: "serif", textAlign: "center" }}>{pickedPredatorType}</Title>
                <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>{PredatorTypes[pickedPredatorType].summary}</Text>
                {PredatorTypes[pickedPredatorType]?.huntingPool ?
                    <Text fz={globals.smallerFontSize}><b>Hunting Pool:</b> {upcase(PredatorTypes[pickedPredatorType].huntingPool?.attribute)} +  {upcase(PredatorTypes[pickedPredatorType].huntingPool?.skill)}</Text>
                    : <></>}
                {(PredatorTypes[pickedPredatorType].backgrounds) || (PredatorTypes[pickedPredatorType].selectableBackground.options.length > 0) ?
                    <>
                        <Divider my="sm" />

                        <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>Backgrounds</Text>
                    </>
                    : <></>}

                {PredatorTypes[pickedPredatorType].backgrounds ?
                    <Stack>
                        {PredatorTypes[pickedPredatorType].backgrounds.map((background) => {
                            let backgroundInfo = backgroundData.find(entry => entry.name === background.name)
                            if (!backgroundInfo) return (null)
                            return (
                                <div key={background.id}>
                                    <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                        <b>{background.name}</b> {v5BackgroundLevel(background).level}
                                        <div dangerouslySetInnerHTML={{ __html: backgroundInfo?.summary }} />

                                    </Text>

                                    {(() => {
                                        if (background.sphere && background.sphere.length > 1) {
                                            predatorData.backgrounds.forEach((b: any) => {
                                                if (b.id === background.id && b.sphere.length > 1) {
                                                    pass = false;
                                                }
                                            });

                                            return (
                                                <Select
                                                    label="Pick Sphere for Background"
                                                    placeholder="Pick sphere"
                                                    data={background.sphere}
                                                    defaultValue=""
                                                    onChange={(val) => {
                                                        setPredatorData({
                                                            ...predatorData,
                                                            backgrounds: predatorData.backgrounds.map((b: any) =>
                                                                b.id === background.id
                                                                    ? { ...b, sphere: [val as V5SphereKey] }
                                                                    : b
                                                            ),
                                                        });
                                                    }}
                                                />
                                            );

                                        }
                                    })()}

                                    {(() => {
                                        if (background.sphere && background.sphere.length === 0) {
                                            predatorData.backgrounds.forEach((b: any) => {
                                                if (b.id === background.id && b.sphere.length === 0) {
                                                    pass = false;
                                                }
                                            });

                                            return (
                                                <Select
                                                    label="Pick Sphere for Background"
                                                    placeholder="Pick sphere"
                                                    data={SphereSelectData}
                                                    defaultValue=""
                                                    onChange={(val) => {
                                                        setPredatorData({
                                                            ...predatorData,
                                                            backgrounds: predatorData.backgrounds.map((b: any) =>
                                                                b.id === background.id
                                                                    ? { ...b, sphere: [val as V5SphereKey] }
                                                                    : b
                                                            ),
                                                        });
                                                    }}
                                                />
                                            );

                                        }
                                    })()}

                                    {background.advantages && background.advantages.length > 0 && (
                                        <ul>
                                            {background.advantages.map((advantage) => {
                                                let advantageInfo = backgroundInfo?.advantages?.find(entry => entry.name === advantage.name)
                                                const icon = advantageInfo?.type === "disadvantage" ? flawIcon() : meritIcon()

                                                if (!advantageInfo) return (null)
                                                return (
                                                    <Text>
                                                        {icon} &nbsp;
                                                        <b>{advantage.name} {v5AdvantageLevel(advantage).level}</b>
                                                        <div dangerouslySetInnerHTML={{ __html: advantageInfo.description }} />
                                                    </Text>
                                                )
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )
                        })}
                    </Stack>
                    : null}

                {PredatorTypes[pickedPredatorType].selectableBackground.options.length > 0 && (() => {
                    const options = predatorData.selectableBackground.options
                    const totalPoints = predatorData.selectableBackground.totalPoints
                    let spentPoints = 0;
                    options.forEach((option: V5BackgroundRef) => {
                        spentPoints += option.freebiePoints;
                    });
                    return (
                        <>
                            <Group position="apart">
                            <Text maw={"80%"} fz={"xl"}>
                                    {`Pick ${totalPoints} from: `}
                                </Text>
                                <Text>
                                    Remaining: <Title ta={"center"} c={"red"}>{`${totalPoints - spentPoints}`}</Title>
                                </Text>
                                <Stack>
                                    {options.map((option: V5BackgroundRef) => {
                                        if (totalPoints - spentPoints === 0) { pass = true } else { pass = false }
                                        const backgroundInfo = backgroundData.find((entry) => entry.name === option.name);
                                        if (!backgroundInfo) {
                                            return null;
                                        } else {
                                            return (
                                                <div>
                                                    <Group>
                                                        <Tooltip
                                                            disabled={backgroundInfo.summary === ""}
                                                            label={backgroundInfo.summary}
                                                            transitionProps={{ transition: "slide-up", duration: 200 }}
                                                            events={{ hover: true, focus: true, touch: true }}
                                                        >
                                                            <Text w={"140px"}>{option.name}</Text>
                                                        </Tooltip>
                                                        <NumberInput
                                                            value={option.freebiePoints}
                                                            min={0}
                                                            max={totalPoints - spentPoints === 0 ? option.freebiePoints : 3}
                                                            width={"50%"}
                                                            onChange={(val: number) => {
                                                                setPredatorData({
                                                                    ...predatorData,
                                                                    selectableBackground: {
                                                                        ...predatorData.selectableBackground,
                                                                        options: predatorData.selectableBackground.options.map((b: any) =>
                                                                            b.id === option.id
                                                                                ? { ...b, freebiePoints: val }
                                                                                : b
                                                                        ),
                                                                    },
                                                                });
                                                            }}
                                                            style={{ width: "100px" }}
                                                        />
                                                    </Group>
                                                </div>
                                            );
                                        }
                                    })}
                                </Stack>
                            </Group>
                        </>
                    );
                })()}

                {(PredatorTypes[pickedPredatorType].meritsAndFlaws.length > 0) || (PredatorTypes[pickedPredatorType].selectableMeritFlaw.options.length > 0) ?
                    <>
                        <Divider my="sm" />
                        <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>Merits or Flaws</Text>

                    </>
                    : <></>}

                {PredatorTypes[pickedPredatorType].meritsAndFlaws.length > 0 ?
                    <Stack>
                        {PredatorTypes[pickedPredatorType].meritsAndFlaws.map((meritFlaw) => {
                            let meritFlawInfo = meritFlawData.find(entry => entry.name === meritFlaw.name)
                            if (!meritFlawInfo) return (null)
                            const icon = meritFlawInfo?.type === "flaw" ? flawIcon() : meritIcon()
                            return (
                                <div key={meritFlawInfo.id}>
                                    <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                        {icon} &nbsp;
                                        <b>{meritFlawInfo.name}</b> {v5MeritLevel(meritFlaw).level}
                                        <div dangerouslySetInnerHTML={{ __html: meritFlaw.note }} />
                                    </Text>
                                </div>
                            )
                        })}
                    </Stack>
                    : null}

                {PredatorTypes[pickedPredatorType].selectableMeritFlaw.options.length > 0 && (() => {
                    const options = predatorData.selectableMeritFlaw.options
                    const totalPoints = predatorData.selectableMeritFlaw.totalPoints
                    let spentPoints = 0;
                    options.forEach((option: V5MeritFlawRef) => {
                        spentPoints += option.freebiePoints;
                        console.log(spentPoints)
                    });
                    return (
                        <>
                            <Group position="apart">
                                <Text maw={"80%"} fz={"xl"}>
                                    {`Pick ${totalPoints} from: `}
                                </Text>
                                <Text>
                                    Remaining: <Title ta={"center"} c={"red"}>{`${totalPoints - spentPoints}`}</Title>
                                </Text>
                                <Stack>
                                    {options.map((option: V5MeritFlawRef) => {
                                        const meritFlawInfo = meritFlawData.find((entry) => entry.name === option.name);
                                        if (totalPoints - spentPoints === 0) { pass = true } else { pass = false }
                                        if (!meritFlawInfo) { return null }
                                        else {
                                            return (
                                                <div>
                                                    <Group position="apart">
                                                        <Tooltip
                                                            disabled={meritFlawInfo.description === ""}
                                                            label={meritFlawInfo.description}
                                                            transitionProps={{ transition: "slide-up", duration: 200 }}
                                                            events={{ hover: true, focus: true, touch: true }}
                                                        >
                                                            <Text w={"140px"}>{option.name}</Text>
                                                        </Tooltip>
                                                        {getRating(meritFlawInfo.cost)}
                                                        <NumberInput
                                                            value={option.freebiePoints}
                                                            min={0}
                                                            max={(v5MeritLevel(option).level === meritFlawInfo.cost[meritFlawInfo?.cost.length - 1] && !(meritFlawInfo.cost[0] === 1)) || totalPoints - spentPoints === 0 ? option.creationPoints : meritFlawInfo.cost.length === 1 && meritFlawInfo.cost[0] === 1 ? 1 : meritFlawInfo.cost[meritFlawInfo.cost.length - 1]}
                                                            width={"50%"}
                                                            step={getStep(option)}
                                                            onChange={(val) => {
                                                                setPredatorData({
                                                                    ...predatorData,
                                                                    selectableMeritFlaw: {
                                                                        ...predatorData.selectableMeritFlaw,
                                                                        options: predatorData.selectableMeritFlaw.options.map((b: any) =>
                                                                            b.id === option.id
                                                                                ? { ...b, freebiePoints: val }
                                                                                : b
                                                                        ),
                                                                    },
                                                                });

                                                            }}
                                                        />
                                                    </Group>
                                                </div>
                                            )
                                        }
                                    })}
                                </Stack>
                            </Group>
                        </>
                    )
                })()}

                {PredatorTypes[pickedPredatorType].humanityChange !== 0 ?
                    <>
                        <Divider my="sm" />
                        <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                            <b>Humanity Change:</b> {PredatorTypes[pickedPredatorType].humanityChange}
                        </Text>
                    </>

                    : null}


            </Stack>

            <Divider my="sm" />

            <Button
                disabled={!(pass)}
                onClick={() => {
                    // Filter out options with freebiePoints <= 0
                    const selectableBackgrounds = predatorData.selectableBackground.options.filter((option: any) => option.freebiePoints > 0);
                    const selectableMeritFlaw = predatorData.selectableMeritFlaw.options.filter((option: any) => option.freebiePoints > 0);

                    // Combine predatorData.backgrounds and the filtered selectableBackgrounds
                    const combinedBackgrounds = [
                        ...predatorData.backgrounds,
                        ...selectableBackgrounds
                    ];
                    const combinedMeritsFlaws = [
                        ...predatorData.meritsAndFlaws,
                        ...selectableMeritFlaw
                    ];
                    setKindred({
                        ...kindred,
                        predatorType: predatorData.name as PredatorTypeName,
                        backgrounds: combinedBackgrounds,
                        meritsFlaws: combinedMeritsFlaws,
                        humanity: {
                            ...kindred.humanity,
                            creationPoints: 7 + PredatorTypes[pickedPredatorType].humanityChange
                        }
                    });
                    nextStep();
                }}
            >Confirm Predator Type</Button>
        </Modal>
    )

}

export default PredatorModal