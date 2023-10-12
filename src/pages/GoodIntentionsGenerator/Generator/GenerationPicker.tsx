import { Button, Select, Space, Stack, Text, Alert, Table } from "@mantine/core"
import { useState } from "react"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { generations } from "../../../data/GoodIntentions/types/V5Generation"

type GenerationPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const GenerationPicker = ({ kindred, setKindred, nextStep, backStep }: GenerationPickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const [generation, setGeneration] = useState<string | null>(kindred.clan === 'Thin-Blood' ? '14' : '13');
    const showAlert = generation === '9';
    const selectData =
        kindred.clan === "Thin-Blood" ?
            [
                { value: '16', label: '16: Thin-blood' },
                { value: '15', label: '15: Thin-blood' },
                { value: '14', label: '14: Thin-blood' },
            ] :
            [
                { value: '13', label: '13: Fledgeling - Newly Embraced' },
                { value: '12', label: '12: Fledgeling - Newly Embraced' },
                { value: '11', label: '11: Neonate - Been a while' },
                { value: '10', label: '10: Neonate - Been a while' },
                { value: '9', label: '9: Ancillae - I barely remember' }
            ]

    const handleGenerationChange = (generation: string | null) => {
        if (generation === null) { return }
        let genInt = parseInt(generation ?? "0")
        let creationPoints = genInt < 14 ? 1 : 0;
        let experiencePoints = genInt < 10 ? 20 : 0;
        console.log(creationPoints)
        setKindred({
            ...kindred,
            generation: genInt,
            bloodPotency: { ...kindred.bloodPotency, creationPoints, experiencePoints }
        })
    }

    return (
        <div style={{ width: "100%" }}>
            <Text fz={"30px"} ta={"center"}>Pick your <b>Generation</b></Text>
            {kindred.clan === "Thin-Blood" ? <></> :
                <Text style={{ fontSize: "25px", color: "grey" }} ta={"center"}>Most common choice is &apos;13 - Neonate&apos;</Text>
            }

            <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Generation</Text>
            <hr color="#e03131" />
            <Space h={"sm"} />

            <Table>
                <thead>
                    <tr>
                        <th>Generation</th>
                        <th>Minimum Blood Potency</th>
                        <th>Maximum Blood Potency</th>
                    </tr>
                    <tr>
                        <td>{generations[parseInt(generation ?? "0")].generation}</td>
                        <td>{generations[parseInt(generation ?? "0")].min_bp}</td>
                        <td>{generations[parseInt(generation ?? "0")].max_bp}</td>
                    </tr>
                </thead>
            </Table>

            <Stack align="center" spacing="xl">
                <Select
                    styles={(theme) => ({
                        item: {
                            // applies styles to selected item
                            '&[data-selected]': {
                                '&, &:hover': {
                                    backgroundColor: theme.colors.grape,
                                    color: theme.colors.white,
                                },
                            },

                            // applies styles to hovered item (with mouse or keyboard)
                            '&[data-hovered]': {},
                        },
                    })}
                    style={{ width: "100%" }}
                    value={generation}
                    onChange={(val) => {
                        setGeneration(val)
                        handleGenerationChange(val)
                    }}
                    label="When were you turned?"
                    placeholder="Pick one"
                    data={selectData}
                />

                {showAlert && (
                    <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
                        <div style={{ color: "red" }}>9th Generations must begin play with two dots of Blood Potency. 20 starting XP will be spent to purchase your second dot of Blood Potency.</div>
                    </Alert>
                )}

                <Button disabled={generation === null} color="grape" onClick={() => {
                    handleGenerationChange(generation)
                    nextStep()
                }}>Confirm</Button>

                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
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

            </Stack>
        </div>
    )
}

export default GenerationPicker