import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Card, Button, Text, Center, Stack, Box } from '@mantine/core';
import { globals } from "../globals"

export default function ChooseChronicle() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedChronicle, setSelectedChronicle] = useState('');
    const navigate = useNavigate();
  
    const handleChronicleClick = (chronicle: string) => {
      setSelectedChronicle(chronicle);
      setShowPopup(true);
    };
  
    const handleClosePopup = () => {
      setShowPopup(false);
      setSelectedChronicle('');
    };
  
    const handleJoinChronicle = () => {
      if (selectedChronicle === 'TatteredVeil') {
        // Handle join Tattered Veil logic
        navigate('/create-mage');
      }
      // Add logic for other chronicles if needed
    };
  
    return (
        <Center h={globals.isPhoneScreen ? "100%" : "100%"} >
  
          {!showPopup &&
            <div>
            <Alert mt={globals.isPhoneScreen ? "75px" : "50px"} color='gray' variant='outline'>
              <Text align='center' fz={globals.largeFontSize}>Choose Chronicle</Text>
              <Text align='center' fz={globals.smallerFontSize}>
              Canada at Midnight supports several games set in the World of Darkness and these are organized by venues. All characters in the same venue, regardless of where the player physically resides can interact with and play with one another in a connected setting.
              </Text>
              <Center>
              <Box mt="xs">
              <Stack spacing="xs">
              <Button w={"200px"} onClick={() => handleChronicleClick('TatteredVeil')}>
                The Tattered Veil
              </Button>
              <Button w={"200px"} onClick={() => handleChronicleClick('LawsOfTheNight')}>
                Laws of the Night V5, TBA
              </Button>
              <Button w={"200px"} onClick={() => navigate("/")}>
                Back
              </Button>
              </Stack>
              </Box>
              </Center>
            </Alert>
            </div>
          }
        {showPopup && (
          <div className="popup" style={{ paddingTop: '100px' }}>
            <h2>{selectedChronicle === 'TatteredVeil' ? 'Mage the Awakening: Tattered Veil' : 'Laws of the Night: TBA'}</h2>
            {selectedChronicle === 'TatteredVeil' ? (
              <Card>
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
              </Card>
            ) : (
              <p>Under Construction</p>
            )}
  
            <div>
              <Button style={{ margin: '5px' }} onClick={handleJoinChronicle}>Join Tattered Veil</Button>
              <Button style={{ margin: '5px' }} onClick={handleClosePopup}>Back</Button>
            </div>
          </div>
        )}
      </Center>
    );
  }