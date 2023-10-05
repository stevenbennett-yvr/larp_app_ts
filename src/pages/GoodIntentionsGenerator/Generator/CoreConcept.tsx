// React-related imports
import { useState } from "react";

// Mantine core and Dropzone-related imports
import { Grid, Center, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';

// Firebase-related imports
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from "../../../contexts/firebase";

// Data-related imports
import { Kindred, Touchstone } from "../../../data/GoodIntentions/types/Kindred";
import { globals } from "../../../assets/globals";

// Components-related imports
import V5Backstory from "../../../components/GoodIntentions/V5Backstory";

// UI-related imports
import { TextInput, Alert, Button, Group, Divider, Textarea, Stack, Avatar } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// Firebase Authentication-related imports
import { getAuth } from "firebase/auth";

type CoreConceptProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}


const CoreConcept = ({ kindred, setKindred, nextStep, backStep }: CoreConceptProps) => {
    const { currentUser } = getAuth()

    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const initial = kindred.touchstones.length > 0 ? kindred.touchstones : [{ name: "", description: "", conviction: "" }]
    const [touchstones, setTouchstones] = useState<Touchstone[]>(initial)
    const [files, setFiles] = useState<FileWithPath[]>([]);

    const updateTouchstone = (i: number, updatedTouchstone: { name?: string; description?: string; conviction?: string }) => {
        const newTouchstones = [...touchstones]
        newTouchstones[i] = { ...touchstones[i], ...updatedTouchstone }
        setTouchstones(newTouchstones)
    }

    const uploadImage = async () => {
        await Promise.all(
            files.map(image => {
                const imageRef = ref(storage, `mage/${currentUser?.uid}/${image.path}`);
                uploadBytes(imageRef, image, { contentType: 'image/jpeg' }).then(async () => {
                    const downloadURL = await getDownloadURL(imageRef)
                    setKindred({
                        ...kindred,
                        backstory: { ...kindred.backstory, profilePic: downloadURL },
                    })
                })
            })
        )
        setFiles([])
    }

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Avatar
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
                size={250}
                radius="xl"
            />
        );
    });

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>

            <Stack>
                <Alert color="gray" style={{ maxWidth: "700px" }}>
                    <Grid columns={isPhoneScreen ? 4 : 8}>
                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                style={{ width: "300px" }}
                                value={kindred.name}
                                label="Name"
                                onChange={(event) => setKindred({ ...kindred, name: event.target.value })}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                style={{ width: "300px" }}
                                value={kindred.concept}
                                label="Concept"
                                onChange={(event) => setKindred({ ...kindred, concept: event.target.value })}
                            />
                        </Grid.Col>
                    </Grid>
                </Alert>

                <Stack>
                    <Alert color="gray" style={{ maxWidth: "700px" }}>
                        {touchstones.map((touchstone, i) => {
                            return (
                                <Stack key={i} mt={"20px"}>
                                    <Grid style={{ width: "100%" }}>
                                        {i !== 0 ? <Divider style={{ width: "100%" }} /> : null}

                                        {globals.isPhoneScreen ? null : (
                                            <Grid.Col span={2}>
                                                <Center style={{ height: "100%" }}>
                                                    <FontAwesomeIcon icon={faUser} className="fa-6x" />
                                                </Center>
                                            </Grid.Col>
                                        )}

                                        <Grid.Col span={globals.isPhoneScreen ? 12 : 4}>
                                            <TextInput
                                                withAsterisk
                                                style={{ width: globals.isPhoneScreen ? "100%" : "250px" }}
                                                value={touchstone.name}
                                                onChange={(event) => updateTouchstone(i, { name: event.currentTarget.value })}
                                                placeholder="Max Mustermann"
                                                label="Touchstone name"
                                            />

                                            <TextInput
                                                withAsterisk
                                                style={{ width: globals.isPhoneScreen ? "100%" : "250px" }}
                                                value={touchstone.conviction}
                                                onChange={(event) => updateTouchstone(i, { conviction: event.currentTarget.value })}
                                                placeholder="Never betray your friends"
                                                label="Conviction"
                                            />
                                        </Grid.Col>

                                        <Grid.Col span={globals.isSmallScreen ? 12 : 4} offset={globals.isSmallScreen ? 0 : 1}>
                                            <Textarea
                                                value={touchstone.description}
                                                onChange={(event) => updateTouchstone(i, { description: event.currentTarget.value })}
                                                placeholder="Your childhoood friend to whom you have made a promise to always be there for each other"
                                                label="Description"
                                                autosize
                                                minRows={4}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                    <Group>
                                        <Button
                                            compact
                                            color="red"
                                            variant="subtle"
                                            onClick={() => {
                                                const newTouchstones = [...touchstones]
                                                newTouchstones.splice(i, 1)
                                                setTouchstones(newTouchstones)
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Group>
                                </Stack>
                            )
                        })}
                        <Button
                            color="gray"
                            disabled={touchstones.length >= 3}
                            onClick={() => {
                                setTouchstones([...touchstones, { name: "", description: "", conviction: "" }])
                            }}
                        >
                            Add Touchstone
                        </Button>
                    </Alert>
                </Stack>
                <V5Backstory kindred={kindred} setKindred={setKindred} />

                <Alert color="gray" style={{ maxWidth: "700px" }}>
                    <Group grow>
                        {kindred.backstory.profilePic === ""?
                    <Center style={{ height: "100%" }}>
                        <FontAwesomeIcon icon={faUser} className="fa-6x" />
                    </Center>
                    :
                    <Center>
                    <Avatar
                        src={kindred.backstory.profilePic}
                        size={100}
                    />
                    </Center>
                    }

                    <Center>
                        <Alert color="gray" title="Profile Pic" style={{ maxWidth: "400px" }}>
                            <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
                                <Text align="center">Drop images here</Text>
                            </Dropzone>
                            <Button
                                disabled={files.length === 0}
                                onClick={uploadImage}
                            >
                                upload
                            </Button>

                            <Center>
                                {previews}
                            </Center>
                        </Alert>
                    </Center>
                    </Group>
                </Alert>


                <Alert color="dark" variant="filled" radius="xs" style={{ zIndex: 9999, padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
                    <Group>
                        <Button.Group>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={backStep}
                            >
                                Back
                            </Button>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={() => {
                                    setKindred({...kindred, touchstones})
                                    nextStep()
                                }}
                                disabled={
                                    kindred.name === "" || kindred.concept === "" ||
                                    (touchstones.length > 0 &&
                                        !touchstones.every(touchstone => touchstone.name !== "" && touchstone.conviction !== ""))
                                }
                            >
                                Next
                            </Button>
                        </Button.Group>
                    </Group>
                </Alert>

                <Stack>

                </Stack>


            </Stack>
        </Center>
    )
}

export default CoreConcept