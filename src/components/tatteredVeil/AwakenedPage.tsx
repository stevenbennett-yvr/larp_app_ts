import { useParams } from "react-router-dom";
import { useMageDb } from "../../contexts/MageContext";
import { useLocalStorage } from "@mantine/hooks";
import { Awakened, getEmptyAwakened } from "./data/Awakened";
import { useEffect } from "react";
import { Tabs, Center } from "@mantine/core";
import AwakenedSheet from './CharacterTabs/ExperienceTab'
import BackgroundPage from './CharacterTabs/BackgroundTab'
import ChangeLogTab from './CharacterTabs/ChangeLogTab'
import CabalTab from "./CharacterTabs/CabalTab";
import { globals } from "../../globals";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AwakenedPage = () => {
    const { characterId } = useParams();
    const { getAwakenedById } = useMageDb();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
  
    const [awakened, setAwakened] = useLocalStorage<Awakened>({
      key: `id ${characterId}`, // Use a different key for local storage
      defaultValue: getEmptyAwakened(),
    });
  
    useEffect(() => {
      if (characterId && currentUser) {
        const fetchAwakenedCharacter = async () => {
          const localStorageCharacter = localStorage.getItem(`id ${characterId}`);
          if (localStorageCharacter) {
            let awakened = JSON.parse(localStorageCharacter)
            if (awakened.uid === currentUser.uid) {
              setAwakened(JSON.parse(localStorageCharacter));
            } else {
              localStorage.removeItem(`id ${characterId}`)
              navigate('/')
            }
          } else {
            const character = await getAwakenedById(characterId);
            if (character && currentUser && character.uid === currentUser.uid) {
              setAwakened(character);
              localStorage.setItem(`id ${characterId}`, JSON.stringify(character));
            } else {
              localStorage.removeItem(`id ${characterId}`)
              navigate('/')
            }
          }
        };
  
        fetchAwakenedCharacter();
      }
    }, [characterId, currentUser, getAwakenedById, setAwakened, navigate]);  

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
            <AwakenedSheet awakened={awakened} setAwakened={setAwakened} />
          :null}
          </Tabs.Panel>
  
        <Tabs.Panel value="background" pt="xs">
          {awakened?
          <BackgroundPage awakened={awakened} setAwakened={setAwakened} />
          :null}
        </Tabs.Panel>
  
        <Tabs.Panel value="cabal" pt="xs">
            {awakened?
            <CabalTab awakened={awakened} setAwakened={setAwakened}/>
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
