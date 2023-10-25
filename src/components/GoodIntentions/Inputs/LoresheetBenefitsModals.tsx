import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Title, Group, ScrollArea, Text, Button, Stack, Select, Modal, Tooltip, NumberInput} from "@mantine/core"
import { Benefit, Loresheet, updateSkills } from "../../../data/GoodIntentions/types/V5Loresheets"
import { useState } from "react"
import { V5SkillsKey } from "../../../data/GoodIntentions/types/V5Skills"
import { V5BackgroundRef, backgroundData } from "../../../data/GoodIntentions/types/V5Backgrounds"
import AdvantageAccordion from "./AdvantageAccordion"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type SkillSelectModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    skillModalOpened: boolean,
    closeSkillModal: () => void,
    loresheet: any,
    benefit: any,
    type: TypeCategory
}

export const SkillSelectModal = ({
    kindred,
    setKindred,
    skillModalOpened,
    closeSkillModal,
    loresheet,
    benefit,
    type,
}: SkillSelectModalProps) => {
    const [pickedSkill, setPickedSkill] = useState<V5SkillsKey>("performance");

    const handleSkillChange = (selectedSkill: V5SkillsKey) => {
        setPickedSkill(selectedSkill);
    };

    let skillSelectData: V5SkillsKey[] = []
    if (benefit.selectableSkills.length > 0) {
        benefit.selectableSkills.forEach((s:any) => {
            skillSelectData = [...skillSelectData, s.skill]
        })
    }

    const handleConfirm = () => {
        setKindred({
            ...kindred,
            skills: {
                ...kindred.skills,
                [pickedSkill]: {
                    ...kindred.skills[pickedSkill],
                    freebiePoints: 5
                }
            },
            loresheet: {
                ...kindred.loresheet,
                name: loresheet.name,
                benefits: [
                    ...kindred.loresheet.benefits,
                    {
                        name: benefit.name,
                        creationPoints: type === 'creationPoints' ? benefit.level : 0,
                        freebiePoints: 0,
                        experiencePoints: type === 'experiencePoints' ? benefit.level * 3 : 0
                    }
                ],
            },
        });
        closeSkillModal();
    };

    return (
        <Modal
            opened={skillModalOpened}
            onClose={closeSkillModal}
            size={600}
        >
            <Stack>
                <Select
                    defaultValue=""
                    data={skillSelectData}
                    value={pickedSkill}
                    dropdownPosition="bottom"
                    style={{ paddingBottom: "100px" }}
                    onChange={(val) => {
                        let skill = val as V5SkillsKey;
                        handleSkillChange(skill);
                    }}
                />
                <Button onClick={handleConfirm}>Confirm</Button>
            </Stack>
        </Modal>
    );
};

type BackgroundSelectModalProps = {
    backgroundModalOpened: boolean,
    backgroundCloseModal: () => void,
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    loresheet: Loresheet,
    benefit: Benefit
    type: TypeCategory
}

export const BackgroundSelectModal = ({
    backgroundModalOpened,
    backgroundCloseModal,
    loresheet,
    benefit,
    kindred,
    setKindred,
    type,
}: BackgroundSelectModalProps) => {

    let Totalpass = true
    let advantagePass = true

    const [benefitData, setBenefitData] = useState(benefit);

    const options = benefitData.selectableBackgrounds.options
    const totalPoints = benefitData.selectableBackgrounds.totalPoints

    let spentPoints = 0
    options.forEach((option: V5BackgroundRef) => {
        if (option.freebiePoints === 0) {
            // Check if any associated advantages have greater than 0 freebiePoints
            const hasAdvantagesWithFreebiePoints = option.advantages.some(advantage => advantage.freebiePoints > 0);
    
            if (hasAdvantagesWithFreebiePoints) {
                advantagePass = false;
                return; // No need to continue checking other options
            }
        }
        spentPoints += option.freebiePoints;
        option.advantages.forEach((advantage) => {
            spentPoints += advantage.freebiePoints
        })
    })
    const height = globals.viewportHeightPx
    return (
        <Modal
            opened={backgroundModalOpened}
            onClose={backgroundCloseModal}
            size={600}
        >
            <ScrollArea h={height - 250} w={"100%"} p={20}>
                <Stack>
                    <Group position="apart">
                        <Text maw={"80%"} fz={"xl"}>
                            {`Pick ${totalPoints} from: `}
                        </Text>
                        <Text>
                            Remaining: <Title ta={"center"} c={"red"}>{`${totalPoints - spentPoints}`}</Title>
                        </Text>
                    </Group>
                    {options.map((option: V5BackgroundRef) => {
                        if (totalPoints - spentPoints === 0) { Totalpass = true } else { Totalpass = false }
                        const backgroundInfo = backgroundData.find((entry) => entry.name === option.name)
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
                                                setBenefitData({
                                                    ...benefitData,
                                                    selectableBackgrounds: {
                                                        ...benefitData.selectableBackgrounds,
                                                        options: benefitData.selectableBackgrounds.options.map((b: any) =>
                                                            b.id === option.id ? { ...b, freebiePoints: val } : b
                                                        )
                                                    }
                                                })
                                            }}
                                            style={{ width: "100px" }}
                                        />
                                        <AdvantageAccordion kindred={kindred} setKindred={setKindred} bRef={option} type="freebiePoints" benefitData={benefitData} setBenefitData={setBenefitData} disabled={option.freebiePoints<1} />
                                    </Group>
                                </div>
                            )
                        }
                    })}

                    <Button
                        disabled={!(Totalpass) || !(advantagePass)}
                        onClick={() => {
                            const selectableBackgrounds = benefitData.selectableBackgrounds.options.filter((option: any) => option.freebiePoints > 0);
                            const combinedBackgrounds = [
                                ...kindred.backgrounds,
                                ...selectableBackgrounds
                            ]
                            setKindred({
                                ...kindred,
                                backgrounds: combinedBackgrounds,
                                skills: updateSkills(kindred, benefit).updatedSkills,
                                loresheet: {
                                    ...kindred.loresheet,
                                    name: loresheet.name,
                                    benefits: [...kindred.loresheet.benefits, {
                                        name: benefit.name, creationPoints: type==="creationPoints"?benefit.level:0, freebiePoints: 0, experiencePoints: type==="experiencePoints"? benefit.level * 3 : 0
                                    }],
                                },
                            })
                            backgroundCloseModal()
                        }}
                    >
                        Confirm
                    </Button>
                </Stack>
            </ScrollArea>
        </Modal>
    )
}