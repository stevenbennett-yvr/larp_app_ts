import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, Center, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useMageDb } from "../../contexts/MageContext";
import { useCabalDb } from "../../contexts/CabalContext";
import { Awakened, getEmptyAwakened, fetchAwakenedCharacter } from "../../data/TatteredVeil/types/Awakened";
import { emptyCabal, Cabal } from "../../data/TatteredVeil/types/Cabals";
import AwakenedSheet from './CharacterTabs/ExperienceTab'
import BackgroundPage from './CharacterTabs/BackgroundTab'
import ChangeLogTab from './CharacterTabs/ChangeLogTab'
import RetireModal from "./CharacterTabs/components/retireModal";
import { globals } from "../../assets/globals";
import { logChanges } from "../TatteredVeilGenerator/Generator/utils/Logging";
import PrintTab from "./CharacterTabs/PrintTab";
import { useUser } from "../../contexts/UserContext";
import { User } from "../../data/CaM/types/User";

const AwakenedPage = () => {
  const { characterId } = useParams();
  const { domainAwakenedList, getAwakenedById, fetchDomainAwakened, updateAwakened } = useMageDb();
  const { updateCabal } = useCabalDb()
  const navigate = useNavigate();
  const [showRetire, setShowRetire] = useState<boolean>(false);

  const { getUser } = useUser();
  const [userData, setUserData] = useState<User>(() => {
      const savedUserData = localStorage.getItem('userData');
      return savedUserData ? JSON.parse(savedUserData) : '';
  });
  useEffect(() => {
      if (!userData) { // Check if userData is not set
          const fetchUserData = async () => {
              const fetchedUserData = await getUser();
              console.log("fetch userData")
              if (fetchedUserData) {
                  setUserData(fetchedUserData);
                  localStorage.setItem('userData', JSON.stringify(fetchedUserData));
              } else {
                  console.log("User data not found");
              }
          };

          fetchUserData();
      }
  }, []);


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
    if (characterId && userData) {
      fetchAwakenedCharacter(characterId, userData, setAwakened, setInitialAwakened, getAwakenedById, navigate);
    }
  }, [characterId, userData, setInitialAwakened, getAwakenedById, setAwakened, navigate]);

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
