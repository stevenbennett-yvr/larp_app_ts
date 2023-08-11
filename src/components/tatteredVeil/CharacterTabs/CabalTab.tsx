//technical imports
import { Alert, Button, Center, Text, Modal, Group, TextInput, Select, Stack } from "@mantine/core";
import { Awakened } from "../data/Awakened";

import React, { useEffect, useState, forwardRef } from "react";
import { useCabalDb } from "../../../contexts/CabalContext";
import { emptyCabal, Cabal, fetchInviteData, fetchCabalData, handleAcceptInvite, handleRejectInvite, handleCreateCabal } from "../data/Cabals";
import { globals } from "../../../globals";

type CabalEditProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    domainAwakenedList: Awakened[]
}

// TODO: Figure out how to elegantly set awakened.cabalId to cabal id.


const CabalTab = ({awakened, domainAwakenedList}: CabalEditProps) => {
  const [inviteData, setInviteData] = useState<Cabal | null>(null);
  const [cabalData, setCabalData] = useState(emptyCabal());
  const { getCabalInvitations, getCabalData, updateCabal, onSubmitCabal } = useCabalDb()
  const characterId = awakened.id
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (!inviteData && characterId) {
      fetchInviteData(awakened, setInviteData, getCabalInvitations);
      setShowInvite(!inviteData);
    }
  }, [awakened, inviteData, characterId, getCabalInvitations]);

  // get and update Merit Data.
  useEffect(() => {
    if (characterId) {
      fetchCabalData(awakened, cabalData, setCabalData, updateCabal, getCabalData);
    }
  }, [awakened, characterId, cabalData, getCabalData, updateCabal]);




  const inviteModal = () => {
    if (inviteData) {
    return (
    <Modal opened={showInvite} onClose={() => setShowInvite(false)}>
        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Invite Recieved</Text>
        <p>You have recieved an invitatioo to join the cabal : {inviteData.name}</p>
        <p>Members of this cabal include: {inviteData.members.map(member => member.name).join(", ")}</p>
        <Group>
          <Button onClick={() => handleAcceptInvite(awakened, inviteData, updateCabal, setCabalData)}>
            Accept
          </Button>
          <Button onClick={() => handleRejectInvite(awakened, inviteData, setInviteData, updateCabal, getCabalInvitations)}>
            Reject
          </Button>
        </Group>

    </Modal>
    )
    }
  }


  const filteredDomainAwakenedList = domainAwakenedList.filter((character) => {
    return character.cabalId !== "" || character.id !== awakened.id
  })

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>("");

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
          <Select
            data={selectData}
            value={selectedCharacter}
            onChange={(val) => setSelectedCharacter(val)}
            placeholder="Invite Members"
            itemComponent={SelectItem}
            searchable
            allowDeselect
            style={{width:"70%"}}
          />
          <Button
            disabled={cabalData.name==="" || cabalData.concept===""}
            onClick={() => {
              if (selectedCharacter){
                setCabalData({...cabalData, invitations: [selectedCharacter]})
              }
              handleCreateCabal(awakened, cabalData, setCabalData, onSubmitCabal)}}
          > Confirm
          </Button>
          </Stack>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <>
      {cabalData.ownerId===""?
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
          <Alert color="gray">
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Cabal</Text>
            <p>{`A Cabal is a group of awakened mages who band together to share knowledge, protect each other, and/or pursue their shared magical goals. A Cabal is not tied to one's order, though a Cabal could be comprised of indiviuals solely of one order, but is more a compact between companions or between individuals sharing a common interest or quest.`}</p>
            <p>{`Cabals are formed around a `}<strong>Protocol</strong>{`, the reason that binds them togeather. A Protocol is set in stone as an Oath (need not be magically binding), and can only be changed with the agreement of two thirds membership`}</p>
            <Center><Button color="gray" onClick={() => setShowCreate(true)}>Create Cabal</Button></Center>
          </Alert>
          {createModal()}
          {inviteModal()}
        </Center>
      :
      <Center>


        <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
          <Group>
            <Button.Group>
              <Text fz={globals.smallerFontSize} style={{ margin: "10px"}}>Update Cabal Note</Text>
            </Button.Group>
          </Group>
        </Alert>
      </Center>
      }
    </>
    )
}

export default CabalTab