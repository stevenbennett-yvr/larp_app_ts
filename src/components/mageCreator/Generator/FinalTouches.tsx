//technical imports
import { useState } from "react";
import { Alert, Avatar, Button, Center, Checkbox, Grid, Group, Image, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { globals } from "../../../globals";
import { Awakened } from "../data/Awakened";
import { storage } from '../../../contexts/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

//css imports
import { Paths } from "../data/Path";
import { Orders } from "../data/Order";
import { getAuth } from "firebase/auth";

type FinalTouchesProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    backStep: () => void
    nextStep: () => void
}

const FinalTouches = ({awakened, setAwakened, backStep, nextStep}: FinalTouchesProps) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const {currentUser} = getAuth()

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

  const uploadImage = async() => {
    await Promise.all(
      files.map(image=>{
        const imageRef = ref(storage, `mage/${currentUser?.uid}/${image.path}`);
        uploadBytes(imageRef, image, {contentType: 'image/jpeg'}).then(async()=> {
          const downloadURL = await getDownloadURL(imageRef)
          setAwakened({
            ...awakened,
            background: { ...awakened.background, profilePic: downloadURL },
            })
        })
      })
    )
    setFiles([])
  }

  const conStatus = awakened.merits.filter((merit) => merit.name === "Status (Consilium)")

  console.log(conStatus[0]?.freebiePoints)

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
      <Stack>

          <Alert color="gray" title="ST Info" style={{width:"400px"}}>

          <Textarea
              label="Character Backstory"
              placeholder="Autosize with 4 rows max"
              autosize
              minRows={2}
              maxRows={4}
              value={awakened.background.history}
              onChange={(event) =>
                  setAwakened({
                  ...awakened,
                  background: { ...awakened.background, history: event.target.value },
                  })
              }
          />

          <Textarea
              label="Character Goals"
              placeholder="Autosize with 4 rows max"
              autosize
              minRows={2}
              maxRows={4}
              value={awakened.background.goals}
              onChange={(event) =>
                  setAwakened({
                  ...awakened,
                  background: { ...awakened.background, goals: event.target.value },
                  })
              }
          />

          <Textarea
              label="Character Description"
              placeholder="Autosize with 4 rows max"
              autosize
              minRows={2}
              maxRows={4}
              value={awakened.background.description}
              onChange={(event) =>
                  setAwakened({
                  ...awakened,
                  background: { ...awakened.background, description: event.target.value },
                  })
              }
          />

          </Alert>


        <Alert color="gray" title="Public Info" style={{ width: "400px" }}>
            <Checkbox
              checked={awakened.background.showPublic}
              label="Show details to the public?"
              onChange={(event) =>
                setAwakened({
                  ...awakened,
                  background: {
                    ...awakened.background,
                    showPublic: event.currentTarget.checked,
                  },
                })
              }
            />
          <TextInput
              value={awakened.background.publicTitle}
              onChange={(event) =>
                setAwakened({
                ...awakened,
                background: { ...awakened.background, publicTitle: event.target.value },
                })
            }
              label="Character Title"
          /> 

          <Textarea
              label="Public Information"
              placeholder="Max Characters (280)"
              autosize
              minRows={2}
              maxRows={4}
              maxLength={280}
              value={awakened.background.publicIntro}
              onChange={(event) =>
                  setAwakened({
                  ...awakened,
                  background: { ...awakened.background, publicIntro: event.target.value },
                  })
              }
          />
        </Alert>

        {awakened.background.showPublic? 
              <Alert color="gray" style={{ width: "400px" }}>
              <Grid>
                <Grid.Col span={3}>
                  <Center>
                    <Stack>
                      <Text weight={700}>{awakened.name}</Text>
                      <Avatar
                        src={awakened.background.profilePic}
                        size="70px"
                        radius="xl"
                      />
                        <div className="avatar-container">
                          <div
                            className="avatar"
                            style={{
                              backgroundImage: `linear-gradient(to bottom right, ${Paths[awakened.path].color}, ${Orders[awakened.order].color})`,
                            }}
                          />
                          <div className="dots-container" style={{textAlign:"center"}}>
                            {Array.from({ length: 5 }, (_, index) => (
                              <span
                                key={index}
                                style={{

                                  color: index + 1 <= conStatus[0]?.freebiePoints ? "gold" : "",
                                }}
                              >
                                ●
                              </span>
                            ))}
                          </div>
                        </div>
                    </Stack>
                  </Center>
                </Grid.Col>
                <Grid.Col span={9}>
                  <Stack>
                    {awakened.background.publicTitle? <Text weight={500}>{awakened.background.publicTitle}</Text>: <></>}
                    {awakened.background.publicIntro? <Text>{awakened.background.publicIntro}</Text>: <></>}
                    <Group>
                      <Center>
                      <Image
                        fit="contain"
                        height={40}
                        width={40}
                        src={Paths[awakened.path].rune}
                        style={{
                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                          }}
                      />
                        <Image
                        fit="contain"
                        height={40}
                        width={40}
                          src={Orders[awakened.order].rune}
                          style={{
                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                          }}
                        />
                      </Center>
                  </Group>
                </Stack>
                </Grid.Col>
              </Grid>
            </Alert>
            : <></>}


        {awakened.background.showPublic? 
              <Alert color="gray" title="Profile Pic" style={{width:"400px"}}>
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
              :<></>}


      </Stack>

      <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
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
                      onClick={nextStep}
                  >
                      Next
                  </Button>
              </Button.Group>
          </Group>
      </Alert>
    </Center>
    )
}

export default FinalTouches