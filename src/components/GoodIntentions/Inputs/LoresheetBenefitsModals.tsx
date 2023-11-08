import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Title, Group, ScrollArea, Text, Button, Stack, Select, Modal, Tooltip, NumberInput } from "@mantine/core"
import { Benefit, Loresheet, updateSkills } from "../../../data/GoodIntentions/types/V5Loresheets"
import { useState } from "react"
import { V5SkillsKey } from "../../../data/GoodIntentions/types/V5Skills"
import { V5BackgroundRef, backgroundData, v5BackgroundLevel, mergeBackgrounds } from "../../../data/GoodIntentions/types/V5Backgrounds"
import AdvantageAccordion from "./AdvantageAccordion"
import { SphereSelectData } from "../../../data/GoodIntentions/types/V5Spheres"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type SkillSelectModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    skillModalOpened: boolean,
    closeSkillModal: () => void,
    loresheet: Loresheet,
    benefit: Benefit,
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
        benefit.selectableSkills.forEach((s: any) => {
            skillSelectData = [...skillSelectData, s.skill]
        })
    }

    console.log(skillSelectData)

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
    benefitData: Benefit
    setBenefitData: (benefitData: Benefit) => void,
    type: TypeCategory
}

export const BackgroundSelectModal = ({
    backgroundModalOpened,
    backgroundCloseModal,
    loresheet,
    benefitData,
    setBenefitData,
    kindred,
    setKindred,
    type,
}: BackgroundSelectModalProps) => {

    let Totalpass = true
    let advantagePass = true

    const options = benefitData.selectableBackgrounds.options
    const totalPoints = benefitData.selectableBackgrounds.totalPoints

    let spentPoints = 0
    options.forEach((option: V5BackgroundRef) => {
        let bRef = kindred.backgrounds.find(bg => bg.name === option.name)
        if (option.loresheetFreebiePoints + (bRef ? v5BackgroundLevel(bRef).level : 0) === 0) {
            // Check if any associated advantages have greater than 0 freebiePoints
            const hasAdvantagesWithFreebiePoints = option.advantages.some(advantage => advantage.freebiePoints > 0);

            if (hasAdvantagesWithFreebiePoints) {
                advantagePass = false;
                return; // No need to continue checking other options
            }
        }
        spentPoints += option.loresheetFreebiePoints;
        option.advantages.forEach((advantage) => {
            spentPoints += advantage.loresheetFreebiePoints
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
                        let bRef = kindred.backgrounds.find(bg => bg.name === option.name && (option.name === "Herd" || option.name === "Resources"))
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
                                            <Text w={"80px"}>{option.name}</Text>
                                        </Tooltip>
                                        <NumberInput
                                            disabled={bRef && bRef.name === option.name ? v5BackgroundLevel(bRef).level === 3 : false}
                                            value={option.loresheetFreebiePoints + (bRef && bRef.name === option.name ? v5BackgroundLevel(bRef).level : 0)}
                                            min={(bRef && bRef.name === option.name ? v5BackgroundLevel(bRef).level : 0)}
                                            width={"50%"}
                                            max={totalPoints - spentPoints === 0 ? 0 : 3}
                                            onChange={(val: number) => {
                                                let trueVal = val - (bRef && bRef.name === option.name ? v5BackgroundLevel(bRef).level : 0)
                                                setBenefitData({
                                                    ...benefitData,
                                                    selectableBackgrounds: {
                                                        ...benefitData.selectableBackgrounds,
                                                        options: benefitData.selectableBackgrounds.options.map((b: any) =>
                                                            b.id === option.id ? { ...b, loresheetFreebiePoints: trueVal } : b
                                                        )
                                                    }
                                                })
                                            }}
                                            style={{ width: "80px" }}
                                        />
                                        <AdvantageAccordion kindred={kindred} setKindred={setKindred} bRef={option} oRef={bRef?bRef:null} type="loresheetFreebiePoints" benefitData={benefitData} setBenefitData={setBenefitData} disabled={option.loresheetFreebiePoints + (bRef ? v5BackgroundLevel(bRef).level : 0) === 0} />
                                        {option.name==="Allies"||option.name==="Contacts"?
                                        <Select
                                            label="Pick Sphere for Background"
                                            placeholder="Pick sphere"
                                            data={SphereSelectData}
                                            defaultValue=""
                                            style={{width:"150px"}}
                                            onChange={(val) => {
                                                setBenefitData({
                                                    ...benefitData,
                                                    selectableBackgrounds: {
                                                        ...benefitData.selectableBackgrounds,
                                                        options: benefitData.selectableBackgrounds.options.map((b: any) =>
                                                            b.id === option.id ? { ...b, sphere: val } : b
                                                        )
                                                    }
                                                })
                                            }}
                                        />
                                        :<></>}
                                    </Group>
                                </div>
                            )
                        }
                    })}

                    <Button
                        disabled={!(Totalpass) || !(advantagePass)}
                        onClick={() => {
                            const loresheetBackgrounds = benefitData.selectableBackgrounds.options.filter((option: any) => option.loresheetFreebiePoints > 0 || option.advantages.length > 0);

                            const matchingBackgrounds = kindred.backgrounds.filter((background: any) =>
                                loresheetBackgrounds.some((loresheet) => loresheet.name === background.name && (loresheet.name === "Herd" || loresheet.name === "Resources"))
                            );
                            
                            let selectableBackgrounds:any[] = [];
                            
                            if (matchingBackgrounds.length > 0) {
                                selectableBackgrounds = matchingBackgrounds.map((matchingBg) =>
                                    mergeBackgrounds(
                                        `${matchingBg.name}_merged_id`,
                                        matchingBg,
                                        ...loresheetBackgrounds.filter((option) => option.name === matchingBg.name)
                                    )
                                );
                            }
                            
                            let final = selectableBackgrounds.concat(loresheetBackgrounds)

                            const combinedBackgrounds = [...kindred.backgrounds, ...final];
                            
                            setKindred({
                                ...kindred,
                                backgrounds: combinedBackgrounds,
                                skills: updateSkills(kindred, benefitData).updatedSkills,
                                loresheet: {
                                    ...kindred.loresheet,
                                    name: loresheet.name,
                                    benefits: [...kindred.loresheet.benefits, {
                                        name: benefitData.name, creationPoints: type === "creationPoints" ? benefitData.level : 0, freebiePoints: 0, experiencePoints: type === "experiencePoints" ? benefitData.level * 3 : 0
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