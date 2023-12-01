import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { Box, Text, BackgroundImage, Button, Title } from '@mantine/core';
import { useState } from 'react';
import { GoodIntentionsVenueStyleSheet } from '../../data/CaM/types/VSS';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from "../../contexts/firebase";

type setVssProps = {
  vssData: GoodIntentionsVenueStyleSheet;
  setVssData: (vssData: GoodIntentionsVenueStyleSheet) => void
}

function VssDropzone({ vssData, setVssData }: setVssProps) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <BackgroundImage key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)}>
      <Box w="100%" h={300}>
        <Title style={{ position: "relative", top: 250, left: 10 }}>
          {vssData.venueStyleSheet.name}
        </Title>
      </Box>
    </BackgroundImage>;
  });


  const uploadImage = async () => {
    await Promise.all(
      files.map(image => {
        const imageRef = ref(storage, `vss/${image.path}`);
        uploadBytes(imageRef, image, { contentType: 'image/jpeg' }).then(async () => {
          const downloadURL = await getDownloadURL(imageRef)
          setVssData({
            ...vssData,
            venueStyleSheet: {
              ...vssData.venueStyleSheet,
              banner: downloadURL,
            },
          });
        })
      })
    )
    setFiles([])
  }

  return (
    <div>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        <Text ta="center">Drop images here</Text>
      </Dropzone>

      {previews}

      <Button
        onClick={uploadImage}
      >
        Upload
      </Button>
    </div>
  );
}

export default VssDropzone