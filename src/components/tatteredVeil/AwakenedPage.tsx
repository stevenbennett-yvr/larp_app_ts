import { useParams } from "react-router-dom";
import { useMageDb } from "../../contexts/MageContext";
import { useLocalStorage } from "@mantine/hooks";
import { Awakened, getEmptyAwakened, fetchAwakenedCharacter } from "./data/Awakened";
import { useEffect } from "react";
import { Tabs, Center } from "@mantine/core";
import AwakenedSheet from './CharacterTabs/ExperienceTab'
import BackgroundPage from './CharacterTabs/BackgroundTab'
import ChangeLogTab from './CharacterTabs/ChangeLogTab'
import CabalTab from "./CharacterTabs/CabalTab";
import { globals } from "../../globals";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { logChanges } from "./Generator/utils/Logging";
import { useCabalDb } from "../../contexts/CabalContext";
import { emptyCabal, Cabal, fetchCabalData, fetchInviteData } from "./data/Cabals";

const AwakenedPage = () => {
    const { characterId } = useParams();
    const { domainAwakenedList, getAwakenedById, fetchDomainAwakened, updateAwakened } = useMageDb();
    const { updateCabal, getCabalData, getCabalInvitations } = useCabalDb()
    const { currentUser } = useAuth();
    const navigate = useNavigate();

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
    const [inviteData, setInviteData] = useLocalStorage<Cabal>({
      key: `inviteFor id ${characterId}`,
      defaultValue: emptyCabal(),
    });

    useEffect(() => {
      if (characterId && currentUser) {
        fetchAwakenedCharacter(characterId, currentUser, setAwakened, setInitialAwakened, getAwakenedById, navigate);
      }
    }, [characterId, currentUser, setInitialAwakened, getAwakenedById, setAwakened, navigate]);  

    useEffect(() => {
        fetchDomainAwakened()
      }, [domainAwakenedList, fetchDomainAwakened]);

    useEffect(() => {
      if (characterId) {
        fetchCabalData(awakened, cabalData, setCabalData, getCabalData);
      }
    }, [awakened, cabalData, characterId, getCabalData, setCabalData])

    useEffect(() => {
      if (characterId) {
        fetchInviteData(awakened, setInviteData, getCabalInvitations);
      }
    }, [awakened, setInviteData, getCabalInvitations, characterId])

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
    
          updateCabal(cabalData.id, updatedCabalData);
          setCabalData(updatedCabalData);
          localStorage.setItem(`cabalMember id ${characterId}`, JSON.stringify(updatedCabalData));
        }
      }
    };


    return (
      <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
        <Tabs defaultValue="experience">
          <Center>
        <Tabs.List>
          <Tabs.Tab value="experience">Character Sheet</Tabs.Tab>
          <Tabs.Tab value="background">Background</Tabs.Tab>
          <Tabs.Tab value="cabal">Cabal</Tabs.Tab>
          <Tabs.Tab value="change log">Change Log</Tabs.Tab>
        </Tabs.List>
        </Center>
  
        <Tabs.Panel value="experience" pt="xs">
          {awakened?
            <AwakenedSheet awakened={awakened} setAwakened={setAwakened} handleUpdate={handleUpdate} />
          :null}
          </Tabs.Panel>
  
        <Tabs.Panel value="background" pt="xs">
          {awakened?
          <BackgroundPage awakened={awakened} setAwakened={setAwakened} handleUpdate={handleUpdate} />
          :null}
        </Tabs.Panel>
  
        <Tabs.Panel value="cabal" pt="xs">
            {awakened?
            <CabalTab awakened={awakened} setAwakened={setAwakened} domainAwakenedList={domainAwakenedList} cabalData={cabalData} setCabalData={setCabalData} inviteData={inviteData} setInviteData={setInviteData}/>
            :null}
        </Tabs.Panel>

        <Tabs.Panel value="change log" pt="xs">
          {awakened?
          <ChangeLogTab awakened={awakened} />
          :null}
        </Tabs.Panel>
      </Tabs>
      </Center>
    );
};

export default AwakenedPage;
