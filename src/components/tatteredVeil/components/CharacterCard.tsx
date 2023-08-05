import { Awakened } from '../data/Awakened';
import { Paths } from '../data/Path';
import { Orders } from '../data/Order';
import { Alert, Grid, Center, Stack, Text, Avatar, Image, Group, Button, Modal } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { globals } from '../../../globals';

type CharacterCardProps = {
  awakenedList: Awakened[];
};

const CharacterCard = ({ awakenedList }: CharacterCardProps) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
  setModalOpen(false);
  };

  if (awakenedList.length === 0) {
    return (
      <div>
      <Center>
        <Button size="lg" variant="outline" onClick={() => handleCardClick()}>
          Join Chroncicle
        </Button>
      </Center>

      <Modal
        opened={modalOpen}
        onClose={handleCloseModal}
        size={'55%'}        
        >
          <Center>
            <Stack>
            <Text fz={globals.smallerFontSize}>
                <p>On <u>March 27, 2023</u>, nine different lights shone in the night sky. Illuminating the world beneath with a noonday intensity a brief moment. Then each burst into hundreds of pieces before dissipating completely. Space agencies, astronomers, and others are still baffled by the anomaly. There was nothing in Earths vicinity that could have produced one, let alone all nine of the lights. Today its better known as <u>the Night of a Thousand Suns.</u> </p>
                <p>The event lingers in memory. Everyone knew something had changed. There was something different to the air. A new intensity. But even if they were conscious of it, curious of it, most continued their daily lives as normal. In the weeks and months to come, their feelings would become reality.</p>
                <p>Other Anomalies began to appear, of a more terrestrial nature. Stories of which would spread via rumor and on social media. Someone`s aunt would claim to be having strange dreams. Said she could see the electricity running through the circuits in her home. Later found her home burned down, with no sign of her body. Stories in the paper of a man with blossoming branches growing out of his skin. Doctors don`t know what to make of it.</p>
                <p>Many more stories of mysterious organizations intervening. Moving in to take control of these “Anomalies”. Shutting down neighborhoods with claims of gas leaks and black vans. Victims dissappearing.</p>
                <p>Most people don`t have the drive to seek out and learn what, exactly, is going on. For those who do, they lack the resources or knowledge to even begin. Most wouldn`t even know where to start.</p>
                <p><b>You are not most people.</b> You are a Mage, one of the Awakened, a member of the Pentacle. You saw through the lie of reality. Glimpsing the truth before being pulled back into the world. You know, what is going on.</p>
                <p>The Veil, the metaphorical barrier between the natural and supernatural, is thinning. It is becoming less of a rule and more of a suggestion as time goes on.</p>
                <p>
                  This is a game where the future of the Veil is at stake. The characters could fix it all, allowing Mages
                  to keep their secrets and build a more deeply hidden world for the Awakened… or perhaps this could be the
                  time to make Magic known to the world as a whole.
                </p>
                <Button variant='link' onClick={() => window.open("https://docs.google.com/document/d/14Bj_az4YHf7G4utiwAK0-QMoYzok5gd5mbtsjngQ43I/edit?fbclid=IwAR30HBal5Y5idKduuIF2dUemWY3Kiggb-OGIW2yX7B2ZDYwbGbEwNoQEBa0")}>For more information on this chroncile, click here.</Button>
              </Text>
              <Button style={{ margin: '5px', width: '150px' }} onClick={() => {navigate('/create-mage');}}>Create Character</Button>
              </Stack>
          </Center>
      </Modal>
      </div>
    );
  }
  
  return (
    <>
      {awakenedList.map((character) => {
        const conStatus = character.merits.filter((merit) => merit.name === 'Status (Consilium)');

        return (
          <Center>
          <Alert color="gray" style={{ width: '400px' }} key={character.uid}>
            <Grid>
              <Grid.Col span={3}>
                <Center>
                  <Stack>
                    <Text weight={700}>{character.name}</Text>
                    <Avatar src={character.background.profilePic} size="70px" radius="xl" />
                    <div className="avatar-container">
                      <div
                        className="avatar"
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, ${Paths[character.path].color}, ${Orders[character.order].color})`,
                        }}
                      />
                      <div className="dots-container" style={{ textAlign: 'center' }}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            style={{
                              color: index + 1 <= conStatus[0]?.freebiePoints ? 'gold' : '',
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
                  {character.background.publicTitle ? <Text fs="italic">{character.background.publicTitle}</Text> : null}
                  {character.background.publicIntro ? <Text>{character.background.publicIntro}</Text> : null}
                  <Group>
                    <Center>
                      <Image
                        fit="contain"
                        height={40}
                        width={40}
                        src={Paths[character.path].rune}
                        style={{
                          opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                        }}
                      />
                      <Image
                        fit="contain"
                        height={40}
                        width={40}
                        src={Orders[character.order].rune}
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
        );
      })}
    </>
  );
};

export default CharacterCard;
