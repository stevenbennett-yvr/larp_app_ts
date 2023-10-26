import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Card, Text, Button, Stack } from "@mantine/core"
import { Loresheet, buyBenefit, updateBackgrounds, updateSkills, updateMeritsFlaws, emptyBenefit } from "../../../data/GoodIntentions/types/V5Loresheets"
import { useState } from "react"
import { SkillSelectModal, BackgroundSelectModal } from "./LoresheetBenefitsModals"

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type LoresheetCardProps = {
    loresheet: Loresheet,
    setOpenLoresheetTitle: (t: string) => void,
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    type: TypeCategory
}

const LoresheetCard = ({ loresheet, setOpenLoresheetTitle, kindred, setKindred, type }: LoresheetCardProps) => {
    const [skillModalOpened, setModalOpen] = useState(false);
    const closeSkillModal = () => {
        setModalOpen(false);
    };

    const [backgroundModalOpened, setBackgroundModalOpen] = useState(false);
    const backgroundCloseModal = () => {
        setBackgroundModalOpen(false);
    };

    const [chosenBenefit, setChosenBenefit] = useState<any>(emptyBenefit)
    
    return (
        <div style={{ padding: "20px" }}>
            <Text ta={"center"} fz={globals.largeFontSize}>
                {loresheet.name}
            </Text>
            <Stack>
                {loresheet.benefits.map((benefit) => (
                    <Card key={benefit.name} style={{ minHeight: "200px" }}>
                        <Text fz={"sm"}>{benefit.name}: {benefit.description}</Text>
                        {kindred.loresheet.benefits.find((b) => b.name === benefit.name) ? (
                            // Deselect button
                            <Button
                                disabled={type==="experiencePoints" && kindred.loresheet.benefits.find((b) => b.name === benefit.name)?.experiencePoints === 0}
                                onClick={() => {
                                    const filteredBenefits = kindred.loresheet.benefits.filter(
                                        (b) => b.name !== benefit.name
                                    );
                                    if (filteredBenefits.length === 0) {
                                        setKindred({
                                            ...kindred,
                                            loresheet: {
                                                name: "",
                                                benefits: [],
                                            },
                                            skills: updateSkills(kindred, benefit).filteredSkills,
                                            backgrounds: updateBackgrounds(kindred, benefit).filteredBackgrounds,
                                            meritsFlaws: updateMeritsFlaws(kindred, benefit).filteredMerits,
                                        });
                                    } else {
                                        setKindred({
                                            ...kindred,
                                            loresheet: {
                                                ...kindred.loresheet,
                                                name: loresheet.name,
                                                benefits: filteredBenefits,
                                            },
                                            skills: updateSkills(kindred, benefit).filteredSkills,
                                            backgrounds: updateBackgrounds(kindred, benefit).filteredBackgrounds,
                                            meritsFlaws: updateMeritsFlaws(kindred, benefit).filteredMerits,
                                        });
                                    }
                                }}

                            >
                                Deselect
                            </Button>
                        ) : (
                            // Buy button
                            <Button
                                onClick={() => {
                                    if (benefit.selectableSkills.length > 0) {
                                        setChosenBenefit(benefit)
                                        setModalOpen(true);
                                    } else if (benefit.selectableBackgrounds.options.length > 0) {
                                        setChosenBenefit(benefit)
                                        setBackgroundModalOpen(true);
                                    } else {
                                        buyBenefit(kindred, loresheet, benefit, type, setKindred);
                                    }
                                }}
                            >
                                Buy (cost: {benefit.level})
                            </Button>
                        )}
                        {chosenBenefit.selectableSkills.length > 0 ?
                            <SkillSelectModal kindred={kindred} setKindred={setKindred} skillModalOpened={skillModalOpened} closeSkillModal={closeSkillModal} loresheet={loresheet} benefit={benefit} type={type} />
                            : <></>}
                        {chosenBenefit.selectableBackgrounds.options.length > 0 ?
                            <BackgroundSelectModal backgroundModalOpened={backgroundModalOpened} backgroundCloseModal={backgroundCloseModal} kindred={kindred} setKindred={setKindred} loresheet={loresheet} benefitData={chosenBenefit} setBenefitData={setChosenBenefit} type={type} />
                            : <></>}
                    </Card>
                ))}
            </Stack>

            <Button variant="outline" color="yellow" mt={35} onClick={() => setOpenLoresheetTitle("")}>
                Back
            </Button>


        </div>
    )
}

export default LoresheetCard