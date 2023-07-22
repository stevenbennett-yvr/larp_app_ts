import { Center, Button, Tooltip, Select, Stack, Text, TextInput, Card } from "@mantine/core"
import { useState } from "react"
import { Awakened } from "../data/Awakened"
import { VirtueName, Virtue, Virtues } from "../data/Virtues"
import { ViceName, Vice, Vices } from "../data/Vices"
import { globals } from "../../../globals"

type BasicsPickerProps = {
    awakened: Awakened,
    setAwakened: (character: Awakened) => void
    nextStep: () => void
}

const Basics = ({ awakened, setAwakened, nextStep }: BasicsPickerProps) => {

    const [name, setName] = useState(awakened.name)
    const [concept, setConcept] = useState(awakened.concept)
    const [virtue, setVirtue] = useState<VirtueName>(awakened.virtue);
    const [vice, setVice] = useState<ViceName>(awakened.vice);

    const selectedVice: Vice | undefined = Vices[vice];
    const selectedVirtue: Virtue | undefined = Virtues[virtue];
    
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '100px' : undefined}}>
            <Stack mt={"xl"} align="center" spacing="xl">
                <Text fw={700} fz={"30px"}>Come up with the basics</Text>
                <Tooltip 
                    multiline
                    width={200} 
                    position="bottom" 
                    withArrow 
                    label={`Mages rarely use their given name (its harder to work magic against someone whose given name you don't know), insead adopting a Shadow Name. This is a general moniker or call sign. Feel free to provide one or the other or both below.`}
                    events={globals.tooltipTriggerEvents}
                    >
                        <TextInput
                            style={{ width: "300px" }}
                            value={name}
                            onChange={(event) => setName(event.currentTarget.value)}
                            label="Shadow Name"
                        /> 
                </Tooltip>

                <Tooltip 
                    multiline
                    width={200} 
                    position="bottom" 
                    withArrow 
                    label={`A concept is generally an adjective and a noun that describes your character...`}
                    events={globals.tooltipTriggerEvents}
                    >
                        <TextInput
                            style={{ width: "300px" }}
                            value={concept}
                            onChange={(event) => setConcept(event.currentTarget.value)}
                            label="Concept"
                        />

                </Tooltip>

                <Tooltip 
                    multiline
                    width={200} 
                    position="top" 
                    withArrow 
                    label={`When creating your character, choose one of the seven Virtues detailed here...`}
                    events={globals.tooltipTriggerEvents}
                    >
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
                                }
                            })}
                            style={{ width: "300px" }}
                            value={virtue}
                            onChange={(value: VirtueName | null) => setVirtue(value || "")}
                            label="What is your greatest strength?"
                            placeholder='Pick one'
                            data={[
                                { value:"Charity", label:"Charity" },
                                { value:"Faith", label:"Faith" },
                                { value:"Fortitude", label:"Fortitude" },
                                { value:"Hope", label:"Hope" },
                                { value:"Justice", label:"Justice" },
                                { value:"Prudence", label:"Prudence" },
                                { value:"Temperance", label:"Temperance" },
                            ]}
                        />
                </Tooltip>
                
                <Card shadow="md" style={{ width: "350px", minHeight: "100px" }}>
                    {selectedVirtue && (
                        <Text size="sm" dangerouslySetInnerHTML={{ __html: selectedVirtue.description }}></Text>
                    )}
                </Card>

                <Tooltip 
                    multiline
                    width={200} 
                    position="top"
                    withArrow 
                    label={`When creating your character, choose one of the seven Vices detailed below as her defining one...`}
                    events={globals.tooltipTriggerEvents}
                    >
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
                                }
                            })}
                            dropdownPosition="bottom"
                            style={{ width: "300px" }}
                            value={vice}
                            onChange={(value: ViceName | null) => setVice(value || "")}
                            label="What is your greatest strength?"
                            placeholder='Pick one'
                            data={[
                                { value:"Envy", label:"Envy" },
                                { value:"Gluttony", label:"Gluttony" },
                                { value:"Greed", label:"Greed" },
                                { value:"Lust", label:"Lust" },
                                { value:"Pride", label:"Pride" },
                                { value:"Sloth", label:"Sloth" },
                                { value:"Wrath", label:"Wrath" },
                            ]}
                        />
                </Tooltip>

                <Card shadow="md" style={{ width: "350px", minHeight: "100px" }}>
                    {selectedVice && (
                        <Text style={{ margin: "10px" }} size="sm" dangerouslySetInnerHTML={{ __html: selectedVice.description }}></Text>
                        )}
                </Card>


            </Stack>


            <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
                <Button 
                    style={{ margin: "5px" }}
                    disabled={!name || !concept || !virtue || !vice} 
                    color="gray" onClick={() => {
                    setAwakened({ ...awakened, name, concept, virtue, vice })
                    nextStep()}}
                >
                Next
                </Button>
            </Button.Group>
        </Center>
    )
}

export default Basics