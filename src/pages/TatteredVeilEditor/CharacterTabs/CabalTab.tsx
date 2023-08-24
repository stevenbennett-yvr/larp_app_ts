//technical imports
import { Accordion, Table, Textarea, Avatar, Image, Alert, Button, Center, Text, Modal, Group, TextInput, MultiSelect, Stack, Grid } from "@mantine/core";

import React, { useState, forwardRef } from "react";
import { useCabalDb } from "../../../contexts/CabalContext";
import { globals } from "../../../assets/globals";

import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { Orders } from "../../../data/TatteredVeil/types/Order";
import { Paths } from "../../../data/TatteredVeil/types/Path";
import { CabalMember, Cabal, handleAcceptInvite, handleRejectInvite, handleCreateCabal, handleLeaveCabal } from "../../../data/TatteredVeil/types/Cabals";
import { currentMeritLevel, Merit } from "../../../data/TatteredVeil/types/Merits";

type CabalEditProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    domainAwakenedList: Awakened[]
    cabalData: Cabal
    setCabalData: (cabalData: Cabal) => void
    inviteData: Cabal
    setInviteData: (inviteData: Cabal) => void
}

const CabalTab = ({awakened, domainAwakenedList, cabalData, setCabalData, inviteData, setInviteData}: CabalEditProps) => {
  const { getCabalInvitations, updateCabal, onSubmitCabal } = useCabalDb()
  const [showInvite, setShowInvite] = useState<boolean>(inviteData.invitations.includes(awakened.id?awakened.id:""));

  const handleUpdateCabal = () => {
    if (cabalData.id) {
    updateCabal(cabalData.id, cabalData)
    }
  }

  const inviteModal = () => {
    if (inviteData) {
      return (
        <Modal opened={showInvite} onClose={() => setShowInvite(false)}>
          <Text mt="xl" ta="center" fz="xl" fw={700}>
            Invite Received
          </Text>
          <p>
            You have received an invitation to join a cabal: {inviteData.name}
          </p>
          <p>
            Members of this cabal include:{" "}
          </p>
            {inviteData.members.map(member => member.name).join(", ")}
          
          <Group>
            <Button
              color="gray"
              onClick={() =>
                handleAcceptInvite(awakened, inviteData, updateCabal, setCabalData)
              }
            >
              Accept
            </Button>
            <Button
              color="gray"
              onClick={() =>
                handleRejectInvite(
                  awakened,
                  inviteData,
                  setInviteData,
                  updateCabal,
                  getCabalInvitations
                )
              }
            >
              Reject
            </Button>
          </Group>
        </Modal>
      );
    }
  };
  
  const filteredDomainAwakenedList = domainAwakenedList.filter((character) => {
    return character.background.showPublic || character.id !== awakened.id
  })

  const selectData = filteredDomainAwakenedList.map((character) => ({
    label: `${character.name}`,
    value: `${character.id}`,
  }))

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ label, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others} style={{border: '1px solid white'}}>
            <Group noWrap>
            <div>
                <Text size="sm" color="white">{label}</Text>
            </div>
            </Group>
        </div>
    )
);  

  const [showCreate, setShowCreate] = useState(false)
  const createModal = () => {
    return (
      <Modal opened={showCreate} onClose={() => setShowCreate(false)}>
        <Modal.Body>
          <Stack>
          <TextInput
            label="Cabal Name"
            value={cabalData.name}
            onChange={(event) => setCabalData({...cabalData, name: event.target.value})}
          />
          <TextInput
            label="Cabal Concept"
            value={cabalData.concept}
            onChange={(event) => setCabalData({...cabalData, concept: event.target.value})}
          />
          <MultiSelect
            data={selectData}
            value={cabalData.invitations}
            onChange={(val) => setCabalData({
              ...cabalData,
              invitations: val
            })}
            placeholder="Invite Members"
            itemComponent={SelectItem}
            searchable
            style={{width:"70%"}}
          />
          <Button
            disabled={cabalData.name==="" || cabalData.concept===""}
            onClick={() => {
              handleCreateCabal(awakened, cabalData, setCabalData, onSubmitCabal)
            }}          
          > Confirm
          </Button>
          </Stack>
        </Modal.Body>
      </Modal>
    )
  }

  const memberCard = (character: CabalMember) => {
    const conStatus = character.merits.filter(
      (merit) => merit.name === "Status (Consilium)"
    );
    return (
      <Center key={character.id}>
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
  }

  const sharedMerits: Merit[] = cabalData.members
  .flatMap((member) => member.merits.filter((merit) => merit.name.includes("(Shared)")));

const meritsAccordion = () => {
  let cabalMerits: any[] = [];
  if (sharedMerits) {
    sharedMerits.forEach((merit) => {
      const currentLevel = currentMeritLevel(merit).level;
      const maxLevel = merit.name === "Sanctum (Shared)" ? 10 : 5;

      const matchingMeritIndex = cabalMerits.findIndex((item) => item.merit.name === merit.name);

      if (matchingMeritIndex !== -1) {
        cabalMerits[matchingMeritIndex].level += currentLevel;
      } else {
        cabalMerits.push({
          merit: merit,
          level: Math.min(currentLevel, maxLevel),
        });
      }
    });
  }


    return (
      <Accordion.Item value={"Shared Merits"}>
        <Accordion.Control>
          Shared Merits
        </Accordion.Control>
        <Accordion.Panel>
          <Table>
            <thead>
              <tr>
                <th>
                  Merit
                </th>
                <th>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {cabalMerits.map((merit) => {
                return (
                  <tr key={`${merit.name}`}>
                  <td style={{ minWidth: "150px" }}>
                  <Text>{merit.merit.name}</Text>
                  <Text>{merit.merit.rating}</Text>
                  <Text>{merit.merit.prerequisites? `PreReq: ${merit.merit.prerequisites}`: ''}</Text>
                  <Text>{merit.level}</Text>
                  </td>
                  <td dangerouslySetInnerHTML={{ __html: `${merit.merit.description}` }} />
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Accordion.Panel>
      </Accordion.Item>
    )

  }

  return (
    <>
      {cabalData.memberIds.length===0?
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
          <Alert color="gray">
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Cabal</Text>
            <p>{`A Cabal is a group of awakened mages who band together to share knowledge, protect each other, and/or pursue their shared magical goals. A Cabal is not tied to one's order, though a Cabal could be comprised of indiviuals solely of one order, but is more a compact between companions or between individuals sharing a common interest or quest.`}</p>
            <p>{`Cabals are formed around a `}<strong>Protocol</strong>{`, the reason that binds them togeather. A Protocol is set in stone as an Oath (need not be magically binding), and can only be changed with the agreement of two thirds membership`}</p>
            <Center><Button color="gray" onClick={() => setShowCreate(true)}>Create Cabal</Button>
            { inviteData.invitations.includes(awakened.id?awakened.id:"")?
            <Button color="gray" onClick={() => setShowInvite(true)}>Check Invites</Button>
              :
              <></>
            }
            </Center>
            </Alert>
          {createModal()}
          {inviteModal()}
        </Center>
      :
      <Center>

        <Stack>

        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Cabal</Text>
        <Alert color='gray'>
          <Grid columns={8}>
            <Grid.Col span={4}>
            <TextInput
              value={cabalData.name}
              label="Cabal Name"
              disabled={awakened.id !== cabalData.ownerId}
            />
            </Grid.Col>
            <Grid.Col span={4}>
            <TextInput
              value={cabalData.concept}
              label="Cabal Concept"
              disabled={awakened.id !== cabalData.ownerId}
            />
            </Grid.Col>
            <Grid.Col span={4}>
            <Textarea
              value={cabalData.tenants || ''}
              label="Cabal Tenants"
              disabled={awakened.id !== cabalData.ownerId}
            />
            </Grid.Col>
            <Grid.Col span={4}>
            <Textarea
              value={cabalData.goals || ''}
              label="Cabal Goals"
              disabled={awakened.id !== cabalData.ownerId}
            />
            </Grid.Col>
          </Grid>
          </Alert>

          <Text mt={"xl"} ta="center" fz="xl" fw={700}>Members</Text>
          <Alert color="gray">
            <Grid columns={8}>
            {cabalData.members.map((character) => (
              <Grid.Col span={4}>
              {memberCard(character)}
              </Grid.Col>
              ))}
            </Grid>
          </Alert>


          <Text mt={"xl"} ta="center" fz="xl" fw={700}>Sanctum</Text>
          <Alert color='gray'>
            <Grid columns={8}>
            <Grid.Col span={4}>
            <Textarea
              value={cabalData.sanctum.location}
              label="Sanctum Location"
              disabled={awakened.id !== cabalData.ownerId}
            />
            </Grid.Col>
            <Grid.Col span={4}>
            <Textarea
              value={cabalData.sanctum.description}
              label="Sanctum Description"
              disabled={awakened.id !== cabalData.ownerId}
            />
            </Grid.Col>
          </Grid>
          <Accordion>
          {meritsAccordion()}
          </Accordion>
          </Alert>

        </Stack>

        <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
          <Group>
            <Button.Group>
              <Button 
              style={{ margin: "5px" }}
              color="gray"
              onClick={handleUpdateCabal}
              >
                Update Cabal
              </Button>
              <Button
                style={{ margin: "5px" }}
                color="gray"
                onClick={() => {
                  if (awakened.id) {
                    handleLeaveCabal(awakened.id, cabalData, updateCabal, setCabalData);
                  } else {
                    console.log("Awakened ID is undefined");
                  }
                }}
              >
                Leave Cabal
              </Button>
            </Button.Group>
          </Group>
        </Alert>
      </Center>
      }
    </>
    )
}

export default CabalTab