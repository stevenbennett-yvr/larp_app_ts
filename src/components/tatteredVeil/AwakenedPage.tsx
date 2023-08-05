import { useParams } from "react-router-dom";
import { useMageDb } from "../../contexts/MageContext";
import { useLocalStorage } from "@mantine/hooks";
import { Awakened, getEmptyAwakened } from "./data/Awakened";
//import { useState } from "react";
import { Tabs, Center } from "@mantine/core";
import AwakenedSheet from './CharacterPages/ExperienceTab'
import BackgroundPage from './CharacterPages/BackgroundPage'
import { globals } from "../../globals";

const AwakenedPage = () => {
    const { characterId } = useParams();
    const { getAwakenedById } = useMageDb();

    // Fetch the awakened character using getAwakenedById
    const awakenedCharacter = characterId ? getAwakenedById(characterId) : getEmptyAwakened();

    // Set the fetched character as the initial value for useLocalStorage
    const [awakened, setAwakened] = useLocalStorage<Awakened>({ key: `${characterId}`, defaultValue: awakenedCharacter });
    //const [initialAwakened] = useState<Awakened>(awakenedCharacter);

    return (
      <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
        <Tabs defaultValue="experience">
        <Tabs.List>
          <Tabs.Tab value="experience">Character Sheet</Tabs.Tab>
          <Tabs.Tab value="background">Background</Tabs.Tab>
          <Tabs.Tab value="coterie">Coterie</Tabs.Tab>
        </Tabs.List>
  
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
  
        <Tabs.Panel value="coterie" pt="xs">
          Settings tab content
        </Tabs.Panel>
      </Tabs>
      </Center>
    );
};

export default AwakenedPage;
