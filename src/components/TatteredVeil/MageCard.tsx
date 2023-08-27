//Technical Imports
import { Center, Alert, Grid, Stack, Avatar, Group, Image, Text } from "@mantine/core"
//Data Imports
import { Awakened } from "../../data/TatteredVeil/types/Awakened"
import { Paths } from "../../data/TatteredVeil/types/Path"
import { Orders } from "../../data/TatteredVeil/types/Order"

type MageCardProps = {
    awakened: Awakened
}

const MageCard = ({awakened}: MageCardProps ) => {
    const conStatus = awakened.merits.filter(
        (merit) => merit.name === "Status (Consilium)"
      );
      return (
        <Center key={awakened.uid}>
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
                      src={awakened.background.profilePic}
                      size="50px"
                      radius="xl"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${Paths[awakened.path].color}, ${Orders[awakened.order].color})`,
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
                        src={Paths[awakened.path].rune}
                        style={{
                          opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                        }}
                      />
                      <Image
                        fit="contain"
                        height={30}
                        width={30}
                        src={Orders[awakened.order].rune}
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
                  <Group><Text size="sm" weight={700}>{awakened.name}</Text> <Text size='xs' fs="italic">{awakened.background.publicTitle}</Text></Group>
                  <Text size="xs">{awakened.background.publicIntro}</Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Alert>
        </Center>
      );
  
}

export default MageCard