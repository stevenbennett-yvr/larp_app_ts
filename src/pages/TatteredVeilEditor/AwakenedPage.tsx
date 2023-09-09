import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, Center, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useMageDb } from "../../contexts/MageContext";
import { useCabalDb } from "../../contexts/CabalContext";
import { useAuth } from "../../contexts/AuthContext";
import { Awakened, getEmptyAwakened, fetchAwakenedCharacter } from "../../data/TatteredVeil/types/Awakened";
import { emptyCabal, Cabal } from "../../data/TatteredVeil/types/Cabals";
import AwakenedSheet from './CharacterTabs/ExperienceTab'
import BackgroundPage from './CharacterTabs/BackgroundTab'
import ChangeLogTab from './CharacterTabs/ChangeLogTab'
import RetireModal from "./CharacterTabs/components/retireModal";
import { globals } from "../../assets/globals";
import { logChanges } from "../TatteredVeilGenerator/Generator/utils/Logging";
import PrintTab from "./CharacterTabs/PrintTab";

const AwakenedPage = () => {
  const { characterId } = useParams();
  const { domainAwakenedList, getAwakenedById, fetchDomainAwakened, updateAwakened } = useMageDb();
  const { updateCabal } = useCabalDb()
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showRetire, setShowRetire] = useState<boolean>(false);

  const [initialAwakened, setInitialAwakened] = useLocalStorage<Awakened>({
    key: `initAwakened id ${characterId}`,
    defaultValue: getEmptyAwakened(),
  });
  const [awakened, setAwakened] = useLocalStorage<Awakened>({
    key: `awakened id ${characterId}`,
    defaultValue: getEmptyAwakened(),
  });
  const [cabalData, setCabalData] = useLocalStorage<Cabal>({
    key: `cabalMember id ${characterId}`,
    defaultValue: emptyCabal(),
  });


  useEffect(() => {
    if (characterId && currentUser) {
      fetchAwakenedCharacter(characterId, currentUser, setAwakened, setInitialAwakened, getAwakenedById, navigate);
    }
  }, [characterId, currentUser, setInitialAwakened, getAwakenedById, setAwakened, navigate]);

  useEffect(() => {
    if (domainAwakenedList.length === 0) {
      fetchDomainAwakened();
    }
  }, [domainAwakenedList, fetchDomainAwakened]);

/*   useEffect(() => {
    if (characterId) {
      fetchCabalData(awakened, cabalData, setCabalData, getCabalData);
    }
  }, [awakened, cabalData, characterId, getCabalData, setCabalData]);

  useEffect(() => {
    if (characterId) {
      fetchInviteData(awakened, inviteData, setInviteData, getCabalInvitations);
    }
  }, [awakened, inviteData, setInviteData, getCabalInvitations, characterId]);
 */

  /* 
  history, goals, and description need to be set seperately and fed into the background tab.
  This is fucking stupid but with how the RichTextEditor appears to run constantly without change this is required in order for the app to not crash.
  */



  const handleUpdate = () => {

    if (awakened.id && awakened !== initialAwakened) {
      const updatedAwakened = {
        ...awakened,
        changeLogs: {
          ...awakened.changeLogs,
          [new Date().toISOString()]: logChanges(initialAwakened, awakened),
        },
      };

      updateAwakened(awakened.id, updatedAwakened);
      setAwakened(updatedAwakened);
      setInitialAwakened(updatedAwakened);

      // Update member in the cabalData.members array
      if (cabalData.id) {
        const updatedMembers = cabalData.members.map(member =>
          member.id === awakened.id
            ? {
              ...member,
              name: awakened.name,
              concept: awakened.concept,
              path: awakened.path,
              order: awakened.order,
              merits: awakened.merits,
              background: awakened.background,
            }
            : member
        );

        const updatedCabalData = {
          ...cabalData,
          members: updatedMembers,
        };

        localStorage.setItem(`cabalMember id ${characterId}`, JSON.stringify(updatedCabalData));
      }
    }
  };

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
      <Tabs defaultValue="experience" orientation={globals.isPhoneScreen?"vertical":"horizontal"}>
        <Stack spacing="0">
        <Center>
          <Tabs.List style={{ paddingBottom: "10px"}}>
            <Tabs.Tab value="experience">Character Sheet</Tabs.Tab>
            <Tabs.Tab value="background">Background</Tabs.Tab>
            {!globals.isPhoneScreen?
            <Tabs.Tab value="change log">Change Log</Tabs.Tab>
            :<></>}
            <Tabs.Tab value="print sheet">Print Sheet</Tabs.Tab>
          </Tabs.List>
        </Center>

        <Tabs.Panel value="experience" pt="xs">
          {awakened ?
            <AwakenedSheet awakened={awakened} setAwakened={setAwakened} handleUpdate={handleUpdate} setShowRetire={setShowRetire} />
            : null}
        </Tabs.Panel>

        <Tabs.Panel value="background" pt="xs">
          {awakened ?
            <BackgroundPage awakened={awakened} setAwakened={setAwakened} handleUpdate={handleUpdate} setShowRetire={setShowRetire} />
            : null}
        </Tabs.Panel>

        <Tabs.Panel value="change log" pt="xs">
          {awakened ?
            <ChangeLogTab awakened={awakened} />
            : null}
        </Tabs.Panel>

        <Tabs.Panel value="print sheet" pt="xs">
          {awakened ?
            <PrintTab awakened={awakened} />
            : null}
        </Tabs.Panel>


        <RetireModal
          awakened={awakened}
          showRetire={showRetire}
          setShowRetire={setShowRetire}
          cabalData={cabalData}
          setCabalData={setCabalData}
          updateCabal={updateCabal}
        />
        </Stack>
      </Tabs>
    </Center>
  );
};

export default AwakenedPage;
