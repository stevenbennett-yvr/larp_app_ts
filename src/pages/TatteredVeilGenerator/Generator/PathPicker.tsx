import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { PathName, Paths, pathNameSchema } from "../../../data/TatteredVeil/types/Path";
import { globals } from "../../../assets/globals";
import { Alert, Stack, Button, Modal, Card, Center, Grid, useMantineTheme, Image, Title, Text } from "@mantine/core";
import { useState } from "react";
import PathSettings from "./utils/PathSettings"

type PathPickerProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    nextStep: () => void
    backStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const PathPicker = ({ awakened, setAwakened, nextStep, backStep, showInstructions, setShowInstructions}: PathPickerProps) => {
    const theme = useMantineTheme()
    const [path, setPath] = useState<PathName>(awakened.path);

    const [modalOpen, setModalOpen] = useState(false);

    const c1 = "rgba(26, 27, 30, 0.90)"

    const handleCardClick = (path: PathName) => {
        setPath(path);
        setModalOpen(true);
      };

    const handleCloseModal = () => {
    setPath('');
    setModalOpen(false);
    };

    const createPathPicker = (path: PathName, c2: string) => {
        const bgColor = theme.fn.linearGradient(0, c1, c2)

        return (
            <Grid.Col key={path} span={4}>
                <Card 
                    className="hoverCard" 
                    shadow="sm" 
                    padding="lg" 
                    radius="md"  
                    style={{ background: bgColor }}
                    onClick={() => handleCardClick(path)}
                >
                    <Card.Section>
                        <Center>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={Paths[path].logo}
                                height={250}
                                width={250}
                                alt="path"
                            />
                        </Center>
                        <Center>
                            <Title h={30} size="sm" color="dimmed" ta="center">
                                {Paths[path].name}
                            </Title>
                        </Center>
                    </Card.Section>
                </Card>
            </Grid.Col>
        )
    }

     const getColorByPath = (path: PathName) => {
        return Paths[path].color; // Retrieve the color from the Paths object
      }; 
    
    const isPhone = globals.isPhoneScreen
    const smallerFontSize = globals.smallerFontSize

    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
      };

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined}}>
            <Stack>
                <Center>
                    <Alert color="gray">
                    <Text mt={"xl"} ta="center" fz="xl" fw={700}>Path</Text>

                        {showInstructions && (
                            <div>
                            <p>{`Mages are not born to magic, they Awaken to it. The process is different for each individual, but it always involves a Journey, a Tower, and the writing of a Name.`}</p>
                            <p>{`When a mage Awakens, their soul undergoes a journey to one of the five Supernal Realms, and they are eternally changed. The Mage's `}
                            <strong>Path</strong>
                            {` represents their magical connection to the supernal world. It is through this connection that the mage draws the laws of that Realm into the mundane world, performing magic.`}</p>
                            </div>
                        )}
                    <Center>
                        <Button variant="outline" color="gray" onClick={toggleInstructions}>
                        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                        </Button>
                    </Center>
                    </Alert>
                </Center>
            <Grid grow m={0}>
                {
                    [  "Mastigos", "Obrimos", "Thyrsus", "Moros", "Acanthus", ].map((p) => pathNameSchema.parse(p)).map((path) => createPathPicker(path, getColorByPath(path)))
                }
            </Grid>

            {path && (
            <Modal
                title={Paths[path].name}
                opened={modalOpen}
                onClose={handleCloseModal}
                size={600}
                style={{
                    background: theme.fn.linearGradient(0, c1, Paths[path].color)
                  }}                
                >
                
                <div>
                <Image
                    src={Paths[path].tarot}
                    height={400}
                    width={225}
                    alt="path"
                    style={{ float: isPhone ? "none" : "right", margin: "5px" }}
                />
                <Text fz={smallerFontSize} style={{ textAlign: "left" }}>
                <div dangerouslySetInnerHTML={{ __html: Paths[path].description }} />
                </Text>
                </div>

                <Button
                    onClick={() => {
                    PathSettings({awakened, setAwakened, path})
                    setAwakened({...awakened, path, merits: [], rotes: []})
                    nextStep()
                }}
                >Confirm Path</Button>
            </Modal>
            )}
                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
                <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px"}}>
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
        </Center>
    )

}

export default PathPicker