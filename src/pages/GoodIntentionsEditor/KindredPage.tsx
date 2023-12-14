import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
import { Center, Tabs, Stack, Button, Alert, Text, useMantineTheme } from "@mantine/core";
import _ from 'lodash';

// Context
import { useCharacterDb } from "../../contexts/CharacterContext";
import { useAuth } from "../../contexts/AuthContext";
// Data
import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred";
import { remainingExperience } from "../../data/GoodIntentions/types/V5Experience";
import { useGiVssDb } from "../../contexts/GiVssContext";
// Components
import ExperienceAside from "./ExperienceAside";
import PrintSheetCore from "../../components/GoodIntentions/PrintSheet/PrintSheet";
import V5XpInputs from "../../components/GoodIntentions/V5XpInputs";
import BackstoryTab from "../../components/GoodIntentions/V5BackstoryTab";
import RetireModal from "../../components/GoodIntentions/Editor/RetireModal";
import CoterieSheet from "../../components/GoodIntentions/Coterie/coterieSheet";
import StorytellerEditSheet from "../../components/GoodIntentions/StorytellerEdit/StorytellerEditSheet";

import { globals } from "../../assets/globals";
import { getEmptyCoterie } from "../../data/GoodIntentions/types/Coterie";
import UpdateModal from "./UpdateModal";
import LogPage from "./LogPage";
import { getEmptyUser } from "../../data/CaM/types/User";
import { useUser } from "../../contexts/UserContext";
import { Chronciles } from "../../data/CaM/types/Chronicles";

const KindredPage = () => {
  const theme = useMantineTheme()

  const { characterId } = useParams();
  const { getKindredById } = useCharacterDb();
  const [showRetire, setShowRetire] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const { getVssById } = useGiVssDb();



  const [coterie, setCoterie] = useState(getEmptyCoterie())
  const [initialKindred, setInitialKindred] = useLocalStorage<Kindred>({
    key: `initKindred id ${characterId}`,
    defaultValue: getEmptyKindred(),
  })
  const [kindred, setKindred] = useLocalStorage<Kindred>({
    key: `kindred id ${characterId}`,
    defaultValue: getEmptyKindred(),
  })

  useEffect(() => {
    if (characterId && !kindred.id) {
      getKindredById(characterId, setKindred)
    }
    if (initialKindred.uid === "") {
      setInitialKindred(kindred)
    }
  })

  const [venueData, setVenueData] = useState<any>(null)

  useEffect(() => {
    // Fetch venue data only when venueId changes
    if (kindred.vssId) {
      getVssById(kindred.vssId, setVenueData);
    }
  }, [getVssById, kindred.vssId]);

  // Get UserData

  const { fetchUserData } = useUser();
  const [userData, setUserData] = useLocalStorage({ key: 'userData', defaultValue: getEmptyUser() });

  useEffect(() => {
    if (userData.uid === "") {
      fetchUserData(setUserData);
    }
  }, [fetchUserData, userData, setUserData])

  if (venueData === null) {
    console.log("Loading...");
    return (
      <></>
    )
  }

  if (!venueData) {
    console.log("invalid venue id")
    return (
      <></>
    )
  }

  const isSt = userData.roles && (userData.roles.includes(venueData.venueStyleSheet.storyteller) || userData.roles.includes(Chronciles["Good Intentions"].leadStoryteller));

  if (!isSt) {
    if ((currentUser && kindred.uid !== currentUser.uid) || !currentUser || !venueData) {
      return null
    }
  }

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
      <Tabs variant="outline" defaultValue="print sheet" orientation={globals.isPhoneScreen ? "vertical" : "horizontal"}>
        <Stack spacing="0">
          <Center>
            <Tabs.List className="no-print">
              <Tabs.Tab value="storyteller tab">Storyteller Sheet</Tabs.Tab>
              <Tabs.Tab value="coterie"><Text color={theme.colors.red[8]}>Coterie</Text></Tabs.Tab>
              <Tabs.Tab value="experience"><Text color={theme.colors.grape[8]}>XP Tab</Text></Tabs.Tab>
              <Tabs.Tab value="logs">Logs</Tabs.Tab>
              <Tabs.Tab value="background"><Text color={theme.colors.blue[8]}>Background</Text></Tabs.Tab>
              <Tabs.Tab value="print sheet"><Text color={theme.colors.green[9]}>Print Sheet</Text></Tabs.Tab>
            </Tabs.List>
          </Center>

          <Tabs.Panel value="coterie" pt="xs">
            {kindred ?
              <CoterieSheet kindred={kindred} setKindred={setKindred} initialKindred={initialKindred} setInitialKindred={setInitialKindred} coterie={coterie} setCoterie={setCoterie} />
              : null}
          </Tabs.Panel>

          <Tabs.Panel value="experience" pt="xs">
            {kindred ?
              <V5XpInputs kindred={kindred} setKindred={setKindred} venueData={venueData} />
              : null}
          </Tabs.Panel>

          <Tabs.Panel value="background" pt="xs">
            {kindred ?
              <BackstoryTab kindred={kindred} setKindred={setKindred} />
              : null}
          </Tabs.Panel>

          <Tabs.Panel value="logs" pt="xs">
            {kindred ?
              <LogPage kindred={kindred} />
              : null}
          </Tabs.Panel>

          <Tabs.Panel value="print sheet" pt="xs">
            {kindred ?
              <PrintSheetCore kindred={kindred} vssId={kindred.vssId} />
              : null}
          </Tabs.Panel>

          <Tabs.Panel value="storyteller tab" pt="xs">
            {kindred ?
              <StorytellerEditSheet kindred={kindred} setKindred={setKindred} venueData={venueData} />
              : null}
          </Tabs.Panel>

        </Stack>
      </Tabs>
      <RetireModal kindred={kindred} showRetire={showRetire} setShowRetire={setShowRetire} />
      <UpdateModal showUpdate={showUpdate} setShowUpdate={setShowUpdate} kindred={kindred} setKindred={setKindred} initialKindred={initialKindred} setInitialKindred={setInitialKindred} />
      <ExperienceAside kindred={kindred} />
      <Button.Group className="no-print" style={{ position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
        <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
          <Button
            style={{ margin: "5px" }}
            color="gray"
            disabled={remainingExperience(kindred) < 0 || _.isEqual(initialKindred, kindred)}
            onClick={() => setShowUpdate(true)}>
            Update
          </Button>
          <Button
            style={{ margin: "5px" }}
            color="gray"
            onClick={() => { setShowRetire(true); }}
          >
            Retire
          </Button>
        </Alert>
      </Button.Group>
    </Center>

  )

}

export default KindredPage