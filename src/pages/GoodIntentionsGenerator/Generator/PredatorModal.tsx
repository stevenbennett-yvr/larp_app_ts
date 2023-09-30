import { faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons"
import { Modal, Stack, Text, Button, Title, Select } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { PredatorType, PredatorTypeName, PredatorTypes } from "../../../data/GoodIntentions/types/V5PredatorType"
import { v5BackgroundLevel, v5AdvantageLevel, V5SphereKey } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { backgroundData } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { globals } from "../../../assets/globals"
import { meritFlawData, v5MeritLevel } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws"
import { SphereSelectData } from "../../../data/GoodIntentions/types/V5Backgrounds"

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
    

    return (
        <Modal
            opened={modalOpened}
            onClose={closeModal}
            size={600}
        >
            <Stack>
                <Title style={{fontFamily:"serif", textAlign: "center" }}>{pickedPredatorType}</Title>
                <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>{PredatorTypes[pickedPredatorType].summary}</Text>
                {PredatorTypes[pickedPredatorType].backgrounds ?
                    <Stack>
                        <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>Backgrounds</Text>
                        {PredatorTypes[pickedPredatorType].backgrounds.map((background) => {
                            let backgroundInfo = backgroundData.find(entry => entry.name === background.name)
                            if (!backgroundInfo) return (null)
                            return (
                                <div key={background.id}>
                                    <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                                        <b>{background.name}</b> {v5BackgroundLevel(background).level}
                                        <div dangerouslySetInnerHTML={{ __html: backgroundInfo?.summary }} />

                                    </Text>
                                    {background.sphere && background.sphere.length > 1 ? 
                                    <Select
                                        label="Pick Sphere for Background"
                                        placeholder="Pick sphere"
                                        data={background.sphere}
                                        defaultValue=""
                                        clearable
                                        onChange={(val) => {
                                            const updatedBackground = { ...background };
                                            updatedBackground.sphere = [val as V5SphereKey];
                                            const index = predatorData.backgrounds.findIndex((b:any) => b.id === background.id);
                                            const newBackgrounds = [...predatorData.backgrounds];
                                            newBackgrounds[index] = updatedBackground;
                                            setPredatorData({...predatorData, backgrounds: newBackgrounds})
                                          }}
                                    />
                                    : 
                                    <></>}
                                {background.sphere && background.sphere.length === 0 ? 
                                    <Select
                                        label="Pick Sphere for Background"
                                        placeholder="Pick sphere"
                                        data={SphereSelectData}
                                        defaultValue=""
                                        clearable
                                        onChange={() => {

                                          }}
                                    />
                                    : 
                                    <></>}
                                    
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
                {PredatorTypes[pickedPredatorType].meritsAndFlaws.length > 0 ?
                    <Stack>
                        <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>Merits or Flaws</Text>
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
                {PredatorTypes[pickedPredatorType].humanityChange !== 0 ?
                    <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                        <b>Humanity Change:</b> {PredatorTypes[pickedPredatorType].humanityChange}
                    </Text>
                    : null}
                <Button
                    onClick={() => {
                        setKindred({
                            ...kindred, 
                            backgrounds: PredatorTypes[pickedPredatorType].backgrounds,
                            meritsFlaws: PredatorTypes[pickedPredatorType].meritsAndFlaws,
                            humanity: {...kindred.humanity, creationPoints: 7 + PredatorTypes[pickedPredatorType].humanityChange}
                        })
                        nextStep()
                    }}
                >Confirm Predator Type</Button>
            </Stack>
        </Modal>
    )

}

export default PredatorModal