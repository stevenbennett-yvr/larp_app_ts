//technical imports
import { useState } from 'react'
import { Alert, Avatar, Button, Center, Group, Stack, Text, Textarea } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { globals } from "../../../globals";
import { Awakened } from "../data/Awakened";

type FinalTouchesProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    backStep: () => void
}



const FinalTouches = ({awakened, setAwakened, backStep}: FinalTouchesProps) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);

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
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
      <Stack>

          <Alert color="gray" title="ST Info" style={{width:"400px"}}>

          <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
            <Text align="center">Drop images here</Text>
          </Dropzone>

          <Center>
            {previews}
          </Center>

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
              label="Character Backstory"
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
              </Button.Group>
          </Group>
      </Alert>
    </Center>
    )
}

export default FinalTouches