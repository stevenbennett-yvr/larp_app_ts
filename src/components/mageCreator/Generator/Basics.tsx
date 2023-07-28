import { Alert, Grid, Center, Button, Tooltip, Select, Stack, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import { Awakened } from "../data/Awakened"
import { VirtueName, Virtue, Virtues } from "../data/Virtues"
import { ViceName, Vice, Vices } from "../data/Vices"
import { globals } from "../../../globals"

type BasicsPickerProps = {
    awakened: Awakened,
    setAwakened: (character: Awakened) => void
    nextStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const Basics = ({ awakened, setAwakened, nextStep, showInstructions, setShowInstructions }: BasicsPickerProps) => {

    const [name, setName] = useState(awakened.name)
    const [concept, setConcept] = useState(awakened.concept)
    const [virtue, setVirtue] = useState<VirtueName>(awakened.virtue);
    const [vice, setVice] = useState<ViceName>(awakened.vice);

    const selectedVice: Vice | undefined = Vices[vice];
    const selectedVirtue: Virtue | undefined = Virtues[virtue];
    
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
      };

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
            <Stack mt={"xl"} align="center" spacing="xl">
                

            <Alert color="gray">
                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Basics</Text>
                <Button color="gray" onClick={toggleInstructions}>
                    {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                </Button>
                    {showInstructions && (
                    <div>
                        <p>{`With this, you are building a character to act as your persona in `}<u>Tattered Veil</u>{`. It is more important to craft the character around your vision of their personality, background, and quirks rather than putting together the perfect wizard based on some tactical scheme.`}</p>
                        <p>{`Your allocation of traits should illustrate who they are and what they were in life.`}</p>
                        <Text mt="xl" ta="center" fz="xl" fw={700}>
                            Concept
                        </Text>
                        <p>What do you want to be? What do you want to do?</p>
                        <p>{`Your Character Concept is a short descriptor that informs you and the storyteller about what your character is about.`}</p>
                        <p>{`Generally, this consists of two to three words, including an adjective and noun, which could include a career. Examples include "Amiable Vagrant," "Drug-Addled Detective," "Captivating Socialite," "Fierce Campaigner," "Murderous Haberdasher," "Sesquipedalian Storyteller."`}</p>
                        <p>{`Don't stress about the exact details. Keep it simple for now and use the concept as a guiding light.`}</p>
                        <p>{`Next, consider what their defining strengths and weaknesses are. These inform your Virtue and Vice. Acting out either in a difficult situation reinforces your character's fundamental self and earns you Willpower, a beneficial resource.`}</p>
                    </div>
                    )}
            </Alert>

                <Grid columns={globals.isPhoneScreen?4:8}>
                    <Grid.Col span={4}>
                        <Center>
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
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Center>
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
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Center>
                        <Stack>
                        <Tooltip 
                            multiline
                            width={200} 
                            position="top" 
                            withArrow 
                            label={`When creating your character, choose one of the seven Virtues detailed here...`}
                            events={globals.tooltipTriggerEvents}
                            >
                                <Center>
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
                                    label="Virtue"
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
                                </Center>
                        </Tooltip>
                
                        <Alert color="gray" style={{ width: "350px", minHeight: "100px", padding:"5px" }}>
                            {selectedVirtue && (
                                <Text style={{ margin: "10px" }} size="sm" dangerouslySetInnerHTML={{ __html: selectedVirtue.description }}></Text>
                            )}
                        </Alert>
                        </Stack>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Center>
                            <Stack>
                        <Tooltip 
                            multiline
                            width={200} 
                            position="top"
                            withArrow 
                            label={`When creating your character, choose one of the seven Vices detailed below as her defining one...`}
                            events={globals.tooltipTriggerEvents}
                            >
                                <Center>
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
                                    label="Vice"
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
                                </Center>
                        </Tooltip>

                        <Alert color="gray" style={{ width: "350px", minHeight: "100px", padding:"5px" }}>
                            {selectedVice && (
                                <Text style={{ margin: "10px" }} size="sm" dangerouslySetInnerHTML={{ __html: selectedVice.description }}></Text>
                                )}
                        </Alert>
                        </Stack>
                        </Center>
                    </Grid.Col>
                </Grid>

            </Stack>


            <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
            <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px"}}>
                <Button 
                    style={{ margin: "5px" }}
                    disabled={!name || !concept || !virtue || !vice} 
                    color="gray" onClick={() => {
                    setAwakened({ ...awakened, name, concept, virtue, vice })
                    nextStep()}}
                >
                Next
                </Button>
            </Alert>
            </Button.Group>
        </Center>
    )
}

export default Basics