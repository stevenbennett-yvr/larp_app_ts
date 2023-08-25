import { Alert, Grid, Center, Button, Tooltip, Select, Stack, Text, TextInput } from "@mantine/core"
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { VirtueName, Virtue, Virtues } from "../../../data/TatteredVeil/types/Virtues"
import { ViceName, Vice, Vices } from "../../../data/TatteredVeil/types/Vices"
import { globals } from "../../../assets/globals"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignature, faLightbulb, faDove, faSyringe } from '@fortawesome/free-solid-svg-icons'


type BasicsPickerProps = {
    awakened: Awakened,
    setAwakened: (character: Awakened) => void
    nextStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const Basics = ({ awakened, setAwakened, nextStep, showInstructions, setShowInstructions }: BasicsPickerProps) => {

    const selectedVice: Vice | undefined = Vices[awakened.vice];
    const selectedVirtue: Virtue | undefined = Virtues[awakened.virtue];
    
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
      };
    
    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
            <Stack mt={"xl"} align="center" spacing="xl">
                

            <Alert color="gray">
                <Stack>
                <Text mt={"xl"} ta="center" fz="xl" fw={700} style={{marginTop:"0px"}}>Basics</Text>
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
                <Center>
                <Button variant="outline" color="gray" onClick={toggleInstructions}>
                    {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                </Button>
                </Center>
                </Stack>
            </Alert>

                <Grid columns={globals.isPhoneScreen?4:8}>
                    <Grid.Col span={4}>
                        <Center>
                        <Stack>
                        <div>
                        <Tooltip
                            multiline
                            inline
                            width={200}
                            withArrow
                            events={{ hover: true, focus: true, touch: true }}
                            label={`Mages rarely use their given name (its harder to work magic against someone whose given name you don't know), insead adopting a Shadow Name. This is a general moniker or call sign. Feel free to provide one or the other or both below.`}
                        >
                        <TextInput
                            style={{ width: "300px" }}
                            value={awakened.name}
                            label={
                                <Text
                                fz="lg"
                                color="dimmed"
                                >
                                <FontAwesomeIcon icon={faSignature} /> Shadow Name
                                </Text>
                            }
                            onChange={(event) => setAwakened({ ...awakened, name:event.currentTarget.value})}
                        />
                        </Tooltip>
                        </div>
                        </Stack>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Center>
                        <Tooltip 
                            multiline
                            width={200} 
                            withArrow
                            label={`A concept is generally an adjective and a noun that describes your character...`}
                            events={{ hover: true, focus: true, touch: true }}
                            >
                                <TextInput
                                    style={{ width: "300px" }}
                                    value={awakened.concept}
                                    onChange={(event) => setAwakened({...awakened, concept:event.currentTarget.value})}
                                    label={
                                        <Text
                                        fz="lg"
                                        color="dimmed"
                                        >
                                        <FontAwesomeIcon icon={faLightbulb} /> Concept
                                        </Text>
                                    }
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
                            events={{ hover: true, focus: true, touch: true }}
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
                                    value={awakened.virtue}
                                    onChange={(value: VirtueName | null) => setAwakened({...awakened, virtue:value || ""})}
                                    label={
                                        <Text
                                        fz="lg"
                                        color="dimmed"
                                        >
                                        <FontAwesomeIcon icon={faDove} /> Virtue
                                        </Text>
                                    }
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
                            events={{ hover: true, focus: true, touch: true }}
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
                                    value={awakened.vice}
                                    onChange={(value: ViceName | null) => setAwakened({...awakened, vice:value || ""})}
                                    label={
                                        <Text
                                        fz="lg"
                                        color="dimmed"
                                        >
                                        <FontAwesomeIcon icon={faSyringe} /> Vice
                                        </Text>
                                    }
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
                    disabled={!awakened.name || !awakened.concept || !awakened.virtue || !awakened.vice} 
                    color="gray" onClick={() => {
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