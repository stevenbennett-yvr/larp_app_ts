import { Button, Divider, Grid, Group, Text, Tooltip, Alert } from "@mantine/core"
import { useState } from "react"
import { V5AttributesKey, attributeDescriptions, v5attributesKeySchema } from "../../../data/GoodIntentions/types/V5Attributes"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { upcase } from "../../../utils/case"

type AttributePickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void,
    backStep: () => void,
}

type AttributeSetting = {
    strongest: V5AttributesKey | null,
    weakest: V5AttributesKey | null,
    medium: V5AttributesKey[],
}

const AttributePicker = ({ kindred, setKindred, nextStep, backStep }: AttributePickerProps) => {
    const phoneScreen = globals.isPhoneScreen

    const [pickedAttributes, setPickedAttributes] = useState<AttributeSetting>({ strongest: null, weakest: null, medium: [] })

    const createButton = (attribute: V5AttributesKey, i: number) => {
        const alreadyPicked = [pickedAttributes.strongest, pickedAttributes.weakest, ...pickedAttributes.medium].includes(attribute)

        let onClick: () => void
        if (alreadyPicked) {
            onClick = () => {
                setPickedAttributes({
                    strongest: pickedAttributes.strongest === attribute ? null : pickedAttributes.strongest,
                    medium: pickedAttributes.medium.filter((it) => it !== attribute),
                    weakest: pickedAttributes.weakest === attribute ? null : pickedAttributes.weakest,
                })
            }
        }
        else if (!pickedAttributes.strongest) {
            onClick = () => {
                setPickedAttributes({ ...pickedAttributes, strongest: attribute })
            }
        } else if (!pickedAttributes.weakest) {
            onClick = () => {
                setPickedAttributes({ ...pickedAttributes, weakest: attribute })
            }
        } else if (pickedAttributes.medium.length < 2) {
            onClick = () => {
                setPickedAttributes({ ...pickedAttributes, medium: [...pickedAttributes.medium, attribute] })
            }
        } else {
            onClick = () => {
                const finalPick = { ...pickedAttributes, medium: [...pickedAttributes.medium, attribute] }
                const attributes = {
                    ...kindred.attributes,
                    strength: { ...kindred.attributes.strength, creationPoints: 2 },
                    dexterity: { ...kindred.attributes.dexterity, creationPoints: 2 },
                    stamina: { ...kindred.attributes.stamina, creationPoints: 2 },

                    charisma: { ...kindred.attributes.charisma, creationPoints: 2 },
                    manipulation: { ...kindred.attributes.manipulation, creationPoints: 2 },
                    composure: { ...kindred.attributes.composure, creationPoints: 2 },

                    intelligence: { ...kindred.attributes.intelligence, creationPoints: 2 },
                    wits: { ...kindred.attributes.wits, creationPoints: 2 },
                    resolve: { ...kindred.attributes.resolve, creationPoints: 2 },
                }
                attributes[finalPick.strongest!].creationPoints = 4
                attributes[finalPick.weakest!].creationPoints = 1
                finalPick.medium.forEach((medium) => attributes[medium].creationPoints = 3)
                setKindred({ ...kindred, attributes })
                nextStep()
            }
        }

        const dots = (() => {
            if (attribute === pickedAttributes.strongest) return "💪"
            if (attribute === pickedAttributes.weakest) return "🪶"
            if (pickedAttributes.medium.includes(attribute)) return "👌"
            return ""
        })()

        const trackClick = () => {
        }

        return (
            <Grid.Col key={attribute} span={4}>
                <Tooltip disabled={alreadyPicked} label={attributeDescriptions[attribute]} transitionProps={{ transition: 'slide-up', duration: 200 }} events={globals.tooltipTriggerEvents}>
                    <Button p={phoneScreen ? 0 : "default"} leftIcon={dots} variant={alreadyPicked ? "outline" : "filled"} color="grape" fullWidth onClick={() => { trackClick(); onClick() }}>
                        <Text fz={phoneScreen ? 12 : "inherit"}>{upcase(attribute)}</Text>
                    </Button>
                </Tooltip>

                {i % 3 === 0 || i % 3 === 1 ? <Divider size="xl" orientation="vertical" /> : null}
            </Grid.Col >
        )
    }

    const toPick = (() => {
        if (!pickedAttributes.strongest) return "strongest"
        else if (!pickedAttributes.weakest) return "weakest"
        else return "medium"
    })()

    const strongestStyle = toPick === "strongest" ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const weakestStyle = toPick === "weakest" ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const mediumStyle = toPick === "medium" ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }

    return (
        <div>
            <Text style={strongestStyle} ta={"center"}>{toPick === "strongest" ? ">" : ""} Pick your <b>strongest</b> attribute! (lvl 4)</Text>
            <Text style={weakestStyle} ta={"center"}>{toPick === "weakest" ? ">" : ""} Pick your < b > weakest</b > attribute! (lvl 1)</Text >
            <Text style={mediumStyle} ta={"center"}>{toPick === "medium" ? ">" : ""} Pick <b>{3 - pickedAttributes.medium.length} medium</b> attribute{pickedAttributes.medium.length < 2 ? "s" : ""}! (lvl 3)</Text>
            <Text style={{ fontSize: "14px", color: "grey" }} ta={"center"}>Remaining attributes will be lvl 2</Text>

            <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Attributes</Text>

            <hr color="#e03131" />

            <Group>
                <Grid grow>
                    <Grid.Col span={4}><Text fs="italic" fw={700} ta="center">Physical</Text></Grid.Col>
                    <Grid.Col span={4}><Text fs="italic" fw={700} ta="center">Social</Text></Grid.Col>
                    <Grid.Col span={4}><Text fs="italic" fw={700} ta="center">Mental</Text></Grid.Col>
                    {
                        ["strength", "charisma", "intelligence",
                            "dexterity", "manipulation", "wits",
                            "stamina", "composure", "resolve"]
                            .map((a) => v5attributesKeySchema.parse(a))
                            .map((clan, i) => createButton(clan, i))
                    }
                </Grid>
            </Group>

            <Button.Group style={{ position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
                <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
                    <Button
                        style={{ margin: "5px" }}
                        color="gray"
                        onClick={backStep}
                    >
                        Back
                    </Button>
                </Alert>
            </Button.Group>
        </div>
    )
}

export default AttributePicker