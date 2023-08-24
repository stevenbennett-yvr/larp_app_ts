//technical imports
import { useState } from "react";
import { Alert, Avatar, Button, Center, Checkbox, Grid, Group, Image, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { globals } from "../../../assets/globals";
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { storage } from '../../../contexts/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { RichTextEditor } from '@mantine/rte'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocalStorage } from "@mantine/hooks";

//css imports
import { Paths } from "../../../data/TatteredVeil/types/Path";
import { Orders } from "../../../data/TatteredVeil/types/Order";
import { getAuth } from "firebase/auth";
import { faBookOpen, faBullseye, faMask } from "@fortawesome/free-solid-svg-icons";

type FinalTouchesProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    backStep: () => void
    nextStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const FinalTouches = ({awakened, setAwakened, backStep, nextStep, showInstructions, setShowInstructions}: FinalTouchesProps) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const {currentUser} = getAuth()

  const [richTextValue, setRichTextValue] = useLocalStorage({ 
    key: "Background",
    defaultValue: {
    history: awakened.background.history,
    goals: awakened.background.goals,
    description: awakened.background.description,
    }
  });

  const handleRichTextChange = (field:string, value:string) => {
    setRichTextValue({
        ...richTextValue,
        [field]: value,
    });
  };

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
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
      <Stack>

      <Alert color="gray">
          <Text mt={"xl"} ta="center" fz="xl" fw={700}>Final Touches</Text>
              {showInstructions && (
              <div>
                <p>{`You have the option to provide further details about your character, but it's not mandatory at this stage. If you feel comfortable with the information you've already provided and want to proceed, you can submit your character sheet now and return later to fill in these additional details.`}</p>
                <hr></hr>
                <p>{`Now, you have the opportunity to breathe life into your character by describing various aspects that make them unique and interesting. Consider their personality, background, motivations, and desires. What kind of person are they? What drives them? How did they acquire their skills and abilities? What are their defining traits?`}</p>
                <p>{`While providing these additional details, remember that brevity is important. You don't need to write an extensive backstory or a long essay. Aim to convey the essence of your character in a concise manner. Keep your backstory to less than one page and summarize your character's goals and description within a single paragraph.`}</p>
                <p>{`It's worth noting that LARP is often improvisational and dynamic. What happens during the game can shape and define your character's story. Details that emerge during the course of play can have a more significant impact than those written on your character sheet. So, while these details are important for setting the stage, be prepared for unexpected twists and turns that may occur during the LARP experience.`}</p>
              </div>
              )}
          <Center>
          <Button variant="outline" color="gray" onClick={toggleInstructions}>
              {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </Button>
          </Center>
      </Alert>

      <Center>
      <Alert color="gray" title="ST Info">

        <Text fz="lg" color="dimmed">
            <FontAwesomeIcon icon={faBookOpen} /> History
        </Text>
        <RichTextEditor
            id="rte-history"
            placeholder="How did your character come to be?"
            value={richTextValue.history}
            style={{ padding: '5px' }}
            onChange={val => handleRichTextChange('history', val)}
        />

        <Text fz="lg" color="dimmed">
            <FontAwesomeIcon icon={faBullseye} /> Goals
        </Text>
        <RichTextEditor
            id="rte-goals"
            placeholder="What does your character want to achieve?"
            value={richTextValue.goals}
            style={{ padding: '5px' }}
            onChange={val => handleRichTextChange('goals', val)}
        />

        <Text fz="lg" color="dimmed">
            <FontAwesomeIcon icon={faMask} /> Description
        </Text>
        <RichTextEditor
            id="rte-description"
            placeholder="What does your character look like?"
            value={richTextValue.description}
            style={{ padding: '5px' }}
            onChange={val => handleRichTextChange('description', val)}
        />

          </Alert>
          </Center>

              <Center>
        <Alert color="gray" title="Public Info" style={{ width: "400px" }}>
            <Checkbox
              checked={awakened.background.showPublic}
              label="Create and display Public Info card?"
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
          {awakened.background.showPublic? 
          <div>
          <TextInput
              value={awakened.background.publicTitle}
              onChange={(event) =>
                setAwakened({
                ...awakened,
                background: { ...awakened.background, publicTitle: event.target.value },
                })
            }
              label="Public Title"
          /> 

          <Textarea
              label="Public Intro"
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
          </div>
          :<></>}
        </Alert>
        </Center>


        {awakened.background.showPublic? 
          <Center>
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
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${Paths[awakened.path].color}, ${Orders[awakened.order].color})`,
                      }}
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
                    {awakened.background.publicTitle? <Text fs="italic">{awakened.background.publicTitle}</Text>: <></>}
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
            </Center>
            : <></>}


        {awakened.background.showPublic? 
        <Center>
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
              </Center>
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
                      onClick={() => {
                        setAwakened({
                          ...awakened,
                          background: {
                              ...awakened.background,
                              history: richTextValue.history,
                              goals: richTextValue.goals,
                              description: richTextValue.description,
                          },
                      });
                      nextStep()
                      }}
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