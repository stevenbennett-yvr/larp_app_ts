import { useState, useEffect } from "react";
import {
  Alert,
  Aside,
  Avatar,
  Center,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  ScrollArea
} from "@mantine/core";
import { globals } from "../../../globals";
import { Awakened } from "../data/Awakened";
import { Paths } from "../data/Path";
import { Orders } from "../data/Order";

type CastAsideProps = {
  domainAwakenedList: Awakened[];
  currentUser: any;
};

const CastAside = ({ domainAwakenedList, currentUser }: CastAsideProps) => {
  const filteredAwakenedList = domainAwakenedList.filter(
    (character) => character.uid !== currentUser.uid
  );

  const renderCharacterCard = (character: Awakened) => {
    const conStatus = character.merits.filter(
      (merit) => merit.name === "Status (Consilium)"
    );
    return (
      <Center key={character.uid}>
        <Alert color="gray" style={{ width: '360px' }}>
          <Grid>
            <Grid.Col span={3}>
                <Stack>
                    <Stack>
                    <div className="dots-container" style={{ textAlign: 'center', marginBottom: '-10px' }}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          style={{
                            fontSize: '10px',
                            color: index + 1 <= conStatus[0]?.freebiePoints ? 'gold' : '',
                          }}
                        >
                          ●
                        </span>
                      ))}
                    </div>
                  <Center>
                  <Avatar
                    src={character.background.profilePic}
                    size="50px"
                    radius="xl"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${Paths[character.path].color}, ${Orders[character.order].color})`,
                    }}
                  />

                  </Center>
                  </Stack>
                  <Group>
                  <Center>
                    <Image
                      fit="contain"
                      height={30}
                      width={30}
                      src={Paths[character.path].rune}
                      style={{
                        opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                      }}
                    />
                    <Image
                      fit="contain"
                      height={30}
                      width={30}
                      src={Orders[character.order].rune}
                      style={{
                        opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                      }}
                    />
                  </Center>
                </Group>
                </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
              <Stack>
                <Group><Text size="sm" weight={700}>{character.name}</Text> <Text size='xs' fs="italic">{character.background.publicTitle}</Text></Group>
                <Text size="xs">{character.background.publicIntro}</Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Alert>
      </Center>
    );
  };

  const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
  useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])
  const height = globals.viewportHeightPx

  return (
    <>
      {showAsideBar ? (
        <Aside p="md" hiddenBreakpoint="sm" width={{ xs: 400 }} style={{ zIndex: 0 }}>
        <ScrollArea h={height - 100}>

        {filteredAwakenedList.map((character) => renderCharacterCard(character))}
        </ScrollArea>
        </Aside>
      ) : (
        <></>
      )}
  </>
  );
};

export default CastAside;
