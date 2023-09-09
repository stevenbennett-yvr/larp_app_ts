//Technical Imports
import { Center, Avatar, Checkbox, TextInput, Alert, Textarea, Button, Text } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { useState } from "react";
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
//Context Imports
import { storage } from "../../contexts/firebase";
import { User } from "firebase/auth";
//Data Imports
import { Awakened } from "../../data/TatteredVeil/types/Awakened"
import MageCard from "./MageCard";

type MagePublicInfoSetterProps = {
  awakened: Awakened,
  setAwakened: (awakened: Awakened) => void
  currentUser: User | null
}

const MagePublicInfoSetter = ({ awakened, setAwakened, currentUser }: MagePublicInfoSetterProps) => {
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

  const uploadImage = async () => {
    await Promise.all(
      files.map(image => {
        const imageRef = ref(storage, `mage/${currentUser?.uid}/${image.path}`);
        uploadBytes(imageRef, image, { contentType: 'image/jpeg' }).then(async () => {
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

  return (
    <>
      <Center>
        <Alert color="gray" title="Public Info" style={{ maxWidth: "400px" }}>
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
          {awakened.background.showPublic ?
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
                onChange={(event) => {
                  setAwakened({
                    ...awakened,
                    background: { ...awakened.background, publicIntro: event.target.value },
                  })
                }}
              />
            </div>
            : <></>}
        </Alert>
      </Center>

      {awakened.background.showPublic ?
        <MageCard awakened={awakened}></MageCard>
        : <></>}


      {awakened.background.showPublic ?
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
        : <></>}

    </>
  )
}

export default MagePublicInfoSetter