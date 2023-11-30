import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { Text, Image, SimpleGrid, Button } from '@mantine/core';
import { useState } from 'react';
import { GoodIntentionsVenueStyleSheet } from '../../data/CaM/types/VSS';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from "../../contexts/firebase";

type setVssProps = {
  vssData: GoodIntentionsVenueStyleSheet;
  setVssData: (vssData: GoodIntentionsVenueStyleSheet) => void
}

function VssDropzone({vssData, setVssData}:setVssProps) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
  });

  const uploadImage = async () => {
    await Promise.all(
        files.map(async (image) => {
            const imageRef = ref(storage, `vss/${image.path}`);
            await uploadBytes(imageRef, image, { contentType: 'image/jpeg' });
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
        })
    ).then((downloadURLs) => {
        setVssData({
            ...vssData,
            venueStyleSheet: {
                ...vssData.venueStyleSheet,
                images: [...vssData.venueStyleSheet.images, ...downloadURLs],
            },
        });
        setFiles([]);
    });
};

  return (
    <div>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        <Text ta="center">Drop images here</Text>
      </Dropzone>

      <SimpleGrid cols={4} mt={previews.length > 0 ? 'xl' : 0}>
        {previews}
      </SimpleGrid>

      <Button
        onClick={uploadImage}
      >
        Upload
      </Button>
    </div>
  );
}

export default VssDropzone